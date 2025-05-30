import { DeliveryAddress } from './../../node_modules/.prisma/client/index.d'
import envConfig from '@/config'
import { DishStatus } from '@/constants/dishs'
import { PrismaErrorCode } from '@/constants/error-reference'
import { OrderStatus } from '@/constants/orders'
import { Role } from '@/constants/roles'
import { TableStatus } from '@/constants/tables'
import prisma from '@/database'
import {
  AddressType,
  ChangePasswordBodyType,
  CreateAddressBodyType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  CreateOrderOnlineBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
import { OrderOnlineSchema } from '@/schemaValidations/onlineOrder.schema'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { EntityError, isPrismaClientKnownRequestError } from '@/utils/errors'
import { getChalk } from '@/utils/helpers'
import { getDeliveryFeeListController } from './order.controller'

export const initOwnerAccount = async () => {
  const accountCount = await prisma.account.count()
  if (accountCount === 0) {
    const hashedPassword = await hashPassword(envConfig.INITIAL_PASSWORD_OWNER)
    await prisma.account.create({
      data: {
        name: 'Owner',
        email: envConfig.INITIAL_EMAIL_OWNER,
        password: hashedPassword,
        role: Role.Owner
      }
    })
    const chalk = await getChalk()
    console.log(
      chalk.bgCyan(
        `Khởi tạo tài khoản chủ quán thành công: ${envConfig.INITIAL_EMAIL_OWNER}|${envConfig.INITIAL_PASSWORD_OWNER}`
      )
    )
  }
}

export const createEmployeeAccount = async (body: CreateEmployeeAccountBodyType) => {
  try {
    const hashedPassword = await hashPassword(body.password)
    const account = await prisma.account.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: Role.Employee,
        avatar: body.avatar
      }
    })
    return account
  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new EntityError([{ field: 'email', message: 'Email đã tồn tại' }])
      }
    }
    throw error
  }
}

export const getEmployeeAccounts = async () => {
  const accounts = await prisma.account.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return accounts
}

export const getEmployeeAccount = async (accountId: number) => {
  const account = await prisma.account.findUniqueOrThrow({
    where: {
      id: accountId
    }
  })
  return account
}

export const getAccountList = async (accountId: number) => {
  const account = await prisma.account.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      id: {
        not: accountId
      }
    }
  })
  return account
}

export const updateEmployeeAccount = async (accountId: number, body: UpdateEmployeeAccountBodyType) => {
  try {
    if (body.changePassword) {
      const hashedPassword = await hashPassword(body.password!)
      const account = await prisma.account.update({
        where: {
          id: accountId
        },
        data: {
          name: body.name,
          email: body.email,
          avatar: body.avatar,
          password: hashedPassword,
          role: body.role
        }
      })
      return account
    } else {
      const account = await prisma.account.update({
        where: {
          id: accountId
        },
        data: {
          name: body.name,
          email: body.email,
          avatar: body.avatar,
          role: body.role
        }
      })
      return account
    }
  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new EntityError([{ field: 'email', message: 'Email đã tồn tại' }])
      }
    }
    throw error
  }
}

export const deleteEmployeeAccount = async (accountId: number) => {
  return prisma.account.delete({
    where: {
      id: accountId
    }
  })
}

export const getMeController = async (accountId: number) => {
  const account = prisma.account.findUniqueOrThrow({
    where: {
      id: accountId
    }
  })
  return account
}

export const updateMeController = async (accountId: number, body: UpdateMeBodyType) => {
  const account = prisma.account.update({
    where: {
      id: accountId
    },
    data: body
  })
  return account
}

export const changePasswordController = async (accountId: number, body: ChangePasswordBodyType) => {
  const account = await prisma.account.findUniqueOrThrow({
    where: {
      id: accountId
    }
  })
  const isSame = await comparePassword(body.oldPassword, account.password)
  if (!isSame) {
    throw new EntityError([{ field: 'oldPassword', message: 'Mật khẩu cũ không đúng' }])
  }
  const hashedPassword = await hashPassword(body.password)
  const newAccount = await prisma.account.update({
    where: {
      id: accountId
    },
    data: {
      password: hashedPassword
    }
  })
  return newAccount
}

export const getGuestList = async ({ fromDate, toDate }: { fromDate?: Date; toDate?: Date }) => {
  const orders = await prisma.guest.findMany({
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

export const createGuestController = async (body: CreateGuestBodyType) => {
  const table = await prisma.table.findUnique({
    where: {
      number: body.tableNumber
    }
  })
  if (!table) {
    throw new Error('Bàn không tồn tại')
  }

  if (table.status === TableStatus.Hidden) {
    throw new Error(`Bàn ${table.number} đã bị ẩn, vui lòng chọn bàn khác`)
  }
  const guest = await prisma.guest.create({
    data: body
  })
  return guest
}

export const createAddressController = async (accountId: number, body: CreateAddressBodyType) => {
  try {
    const newAddress = await prisma.deliveryAddress.create({
      data: {
        accountId,
        recipientName: body.recipientName,
        recipientPhone: body.recipientPhone,
        province: body.province,
        provinceName: body.provinceName,
        district: body.district,
        districtName: body.districtName,
        ward: body.ward,
        wardName: body.wardName,
        addressDetail: body.addressDetail,
        addressNotes: body.addressNotes || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(typeof newAddress.id)
    console.log(newAddress)

    return newAddress
  } catch (error: any) {
    if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
      throw new Error('Địa chỉ đã tồn tại hoặc bị trùng!')
    }
    throw error
  }
}

export const getAddressList = async (accountId: number) => {
  const address = await prisma.deliveryAddress.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      accountId: accountId
    }
  })
  return address
}

export const getAddressById = async (id: number) => {
  const address = await prisma.deliveryAddress.findUnique({
    where: { id }
  })

  if (!address) throw new Error('Không tìm thấy địa chỉ')

  return address
}

export const updateAddressController = async (
  accountId: number,
  id: number,
  updateData: Partial<Omit<AddressType, 'id' | 'accountId'>>
) => {
  // Tìm địa chỉ theo id và accountId để đảm bảo user có quyền update
  const address = await prisma.deliveryAddress.findFirst({
    where: { id, accountId }
  })

  if (!address) throw new Error('Không tìm thấy địa chỉ hoặc bạn không có quyền chỉnh sửa')

  // Thực hiện update
  const updatedAddress = await prisma.deliveryAddress.update({
    where: { id },
    data: updateData
  })

  return updatedAddress
}

// export const createOrderOnlineController = async (accountId: number, body: CreateOrderOnlineBodyType) => {
//   try {
//     const result = await prisma.$transaction(async (tx) => {
//       // Verify account exists
//       const account = await tx.account.findUniqueOrThrow({
//         where: {
//           id: accountId
//         }
//       })

//       // Generate tracking number (format: ORD-timestamp-randomDigits)
//       const timestamp = Date.now()
//       const randomDigits = Math.floor(1000 + Math.random() * 9000) // 4-digit random number
//       const trackingNumber = `ORD-${timestamp}-${randomDigits}`

//       // Get delivery fee from API
//       const deliveryFees = await getDeliveryFeeListController()
//       const selectedDeliveryFee = deliveryFees.data.find((fee) => fee.code === body.deliveryOption)
//       const deliveryFee = selectedDeliveryFee ? selectedDeliveryFee.baseFee : 0

//       // Create delivery address record
//       const deliveryAddress = await tx.deliveryAddress.create({
//         data: {
//           province: body.deliveryAddress.province,
//           provinceName: body.deliveryAddress.provinceName,
//           district: body.deliveryAddress.district,
//           districtName: body.deliveryAddress.districtName,
//           ward: body.deliveryAddress.ward,
//           addressDetail: body.deliveryAddress.addressDetail,
//           adressNotes: body.deliveryAddress.adressNotes || null
//         }
//       })

//       // Create the order first (we'll update totals later)
//       const orderOnline = await tx.orderOnline.create({
//         data: {
//           accountId,
//           status: OrderStatus.Pending,
//           paymentMethod: body.paymentMethod,
//           deliveryOption: body.deliveryOption,
//           trackingNumber,
//           totalPrice: 0, // Temporary, will update later
//           deliveryAddressId: deliveryAddress.id,
//           note: body.deliveryAddress.adressNotes || '' // Add note from delivery address notes
//         }
//       })

//       // Process all ordered items
//       let subtotal = 0
//       const orderItems = await Promise.all(
//         body.items.map(async (item) => {
//           // Verify dish exists and is available
//           const dish = await tx.dish.findUniqueOrThrow({
//             where: {
//               id: item.dishId
//             }
//           })

//           if (dish.status === DishStatus.Unavailable) {
//             throw new Error(`Món ${dish.name} đã hết`)
//           }

//           if (dish.status === DishStatus.Hidden) {
//             throw new Error(`Món ${dish.name} không thể đặt`)
//           }

//           // Create dish snapshot
//           const dishSnapshot = await tx.dishSnapshot.create({
//             data: {
//               description: dish.description,
//               image: dish.image,
//               name: dish.name,
//               price: dish.price,
//               dishId: dish.id,
//               status: dish.status
//             }
//           })

//           // Calculate item subtotal
//           const itemSubtotal = dish.price * item.quantity
//           subtotal += itemSubtotal

//           // Create order item
//           return tx.orderOnlineItem.create({
//             data: {
//               orderOnlineId: orderOnline.id,
//               dishSnapshotId: dishSnapshot.id,
//               quantity: item.quantity,
//               price: dish.price
//             },
//             include: {
//               dishSnapshot: true
//             }
//           })
//         })
//       )

//       // Update order with calculated totals
//       const updatedOrder = await tx.orderOnline.update({
//         where: {
//           id: orderOnline.id
//         },
//         data: {
//           totalPrice: subtotal + deliveryFee
//         },
//         include: {
//           items: {
//             include: {
//               dishSnapshot: true
//             }
//           },
//           deliveryAddress: true,
//           account: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               createdAt: true,
//               updatedAt: true
//             }
//           }
//         }
//       })

//       // Validate against schema
//       const validatedOrder = OrderOnlineSchema.parse(updatedOrder)
//       return validatedOrder
//     })

//     return {
//       data: [result],
//       message: `Đơn hàng đã được tạo thành công, mã theo dõi: ${result.trackingNumber}`
//     }
//   } catch (error) {
//     console.error('Error creating online order:', error)
//     throw error
//   }
// }
