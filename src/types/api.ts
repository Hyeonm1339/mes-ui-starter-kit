export interface PageResult {
  size: number
  pageNo: number
  total: number
  totalPage: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string | null
  page: PageResult | Record<string, never>
  data: T
}

export interface PagedData<T> {
  data: T[]
  page: PageResult
}

export interface SortParam {
  key: string
  direction: 'asc' | 'desc'
}

/** 백엔드 PaginationReq 대응 요청 타입 */
export interface PaginationParams<F = Record<string, unknown>> {
  page?: {
    pageNo: number
    size: number
  }
  sort?: SortParam[]
  filters?: F
}
