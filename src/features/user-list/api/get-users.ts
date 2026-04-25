import { api } from '@/lib/api'
import type { PaginationParams } from '@/types/api'
import type { UserItem, UserSearchParams } from '../types'

export const getUserList = (params: PaginationParams<UserSearchParams>) =>
  api.getPage<UserItem>('/user/user-list', params)
