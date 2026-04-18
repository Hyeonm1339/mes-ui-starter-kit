export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface ApiError {
  code: string
  message: string
  detail?: string
}
