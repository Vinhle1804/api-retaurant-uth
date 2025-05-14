import z from 'zod'

export const DeliveryFeesSchema = z.object({
  id: z.number(),
  code: z.string(), // Mã định danh: 'fast', 'priority', 'economy'
  label: z.string(), // Tên hiển thị: 'Giao nhanh', 'Ưu tiên'
  description: z.string().nullable(), // Mô tả chi tiết (có thể null)
  estimatedTime: z.string().nullable(), // Thời gian ước tính (có thể null)
  baseFee: z.number(), // Phí cơ bản (VNĐ)
  extraFeePerKm: z.number().default(0), // Phụ phí theo km (nếu có)
  maxDistance: z.number().default(0), // Khoảng cách tối đa áp dụng (km, 0 = không giới hạn)
  isActive: z.boolean().default(true) // Còn áp dụng không
})
export type CreateDeliveryFeesBodyType = z.TypeOf<typeof DeliveryFeesSchema>

export const CreateDeliveryFeesRes = z.object({
  message: z.string(),
  data: DeliveryFeesSchema
})

export type CreateDeliveryFeesResType = z.TypeOf<typeof CreateDeliveryFeesRes>

export const GetDeliveryFeeListRes = z.object({
  data: z.array(DeliveryFeesSchema),
  message: z.string()
})

export type GetDeliveryFeeListResType = z.TypeOf<typeof GetDeliveryFeeListRes>
