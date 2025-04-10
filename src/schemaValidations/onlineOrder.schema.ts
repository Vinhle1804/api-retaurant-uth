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



















