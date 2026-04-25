import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setCredentials } from '@/store/slices/authSlice'
import { loginApi, toUser, type LoginRequest } from '../api/login'

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: (res) => {
      dispatch(
        setCredentials({
          user: toUser(res),
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
      )
      navigate(from, { replace: true })
    },
  })
}
