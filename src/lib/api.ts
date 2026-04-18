import { toast } from './toast'
import { axiosInstance } from './axios'
import type { ApiResponse } from '@/types/api'

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    toast.error(response.message)
    throw new Error(response.message)
  }
  return response.data
}

export const api = {
  get: <T>(url: string, params?: object) =>
    axiosInstance.get<ApiResponse<T>>(url, { params }).then((r) => unwrap(r.data)),

  post: <T>(url: string, data?: object) =>
    axiosInstance.post<ApiResponse<T>>(url, data).then((r) => unwrap(r.data)),

  put: <T>(url: string, data?: object) =>
    axiosInstance.put<ApiResponse<T>>(url, data).then((r) => unwrap(r.data)),

  delete: <T>(url: string) =>
    axiosInstance.delete<ApiResponse<T>>(url).then((r) => unwrap(r.data)),
}
