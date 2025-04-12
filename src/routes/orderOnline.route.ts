import { ManagerRoom } from '@/constants/type'
import { getOrderDetailController, getOrdersController, updateOrderController } from '@/controllers/order.controller'
import { getOrdersOnlineController, updateOrderOnlineController } from '@/controllers/orderOnline.controller'
import { requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
import { GetOrdersOnlineResType } from '@/schemaValidations/onlineGuest.schema'
import {
  GetOrdersOnlineQueryParamsType,
  GetOrdersOnlineRes,
  UpdateOrderOnlineBody,
  UpdateOrderOnlineBodyType,
  UpdateOrderOnlineRes,
  UpdateOrderOnlineResType
} from '@/schemaValidations/onlineOrder.schema'
import {
  GetOrderDetailRes,
  GetOrderDetailResType,
  GetOrdersQueryParams,
  OrderParam,
  OrderParamType
} from '@/schemaValidations/order.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function orderOnlineRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook('preValidation', fastify.auth([requireLoginedHook]))

  fastify.get<{ Reply: GetOrdersOnlineResType; Querystring: GetOrdersOnlineQueryParamsType }>(
    '/',
    {
      schema: {
        response: {
          200: GetOrdersOnlineRes
        },
        querystring: GetOrdersQueryParams
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const result = await getOrdersOnlineController({
        fromDate: request.query.fromDate,
        toDate: request.query.toDate
      })
      reply.send({
        message: 'Lấy danh sách đơn hàng thành công',
        data: result as GetOrdersOnlineResType['data']
      })
    }
  )

  fastify.get<{ Reply: GetOrderDetailResType; Params: OrderParamType }>(
    '/:orderId',
    {
      schema: {
        response: {
          200: GetOrderDetailRes
        },
        params: OrderParam
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const result = await getOrderDetailController(request.params.orderId)
      reply.send({
        message: 'Lấy đơn hàng thành công',
        data: result as GetOrderDetailResType['data']
      })
    }
  )

  fastify.put<{ Reply: UpdateOrderOnlineResType; Body: UpdateOrderOnlineBodyType; Params: OrderParamType }>(
    '/:orderId',
    {
      schema: {
        response: {
          200: UpdateOrderOnlineRes
        },
        body: UpdateOrderOnlineBody,
        params: OrderParam
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const result = await updateOrderOnlineController(request.params.orderId, {
        ...request.body,
        orderHandlerId: request.decodedAccessToken?.userId as number
      })
      if (result.socketId) {
        fastify.io.to(result.socketId).to(ManagerRoom).emit('update-order', result.order)
      } else {
        fastify.io.to(ManagerRoom).emit('update-order', result.order)
      }
      reply.send({
        message: 'Cập nhật đơn hàng thành công',
        data: result.order as UpdateOrderOnlineResType['data']
      })
    }
  )
}
