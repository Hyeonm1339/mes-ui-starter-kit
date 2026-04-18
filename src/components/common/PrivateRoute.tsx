import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'

interface PrivateRouteProps {
  children: ReactNode
  requiredRole?: string
}

// TODO: 개발 테스트용 — 로그인 우회 활성화, 운영 전 반드시 제거
const SKIP_AUTH = true

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!SKIP_AUTH && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!SKIP_AUTH && requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
