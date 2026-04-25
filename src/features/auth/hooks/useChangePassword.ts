import { useMutation } from '@tanstack/react-query'
import { changePasswordApi, type ChangePasswordRequest } from '../api/login'

export const useChangePassword = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePasswordApi(data),
    onSuccess,
  })
