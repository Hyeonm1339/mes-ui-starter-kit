import { axiosInstance } from '@/lib/axios'
import type { User } from '@/store/slices/authSlice'

export interface LoginRequest {
  userId: string
  password: string
}

export interface LoginResponse {
  userId: string
  userName: string
  role: string
  accessToken: string
  refreshToken: string
}

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await axiosInstance.post<{ success: boolean; message: string; data: LoginResponse }>(
    '/auth/login',
    data,
  )
  return res.data.data
}

export const logoutApi = async (userId: string): Promise<void> => {
  await axiosInstance.post('/auth/logout', null, { params: { userId } })
}

export interface ChangePasswordRequest {
  userId: string
  currentPassword: string
  newPassword: string
}

export const changePasswordApi = async (data: ChangePasswordRequest): Promise<void> => {
  await axiosInstance.post('/auth/change-password', data)
}

export const toUser = (res: LoginResponse): User => ({
  userId: res.userId,
  userName: res.userName,
  role: res.role,
})
