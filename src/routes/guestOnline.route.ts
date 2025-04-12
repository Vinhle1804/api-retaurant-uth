import { ManagerRoom } from '@/constants/type'
import { guestOnlineCreateOrdersController } from '@/controllers/guestOnline.controller'
import { requireGuestOnlineHook, requireLoginedHook } from '@/hooks/auth.hooks'
import {
  GuestOnlineCreateOrdersBody,
  GuestOnlineCreateOrdersBodyType,
  GuestOnlineCreateOrdersRes,
  GuestOnlineCreateOrdersResType
} from '@/schemaValidations/onlineGuest.schema'

import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function guestOnlineRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // fastify.post<{ Reply: RegisterResType; Body: RegisterBodyType }>(
  //   '/register',
  //   {
  //     schema: {
  //       response: {
  //         200: RegisterRes
  //       },
  //       body: RegisterBody
  //     }
  //   },
  //   async (request, reply) => {
  //     const { body } = request
  //     const { accessToken, refreshToken, account } = await registerController(body)
  //     reply.send({
  //       message: 'dang ky thành công',
  //       data: {
  //         account: account as RegisterResType['data']['account'],
  //         accessToken,
  //         refreshToken
  //       }
  //     })
  //   }
  // )

  fastify.post<{
    Reply: GuestOnlineCreateOrdersResType
    Body: GuestOnlineCreateOrdersBodyType
  }>(
    '/orders',
    {
      schema: {
        response: {
          200: GuestOnlineCreateOrdersRes
        },
        body: GuestOnlineCreateOrdersBody
      },
      preValidation: fastify.auth([requireLoginedHook, requireGuestOnlineHook])
    },
    async (request, reply) => {
      const guestOnlineId = request.decodedAccessToken?.userId as number
      const result = await guestOnlineCreateOrdersController(guestOnlineId, request.body)
      fastify.io.to(ManagerRoom).emit('new-order', result)
      reply.send({
        message: 'Đặt món thành công',
        data: result
      })
    }
  )

  // fastify.get<{
  //   Reply: GetOrdersOnlineResType
  // }>(
  //   '/orders',
  //   {
  //     schema: {
  //       response: {
  //         200: GetOrdersOnlineRes
  //       }
  //     },
  //     preValidation: fastify.auth([requireLoginedHook, requireGuestOnlineHook])
  //   },
  //   async (request, reply) => {
  //     const accountId = request.decodedAccessToken?.userId as number
  //     const result = await guestOnlineGetOrdersController(accountId)
  //     reply.send({
  //       message: 'Lấy danh sách đơn hàng thành công',
  //       data: result as GetOrdersOnlineResType['data']
  //     })
  //   }
  // )
}
