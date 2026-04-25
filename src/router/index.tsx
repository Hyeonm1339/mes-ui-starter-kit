import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { PrivateRoute } from '@/components/common/PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'
import { store } from '@/store'

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = store.getState().auth
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [{ path: '*', element: null }],
  },
])
