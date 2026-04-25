import { api } from '@/lib/api'
import type { UserItem } from '../types'

export const getUser = (userId: string) =>
  api.get<UserItem>(`/user/user-list/${userId}`)
