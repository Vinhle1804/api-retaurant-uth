// import { FastifyInstance } from 'fastify'
// import { z } from 'zod'
// import prisma from '@/database'

// // Schemas
// const IndicatorSchema = z.object({
//   name: z.string().min(1),
//   value: z.number(),
//   unit: z.string().optional()
// })

// const IdParamSchema = z.object({
//   id: z.string().regex(/^\d+$/).transform(Number)
// })

// export async function indicatorRoutes(fastify: FastifyInstance) {
//   // Lấy tất cả indicators
//   fastify.get('/indicators', async () => {
//     return prisma.indicator.findMany()
//   })

//   // Lấy 1 indicator theo id
//   fastify.get('/indicators/:id', async (request, reply) => {
//     const { id } = IdParamSchema.parse(request.params)
//     const indicator = await prisma.indicator.findUnique({ where: { id } })
//     if (!indicator) return reply.code(404).send({ message: 'Not found' })
//     return indicator
//   })

//   // Tạo mới indicator
//   fastify.post('/indicators', async (request, reply) => {
//     const data = IndicatorSchema.parse(request.body)
//     const created = await prisma.indicator.create({ data })
//     return reply.code(201).send(created)
//   })

//   // Cập nhật indicator
//   fastify.put('/indicators/:id', async (request, reply) => {
//     const { id } = IdParamSchema.parse(request.params)
//     const data = IndicatorSchema.parse(request.body)
//     const updated = await prisma.indicator.update({
//       where: { id },
//       data
//     })
//     return updated
//   })

//   // Xoá indicator
//   fastify.delete('/indicators/:id', async (request, reply) => {
//     const { id } = IdParamSchema.parse(request.params)
//     await prisma.indicator.delete({ where: { id } })
//     return reply.code(204).send()
//   })
// }
