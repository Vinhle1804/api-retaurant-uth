import prisma from '@/database'
import { UpdateOrderOnlineBodyType } from '@/schemaValidations/onlineOrder.schema';

export const getOrdersOnlineController = async ({ fromDate, toDate }: { fromDate?: Date; toDate?: Date }) => {
  const orders = await prisma.order.findMany({
    include: {
      account: true,
      dishSnapshot: true,
      orderHandler: true
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
export const updateOrderOnlineController = async (
  orderId: number,
  body: UpdateOrderOnlineBodyType & { orderHandlerId: number }
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
        account: true
      }
    })
    return newOrder
  })
  const socketRecord = await prisma.socket.findUnique({
    where: {
      accountId: result.accountId!
    }
  })
  return {
    order: result,
    socketId: socketRecord?.socketId
  }
}
