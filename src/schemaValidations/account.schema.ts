import { RoleValues } from '@/constants/roles'
import z from 'zod'
import { OrderOnlineSchema } from './onlineOrder.schema'
import { PaymentMethodValues } from '@/constants/type'

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string().optional(),
  avatar: z.string().nullable()
})

export type AccountType = z.TypeOf<typeof AccountSchema>

export const AddressSchema = z.object({
  id: z.number(),
  accountId: z.number(),
  recipientName: z.string().min(1, 'Tên người nhận không được để trống'),
  recipientPhone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không hợp lệ')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),

  province: z.string().min(1, 'Mã tỉnh không được để trống'),
  provinceName: z.string().min(1, 'Tên tỉnh không được để trống'),

  district: z.string().min(1, 'Mã quận/huyện không được để trống'),
  districtName: z.string().min(1, 'Tên quận/huyện không được để trống'),

  ward: z.string().min(1, 'Mã phường/xã không được để trống'),
  wardName: z.string().min(1, 'Tên phường/xã không được để trống'),

  addressDetail: z.string().min(1, 'Địa chỉ chi tiết không được để trống'),
  addressNotes: z.string().nullable()
})
export type AddressType = z.TypeOf<typeof AddressSchema>

export const AccountListRes = z.object({
  data: z.array(AccountSchema),
  message: z.string()
})

export type AccountListResType = z.TypeOf<typeof AccountListRes>

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string()
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountRes>

export const CreateEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
    role: z.enum(RoleValues).optional()
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type CreateEmployeeAccountBodyType = z.TypeOf<typeof CreateEmployeeAccountBody>

export const UpdateEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    changePassword: z.boolean().optional(),
    password: z.string().min(6).max(100).optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
    role: z.enum(RoleValues).optional()
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Hãy nhập mật khẩu mới và xác nhận mật khẩu mới',
          path: ['changePassword']
        })
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu không khớp',
          path: ['confirmPassword']
        })
      }
    }
  })

export type UpdateEmployeeAccountBodyType = z.TypeOf<typeof UpdateEmployeeAccountBody>

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional()
  })
  .strict()

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>

export const AccountIdParam = z.object({
  id: z.coerce.number()
})

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>

export const GetListGuestsRes = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date()
    })
  ),
  message: z.string()
})

export type GetListGuestsResType = z.TypeOf<typeof GetListGuestsRes>

export const GetGuestListQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional()
})

export type GetGuestListQueryParamsType = z.TypeOf<typeof GetGuestListQueryParams>

export const CreateGuestBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    tableNumber: z.number()
  })
  .strict()

export type CreateGuestBodyType = z.TypeOf<typeof CreateGuestBody>

export const CreateGuestRes = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    role: z.enum(RoleValues).optional(),
    tableNumber: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
  })
})

export type CreateGuestResType = z.TypeOf<typeof CreateGuestRes>

export const CreateOrderOnlineBody = z.object({
  items: z.array(
    z.object({
      dishId: z.number(),
      quantity: z.number()
    })
  ),
  deliveryAddress: z.object({
    id: z.number(),
    addressDetail: z.string(),
    province: z.string(),
    district: z.string(),
    ward: z.string(),
    provinceName: z.string(),
    districtName: z.string(),
    adressNotes: z.string().nullable()
  }),
  deliveryOption: z.string(),
  paymentMethod: z.enum(PaymentMethodValues), // Có thể đổi thành enum nếu cần
  utensilsNeeded: z.boolean()
})

export type CreateOrderOnlineBodyType = z.TypeOf<typeof CreateOrderOnlineBody>

export const CreateOrderOnlineRes = z.object({
  message: z.string(),
  data: z.array(OrderOnlineSchema)
})

export type CreateOrderOnlineResType = z.TypeOf<typeof CreateOrderOnlineRes>

export const CreateAddressBody = z.object({
  recipientName: z.string().min(1, 'Tên người nhận không được để trống'),
  recipientPhone: z
    .string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(15, 'Số điện thoại không hợp lệ')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),

  province: z.string().min(1, 'Mã tỉnh không được để trống'),
  provinceName: z.string().min(1, 'Tên tỉnh không được để trống'),

  district: z.string().min(1, 'Mã quận/huyện không được để trống'),
  districtName: z.string().min(1, 'Tên quận/huyện không được để trống'),

  ward: z.string().min(1, 'Mã phường/xã không được để trống'),
  wardName: z.string().min(1, 'Tên phường/xã không được để trống'),

  addressDetail: z.string().min(1, 'Địa chỉ chi tiết không được để trống'),
  addressNotes: z.string().nullable()
})
export type CreateAddressBodyType = z.infer<typeof CreateAddressBody>

export const CreateAddressRes = z.object({
  message: z.string(),
  data: AddressSchema
})

export type CreateAddressResType = z.infer<typeof CreateAddressRes>
