import { api } from '@/lib/api'
import type { UserCreateReq } from '../types'

export const createUser = (req: UserCreateReq) =>
  api.post<void>('/user/user-list', req)
