import { DishStatus, OrderStatus } from '@/constants/type'
import prisma from '@/database'
import { GuestOnlineCreateOrdersBodyType } from '@/schemaValidations/onlineGuest.schema'

export const guestOnlineCreateOrdersController = async (accountId: number, body: GuestOnlineCreateOrdersBodyType) => {
  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: accountId
      }
    })
    if (!account) {
      throw new Error('d tim thay account')
    }

    const orders = await Promise.all(
      body.map(async (order) => {
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
        const orderRecord = await tx.orderOnline.create({
          data: {
            dishSnapshotId: dishSnapshot.id,
            accountId,
            quantity: order.quantity,
            orderHandlerId: null,
            status: OrderStatus.Pending
          },
          include: {
            dishSnapshot: true,
            account: true,
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
    return orders
  })
  return result
}

export const guestGetOrdersController = async (guestId: number) => {
  const orders = await prisma.order.findMany({
    where: {
      guestId
    },
    include: {
      dishSnapshot: true,
      orderHandler: true,
      guest: true
    }
  })
  return orders
}
