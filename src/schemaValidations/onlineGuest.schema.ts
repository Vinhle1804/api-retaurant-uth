import { z } from "zod"
import { OrderOnlineSchema } from "./onlineOrder.schema"

export const GuestOnlineCreateOrdersBody = z.array(
  z.object({
    dishId: z.number(),
    quantity: z.number()
  })
)
export type GuestOnlineCreateOrdersBodyType = z.TypeOf<typeof GuestOnlineCreateOrdersBody>


export const GuestOnlineCreateOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderOnlineSchema)
})
export type GuestOnlineCreateOrdersResType = z.TypeOf<typeof GuestOnlineCreateOrdersRes>

export const GetOrdersOnlineRes = GuestOnlineCreateOrdersRes
export type GetOrdersOnlineResType = z.TypeOf<typeof GetOrdersOnlineRes>