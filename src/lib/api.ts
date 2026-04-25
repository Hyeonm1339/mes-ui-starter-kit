import { toast } from './toast'
import { axiosInstance } from './axios'
import type { ApiResponse, PageResult, PagedData } from '@/types/api'

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response.success) {
    toast.error(response.message ?? '')
    throw new Error(response.message ?? '')
  }
  return response.data
}

const unwrapPage = <T>(response: ApiResponse<T[]>): PagedData<T> => {
  if (!response.success) {
    toast.error(response.message ?? '')
    throw new Error(response.message ?? '')
  }
  return { data: response.data, page: response.page as PageResult }
}

export const api = {
  get: <T>(url: string, params?: object) =>
    axiosInstance.get<ApiResponse<T>>(url, { params }).then((r) => unwrap(r.data)),

  /** 페이지네이션 목록 조회 — { data, page } 반환 */
  getPage: <T>(url: string, params?: object) =>
    axiosInstance.get<ApiResponse<T[]>>(url, { params }).then((r) => unwrapPage(r.data)),

  post: <T>(url: string, data?: object) =>
    axiosInstance.post<ApiResponse<T>>(url, data).then((r) => unwrap(r.data)),

  put: <T>(url: string, data?: object) =>
    axiosInstance.put<ApiResponse<T>>(url, data).then((r) => unwrap(r.data)),

  patch: <T>(url: string, data?: object) =>
    axiosInstance.patch<ApiResponse<T>>(url, data).then((r) => unwrap(r.data)),

  delete: <T>(url: string) =>
    axiosInstance.delete<ApiResponse<T>>(url).then((r) => unwrap(r.data)),
}
