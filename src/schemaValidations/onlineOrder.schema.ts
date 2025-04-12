import { DishStatusValues, OrderStatusValues } from '@/constants/type'
import { AccountSchema } from '@/schemaValidations/account.schema'
import z from 'zod'

const DishSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  status: z.enum(DishStatusValues),
  dishId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})
export const OrderOnlineSchema = z.object({
  id: z.number(),
  accountId: z.number().nullable(),
  account: z
    .object({
      id: z.number(),
      name: z.string(),
      createdAt: z.date(),
      updatedAt: z.date()
    })
    .nullable(),
  dishSnapshotId: z.number(),
  dishSnapshot: DishSnapshotSchema,
  quantity: z.number(),
  orderHandlerId: z.number().nullable(),
  orderHandler: AccountSchema.nullable(),
  status: z.enum(OrderStatusValues),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const GetOrdersOnlineQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional()
})
export type GetOrdersOnlineQueryParamsType = z.TypeOf<typeof GetOrdersOnlineQueryParams>

export const GetOrdersOnlineRes = z.object({
  message: z.string(),
  data: z.array(OrderOnlineSchema)
})

export const GetOrderOnlineDetailRes = z.object({
  message: z.string(),
  data: OrderOnlineSchema
})
export type GetOrderDetailResType = z.TypeOf<typeof GetOrderOnlineDetailRes>

export const UpdateOrderOnlineBody = z.object({
  status: z.enum(OrderStatusValues),
  dishId: z.number(),
  quantity: z.number()
})
export type UpdateOrderOnlineBodyType = z.TypeOf<typeof UpdateOrderOnlineBody>

export const OrderParam = z.object({
  orderId: z.coerce.number()
})
export type OrderParamType = z.TypeOf<typeof OrderParam>

export const UpdateOrderOnlineRes = z.object({
  message: z.string(),
  data: OrderOnlineSchema
})

export type UpdateOrderOnlineResType = z.TypeOf<typeof UpdateOrderOnlineRes>
