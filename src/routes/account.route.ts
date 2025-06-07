import {
  CreateAddressRes,
  CreateAddressBody,
  GetAllAddressesRes,
  GetAllAddressesResType,
  GetAddressByIdRes,
  UpdateAddressBodyType,
  UpdateAddressResType,
  UpdateAddressRes,
  UpdateAddressBody,
  AddressResType,
  AddressIdParamType,
  AddressRes,
  AddressIdParam,
  UpdateAddressDefaultResType,
  UpdateAddressDefaultRes,
  GetAddressByIdResType
} from './../schemaValidations/account.schema'
import { Role } from '@/constants/roles'
import {
  changePasswordController,
  createAddressController,
  createEmployeeAccount,
  createGuestController,
  deleteAddressController,
  deleteEmployeeAccount,
  getAccountList,
  getAddressById,
  getAddressList,
  getEmployeeAccount,
  getGuestList,
  getMeController,
  setAddressDefaultController,
  updateAddressController,
  updateEmployeeAccount,
  updateMeController
} from '@/controllers/account.controller'
import { requireLoginedHook, requireOwnerHook } from '@/hooks/auth.hooks'
import {
  AccountIdParam,
  AccountIdParamType,
  AccountListRes,
  AccountListResType,
  AccountRes,
  AccountResType,
  ChangePasswordBody,
  ChangePasswordBodyType,
  CreateAddressBodyType,
  CreateAddressResType,
  CreateEmployeeAccountBody,
  CreateEmployeeAccountBodyType,
  CreateGuestBody,
  CreateGuestBodyType,
  CreateGuestRes,
  CreateGuestResType,
  GetGuestListQueryParams,
  GetGuestListQueryParamsType,
  GetListGuestsRes,
  GetListGuestsResType,
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
  UpdateMeBody,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { request } from 'http'

export default async function accountRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook('preValidation', fastify.auth([requireLoginedHook]))
  fastify.get<{ Reply: AccountListResType }>(
    '/',
    {
      schema: {
        response: {
          200: AccountListRes
        }
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const ownerAccountId = request.decodedAccessToken?.userId as number
      const accounts = await getAccountList(ownerAccountId)
      reply.send({
        data: accounts,
        message: 'Lấy danh sách nhân viên thành công'
      })
    }
  )
  fastify.post<{
    Body: CreateEmployeeAccountBodyType
    Reply: AccountResType
  }>(
    '/',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: CreateEmployeeAccountBody
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const account = await createEmployeeAccount(request.body)
      reply.send({
        data: account,
        message: 'Tạo tài khoản thành công'
      })
    }
  )
  fastify.get<{ Reply: AccountResType; Params: AccountIdParamType }>(
    '/detail/:id',
    {
      schema: {
        response: {
          200: AccountRes
        },
        params: AccountIdParam
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const accountId = request.params.id
      const account = await getEmployeeAccount(accountId)
      reply.send({
        data: account,
        message: 'Lấy thông tin nhân viên thành công'
      })
    }
  )

  fastify.put<{ Reply: AccountResType; Params: AccountIdParamType; Body: UpdateEmployeeAccountBodyType }>(
    '/detail/:id',
    {
      schema: {
        response: {
          200: AccountRes
        },
        params: AccountIdParam,
        body: UpdateEmployeeAccountBody
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const accountId = request.params.id
      const body = request.body
      const account = await updateEmployeeAccount(accountId, body)
      reply.send({
        data: account,
        message: 'Cập nhật thành công'
      })
    }
  )

  fastify.delete<{ Reply: AccountResType; Params: AccountIdParamType }>(
    '/detail/:id',
    {
      schema: {
        response: {
          200: AccountRes
        },
        params: AccountIdParam
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const accountId = request.params.id
      const account = await deleteEmployeeAccount(accountId)
      reply.send({
        data: account,
        message: 'Xóa thành công'
      })
    }
  )

  fastify.get<{ Reply: AccountResType }>(
    '/me',
    {
      schema: {
        response: {
          200: AccountRes
        }
      }
    },
    async (request, reply) => {
      const account = await getMeController(request.decodedAccessToken?.userId as number)
      reply.send({
        data: account,
        message: 'Lấy thông tin thành công'
      })
    }
  )

  fastify.put<{
    Reply: AccountResType
    Body: UpdateMeBodyType
  }>(
    '/me',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: UpdateMeBody
      }
    },
    async (request, reply) => {
      const result = await updateMeController(request.decodedAccessToken?.userId as number, request.body)
      reply.send({
        data: result,
        message: 'Cập nhật thông tin thành công'
      })
    }
  )

  fastify.put<{
    Reply: AccountResType
    Body: ChangePasswordBodyType
  }>(
    '/change-password',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: ChangePasswordBody
      }
    },
    async (request, reply) => {
      const result = await changePasswordController(request.decodedAccessToken?.userId as number, request.body)
      reply.send({
        data: result,
        message: 'Đổi mật khẩu thành công'
      })
    }
  )

  fastify.post<{ Reply: CreateGuestResType; Body: CreateGuestBodyType }>(
    '/guests',
    {
      schema: {
        response: {
          200: CreateGuestRes
        },
        body: CreateGuestBody
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const result = await createGuestController(request.body)
      reply.send({
        message: 'Tạo tài khoản khách thành công',
        data: { ...result, role: Role.Guest } as CreateGuestResType['data']
      })
    }
  )
  fastify.get<{ Reply: GetListGuestsResType; Querystring: GetGuestListQueryParamsType }>(
    '/guests',
    {
      schema: {
        response: {
          200: GetListGuestsRes
        },
        querystring: GetGuestListQueryParams
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const result = await getGuestList({
        fromDate: request.query.fromDate,
        toDate: request.query.toDate
      })
      reply.send({
        message: 'Lấy danh sách khách thành công',
        data: result as GetListGuestsResType['data']
      })
    }
  )

  fastify.post<{ Reply: CreateAddressResType; Body: CreateAddressBodyType }>(
    '/address',
    {
      schema: {
        response: {
          200: CreateAddressRes
        },
        body: CreateAddressBody
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const accountId = request.decodedAccessToken?.userId
      const result = await createAddressController(accountId as number, request.body)
      console.log(result)
      reply.send({
        message: 'Tạo dia chi giao hang thanh cong',
        data: result
      })
    }
  )
  fastify.get<{ Reply: GetAllAddressesResType }>(
    '/addresses',
    {
      schema: {
        response: {
          200: GetAllAddressesRes
        }
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const accountId = request.decodedAccessToken?.userId
      const result = await getAddressList(accountId as number)
      console.log(result)
      reply.send({
        message: 'Lay tat ca dia chi thanh cong',
        data: result
      })
    }
  )
  fastify.get<{
    Reply: GetAddressByIdResType
    Params: { id: string }
  }>(
    '/address/:id',
    {
      schema: {
        response: {
          200: GetAddressByIdRes
        }
      },
            preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const id = parseInt(request.params.id)

      const result = await getAddressById(id)

      reply.send({
        message: 'Lấy địa chỉ thành công',
        data: result
      })
    }
  )

  fastify.put<{
    Reply: UpdateAddressResType
    Body: UpdateAddressBodyType
    Params: { id: string }
  }>(
    '/address/:id',
    {
      schema: {
        response: {
          200: UpdateAddressRes
        },
        body: UpdateAddressBody
      },
            preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const accountId = request.decodedAccessToken?.userId
      const id = parseInt(request.params.id)
      const result = await updateAddressController(accountId as number, id, request.body)
      reply.send({
        data: result,
        message: 'Cập nhật thông tin thành công'
      })
    }
  )

  fastify.delete<{ Reply: AddressResType; Params: AddressIdParamType }>(
    '/address/:id',
    {
      schema: {
        response: {
          200: AddressRes
        },
        params: AddressIdParam
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const addressId = request.params.id
      const result = await deleteAddressController(addressId)
      reply.send({
        data: result,
        message: 'Xóa thành công'
      })
    }
  )

  fastify.patch<{ Reply: UpdateAddressDefaultResType; Params: AddressIdParamType }>(
    '/address/:id/default',
    {
      schema: {
        response: {
          200: UpdateAddressDefaultRes
        },
        params: AddressIdParam
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const accountId = request.decodedAccessToken?.userId as number
      const addressId = request.params.id
      const result = await setAddressDefaultController(accountId, addressId)
      reply.send({
        data: result,
        message: 'update dia chi mac dinh thanh cong'
      })
    }
  )
}
