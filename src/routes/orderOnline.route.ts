// import { ManagerRoom } from '@/constants/type'
// import {
//   createOrdersController,
//   deleteDeliveryFeeController,
//   getOrderDetailController,
//   getOrdersController,
//   payOrdersController,
//   updateOrderController
// } from '@/controllers/order.controller'
// import { requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
// import {
//   CreateOrdersBody,
//   CreateOrdersBodyType,
//   CreateOrdersRes,
//   CreateOrdersResType,
//   GetOrderDetailRes,
//   GetOrderDetailResType,
//   GetOrdersQueryParams,
//   GetOrdersQueryParamsType,
//   GetOrdersRes,
//   GetOrdersResType,
//   OrderParam,
//   OrderParamType,
//   PayGuestOrdersBody,
//   PayGuestOrdersBodyType,
//   PayGuestOrdersRes,
//   PayGuestOrdersResType,
//   UpdateOrderBody,
//   UpdateOrderBodyType,
//   UpdateOrderRes,
//   UpdateOrderResType
// } from '@/schemaValidations/order.schema'
// import { FastifyInstance, FastifyPluginOptions } from 'fastify'
// import z from 'zod'

// export default async function orderRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
//   fastify.addHook('preValidation', fastify.auth([requireLoginedHook]))
//   fastify.post<{ Reply: CreateOrdersResType; Body: CreateOrdersBodyType }>(
//     '/',
//     {
//       schema: {
//         response: {
//           200: CreateOrdersRes
//         },
//         body: CreateOrdersBody
//       },
//       preValidation: fastify.auth([requireOwnerHook])
//     },
//     async (request, reply) => {
//       const { socketId, orders } = await createOrdersController(
//         request.decodedAccessToken?.userId as number,
//         request.body
//       )
//       if (socketId) {
//         fastify.io.to(ManagerRoom).to(socketId).emit('new-order', orders)
//       } else {
//         fastify.io.to(ManagerRoom).emit('new-order', orders)
//       }
//       reply.send({
//         message: `Tạo thành công ${orders.length} đơn hàng cho khách hàng`,
//         data: orders as CreateOrdersResType['data']
//       })
//     }
//   )
//   fastify.get<{ Reply: GetOrdersResType; Querystring: GetOrdersQueryParamsType }>(
//     '/',
//     {
//       schema: {
//         response: {
//           200: GetOrdersRes
//         },
//         querystring: GetOrdersQueryParams
//       },
//       preValidation: fastify.auth([requireOwnerHook])
//     },
//     async (request, reply) => {
//       const result = await getOrdersController({
//         fromDate: request.query.fromDate,
//         toDate: request.query.toDate
//       })
//       reply.send({
//         message: 'Lấy danh sách đơn hàng thành công',
//         data: result as GetOrdersResType['data']
//       })
//     }
//   )
  
  
// }
