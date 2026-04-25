export interface UserItem {
  [key: string]: unknown
  userId: string
  userName: string
  role: string
  status: string
  loginFailCount: number
  lastLoginAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface UserSearchParams {
  userId?: string
  userName?: string
  role?: string
  status?: string
  createdAtFrom?: string
  createdAtTo?: string
  lastLoginAtFrom?: string
  lastLoginAtTo?: string
}

/** react-hook-form 전용 — DateRange 필드 포함 */
export interface UserSearchForm {
  userId: string
  userName: string
  role: string
  status: string
  createdAtRange?: import('react-day-picker').DateRange
  lastLoginAtRange?: import('react-day-picker').DateRange
}

export interface UserCreateReq {
  userId: string
  userName: string
  password: string
  role: string
}

export interface UserModifyReq {
  userName: string
  role: string
  status: string
}
