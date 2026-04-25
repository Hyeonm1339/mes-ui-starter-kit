import { api } from '@/lib/api'

export const resetPassword = (userId: string) =>
  api.post<void>(`/user/user-list/${userId}/reset-password`)
