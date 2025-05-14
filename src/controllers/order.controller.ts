import { DishStatus } from '@/constants/dishs'
import { PrismaErrorCode } from '@/constants/error-reference'
import { OrderStatus } from '@/constants/orders'
import { TableStatus } from '@/constants/tables'
import prisma from '@/database'
import { CreateDeliveryFeesBodyType } from '@/schemaValidations/deliveryFees.schema'
import { CreateOrdersBodyType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { EntityError, isPrismaClientKnownRequestError } from '@/utils/errors'

export const createOrdersController = async (orderHandlerId: number, body: CreateOrdersBodyType) => {
  const { guestId, orders } = body
  const guest = await prisma.guest.findUniqueOrThrow({
    where: {
      id: guestId
    }
  })
  if (guest.tableNumber === null) {
    throw new Error('Bàn gắn liền với khách hàng này đã bị xóa, vui lòng chọn khách hàng khác!')
  }
  const table = await prisma.table.findUniqueOrThrow({
    where: {
      number: guest.tableNumber
    }
  })
  if (table.status === TableStatus.Hidden) {
    throw new Error(`Bàn ${table.number} gắn liền với khách hàng đã bị ẩn, vui lòng chọn khách hàng khác!`)
  }

  const [ordersRecord, socketRecord] = await Promise.all([
    prisma.$transaction(async (tx) => {
      const ordersRecord = await Promise.all(
        orders.map(async (order) => {
          const dish = await tx.dish.findUniqueOrThrow({
            where: {
              id: order.dishId
            }
          })
          if (dish.status === DishStatus.Unavailable) {
            throw new Error(`Món ${dish.name} đã hết`)
          }
          if (dish.status === DishStatus.Hidden) {
            throw new Error(`Món ${dish.name} không thể đặt`)
          }
          const dishSnapshot = await tx.dishSnapshot.create({
            data: {
              description: dish.description,
              image: dish.image,
              name: dish.name,
              price: dish.price,
              dishId: dish.id,
              status: dish.status
            }
          })
          const orderRecord = await tx.order.create({
            data: {
              dishSnapshotId: dishSnapshot.id,
              guestId,
              quantity: order.quantity,
              tableNumber: guest.tableNumber,
              orderHandlerId,
              status: OrderStatus.Pending
            },
            include: {
              dishSnapshot: true,
              guest: true,
              orderHandler: true
            }
          })
          type OrderRecord = typeof orderRecord
          return orderRecord as OrderRecord & {
            status: (typeof OrderStatus)[keyof typeof OrderStatus]
            dishSnapshot: OrderRecord['dishSnapshot'] & {
              status: (typeof DishStatus)[keyof typeof DishStatus]
            }
          }
        })
      )
      return ordersRecord
    }),
    prisma.socket.findUnique({
      where: {
        guestId: body.guestId
      }
    })
  ])
  return {
    orders: ordersRecord,
    socketId: socketRecord?.socketId
  }
}

export const getOrdersController = async ({ fromDate, toDate }: { fromDate?: Date; toDate?: Date }) => {
  const orders = await prisma.order.findMany({
    include: {
      dishSnapshot: true,
      orderHandler: true,
      guest: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      createdAt: {
        gte: fromDate,
        lte: toDate
      }
    }
  })
  return orders
}

// Controller thanh toán các hóa đơn dựa trên guestId
export const payOrdersController = async ({ guestId, orderHandlerId }: { guestId: number; orderHandlerId: number }) => {
  const orders = await prisma.order.findMany({
    where: {
      guestId,
      status: {
        in: [OrderStatus.Pending, OrderStatus.Processing, OrderStatus.Delivered]
      }
    }
  })
  if (orders.length === 0) {
    throw new Error('Không có hóa đơn nào cần thanh toán')
  }
  await prisma.$transaction(async (tx) => {
    const orderIds = orders.map((order) => order.id)
    const updatedOrders = await tx.order.updateMany({
      where: {
        id: {
          in: orderIds
        }
      },
      data: {
        status: OrderStatus.Paid,
        orderHandlerId
      }
    })
    return updatedOrders
  })
  const [ordersResult, sockerRecord] = await Promise.all([
    prisma.order.findMany({
      where: {
        id: {
          in: orders.map((order) => order.id)
        }
      },
      include: {
        dishSnapshot: true,
        orderHandler: true,
        guest: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.socket.findUnique({
      where: {
        guestId
      }
    })
  ])
  return {
    orders: ordersResult,
    socketId: sockerRecord?.socketId
  }
}

export const getOrderDetailController = (orderId: number) => {
  return prisma.order.findUniqueOrThrow({
    where: {
      id: orderId
    },
    include: {
      dishSnapshot: true,
      orderHandler: true,
      guest: true,
      table: true
    }
  })
}

export const updateOrderController = async (
  orderId: number,
  body: UpdateOrderBodyType & { orderHandlerId: number }
) => {
  const { status, dishId, quantity, orderHandlerId } = body
  const result = await prisma.$transaction(async (tx) => {
    const order = await prisma.order.findUniqueOrThrow({
      where: {
        id: orderId
      },
      include: {
        dishSnapshot: true
      }
    })
    let dishSnapshotId = order.dishSnapshotId
    if (order.dishSnapshot.dishId !== dishId) {
      const dish = await tx.dish.findUniqueOrThrow({
        where: {
          id: dishId
        }
      })
      const dishSnapshot = await tx.dishSnapshot.create({
        data: {
          description: dish.description,
          image: dish.image,
          name: dish.name,
          price: dish.price,
          dishId: dish.id,
          status: dish.status
        }
      })
      dishSnapshotId = dishSnapshot.id
    }
    const newOrder = await tx.order.update({
      where: {
        id: orderId
      },
      data: {
        status,
        dishSnapshotId,
        quantity,
        orderHandlerId
      },
      include: {
        dishSnapshot: true,
        orderHandler: true,
        guest: true
      }
    })
    return newOrder
  })
  const socketRecord = await prisma.socket.findUnique({
    where: {
      guestId: result.guestId!
    }
  })
  return {
    order: result,
    socketId: socketRecord?.socketId
  }
}

export const createDeliveryFeesController = async (body: CreateDeliveryFeesBodyType) => {
  try {
    const deliveryFee = await prisma.deliveryFees.create({
      data: {
        code: body.code,
        label: body.label,
        description: body.description,
        estimatedTime: body.estimatedTime,
        baseFee: body.baseFee,
        extraFeePerKm: body.extraFeePerKm,
        maxDistance: body.maxDistance,
        isActive: body.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    return {
      success: true,
      message: 'created delivery fee successfully',
      data: deliveryFee
    }
  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      console.log(error)
      throw new EntityError([{ field: 'e', message: 'cos loi r' }])
    }
    throw error
  }
}
export const deleteDeliveryFeeController = async (id: number) => {
  try {
    const deleted = await prisma.deliveryFees.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'Deleted delivery fee successfully',
      data: deleted
    }
  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      // Nếu không tìm thấy bản ghi
      if (error.code === 'P2025') {
        throw new EntityError([{ field: 'id', message: 'Delivery fee not found' }])
      }
    }
    throw error
  }
}
export const getDeliveryFeeListController = async (isActive?: boolean) => {
  try {
    const deliveryFees = await prisma.deliveryFees.findMany({
      where: typeof isActive === 'boolean' ? { isActive } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      message: 'Fetched delivery fee list successfully',
      data: deliveryFees
    }
  } catch (error: any) {
    console.error('Error fetching delivery fee list:', error)
    throw new Error('Failed to fetch delivery fee list')
  }
}

