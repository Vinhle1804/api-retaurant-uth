import { DishStatus, OrderStatus, Role } from '@/constants/type'
import prisma from '@/database'
import { GuestOnlineCreateOrdersBodyType } from '@/schemaValidations/onlineGuest.schema'

//register
// export const registerController = async (body: RegisterBodyType)=>{
//     // Validate: Password vs Confirm Password
//     if (body.password !== body.confirmPassword) {
//       throw new EntityError([
//         { field: 'confirmPassword', message: 'Mật khẩu xác nhận không khớp' }
//       ])
//     }
//   const existingAccount = await prisma.guestOnlineAccount.findUnique({
//     where: {
//       email: body.email
//     }
//   })

//   if (existingAccount) {
//     throw new EntityError([{ field: 'email', message: 'Email đã tồn tại' }])
//   }
//   const hashedPassword = await hashPassword(body.password)
//   const account = await prisma.guestOnlineAccount.create({
//     data: {
//       name: body.name,
//       email: body.email,
//       password: hashedPassword,
//       role:  'GuestOnline'
//     }
//   })
//   const accessToken = signAccessToken({
//     userId: account.id,
//     role: account.role as RoleType
//   })
//   const refreshToken = signRefreshToken({
//     userId: account.id,
//     role: account.role as RoleType
//   })
//   const decodedRefreshToken = verifyRefreshToken(refreshToken)
//   const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000)

//   await prisma.refreshToken.create({
//     data: {
//       guestOnlineAccountId: account.id,
//       token: refreshToken,
//       expiresAt: refreshTokenExpiresAt
//     }
//   })
//   return {
//     account,
//     accessToken,
//     refreshToken
//   }
// }

export const guestOnlineCreateOrdersController = async (accountId: number, body: GuestOnlineCreateOrdersBodyType) => {
  const result = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: accountId
      }
    })

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
        const orderRecord = await tx.order.create({
          data: {
            dishSnapshotId: dishSnapshot.id,
            accountId,
            quantity: order.quantity,
            orderHandlerId: null,
            status: OrderStatus.Pending
          },
          include: {
            dishSnapshot: true,
            account: {
              select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true
              }
            },
            orderHandler: {
              select: {
                id: true,
                name: true,
                avatar: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
              }
            }
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

export const guestOnlineGetOrdersController = async (accountId: number) => {
  const orders = await prisma.order.findMany({
    where: {
      accountId
    },
    include: {
      dishSnapshot: true,
      orderHandler: true,
      account: true
    }
  })
  return orders
}