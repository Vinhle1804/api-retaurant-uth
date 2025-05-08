import { Role } from "@/constants/roles"
import { TokenType } from "@/constants/tokens"

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
export type RoleType = (typeof Role)[keyof typeof Role]
export interface TokenPayload {
  userId: number
  role: RoleType
  tokenType: TokenTypeValue
  exp: number
  iat: number
}

export interface TableTokenPayload {
  iat: number
  number: number
  tokenType: (typeof TokenType)['TableToken']
}
