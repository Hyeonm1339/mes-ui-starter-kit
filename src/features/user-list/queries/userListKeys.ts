import type { PaginationParams } from '@/types/api'
import type { UserSearchParams } from '../types'

export const userListKeys = {
  all: ['user-list'] as const,
  list: (params: PaginationParams<UserSearchParams>) =>
    ['user-list', 'list', params] as const,
  detail: (userId: string) => ['user-list', 'detail', userId] as const,
}
