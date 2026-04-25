import { useApiMutation } from '@/hooks/useApiMutation'
import { createUser, modifyUser, resetPassword } from '../api'
import { userListKeys } from '../queries/userListKeys'
import type { UserCreateReq, UserModifyReq } from '../types'

export const useUserMutations = () => {
  const createMutation = useApiMutation({
    mutationFn: (req: UserCreateReq) => createUser(req),
    invalidateKeys: [[...userListKeys.all]],
  })

  const modifyMutation = useApiMutation({
    mutationFn: ({ userId, req }: { userId: string; req: UserModifyReq }) =>
      modifyUser(userId, req),
    invalidateKeys: [[...userListKeys.all]],
  })

  const resetPasswordMutation = useApiMutation({
    mutationFn: (userId: string) => resetPassword(userId),
  })

  return { createMutation, modifyMutation, resetPasswordMutation }
}
