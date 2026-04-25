import { api } from '@/lib/api'
import type { UserModifyReq } from '../types'

export const modifyUser = (userId: string, req: UserModifyReq) =>
  api.post<void>(`/user/user-list/${userId}`, req)
