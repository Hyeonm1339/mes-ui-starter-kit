import { AppAlertDialog } from '@hyeonm1339/mes-ui-kit'

interface UserResetPasswordDialogProps {
  userId: string | null
  isLoading?: boolean
  onClose: () => void
  onConfirm: (userId: string) => void
}

export const UserResetPasswordDialog = ({
  userId,
  isLoading,
  onClose,
  onConfirm,
}: UserResetPasswordDialogProps) => (
  <AppAlertDialog
    open={!!userId}
    onClose={onClose}
    onConfirm={() => userId && onConfirm(userId)}
    title="비밀번호 초기화"
    description={`${userId} 계정의 비밀번호를 초기화하시겠습니까?`}
    confirmLabel={isLoading ? '처리 중...' : '초기화'}
    variant="destructive"
  />
)
