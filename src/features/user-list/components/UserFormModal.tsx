import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AppModal, AppForm, AppInput, AppSelect, AppButton } from '@hyeonm1339/mes-ui-kit'
import type { SelectOption } from '@hyeonm1339/mes-ui-kit'
import type { UserItem, UserCreateReq, UserModifyReq } from '../types'

const roleOptions: SelectOption[] = [
  { label: '관리자', value: 'ADMIN' },
  { label: '사용자', value: 'USER' },
]
const statusOptions: SelectOption[] = [
  { label: '활성', value: 'Y' },
  { label: '비활성', value: 'N' },
]

export interface UserFormModalProps {
  open: boolean
  onClose: () => void
  /** undefined | null → 신규 등록, UserItem → 수정 */
  user?: UserItem | null
  isSaving?: boolean
  onCreate: (data: UserCreateReq) => void
  onEdit: (data: UserModifyReq) => void
  onResetPassword?: (userId: string) => void
}

export const UserFormModal = ({
  open,
  onClose,
  user,
  isSaving,
  onCreate,
  onEdit,
  onResetPassword,
}: UserFormModalProps) => {
  const isEdit = !!user

  const createForm = useForm<UserCreateReq>({
    defaultValues: { userId: '', userName: '', password: '', role: 'USER' },
  })
  const editForm = useForm<UserModifyReq>({
    defaultValues: { userName: '', role: 'USER', status: 'Y' },
  })

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (!open) return
    if (isEdit) {
      editForm.reset({ userName: user.userName, role: user.role, status: user.status })
    } else {
      createForm.reset({ userId: '', userName: '', password: '', role: 'USER' })
    }
  }, [open, user])

  const handleSave = isEdit
    ? editForm.handleSubmit(onEdit)
    : createForm.handleSubmit(onCreate)

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEdit ? '회원 수정' : '회원 등록'}
      mode={isEdit ? 'edit' : 'create'}
      size="sm"
      confirmLoading={isSaving}
      footer={
        <div className="flex w-full items-center justify-between">
          {isEdit && onResetPassword ? (
            <AppButton
              variant="destructive"
              size="sm"
              onClick={() => onResetPassword(user.userId)}
            >
              비밀번호 초기화
            </AppButton>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <AppButton variant="outline" onClick={onClose}>
              취소
            </AppButton>
            <AppButton onClick={handleSave} loading={isSaving}>
              저장
            </AppButton>
          </div>
        </div>
      }
    >
      {isEdit ? (
        <AppForm labelAlign="left" labelWidth={80}>
          <AppInput label="사용자 ID" value={user.userId} readOnly />
          <AppInput
            label="사용자명"
            placeholder="사용자명"
            {...editForm.register('userName')}
          />
          <Controller
            name="role"
            control={editForm.control}
            render={({ field }) => (
              <AppSelect label="역할" options={roleOptions} value={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            name="status"
            control={editForm.control}
            render={({ field }) => (
              <AppSelect label="상태" options={statusOptions} value={field.value} onChange={field.onChange} />
            )}
          />
        </AppForm>
      ) : (
        <AppForm labelAlign="left" labelWidth={80}>
          <AppInput
            label="사용자 ID"
            placeholder="사용자 ID"
            {...createForm.register('userId')}
          />
          <AppInput
            label="사용자명"
            placeholder="사용자명"
            {...createForm.register('userName')}
          />
          <AppInput
            label="비밀번호"
            type="password"
            placeholder="비밀번호"
            {...createForm.register('password')}
          />
          <Controller
            name="role"
            control={createForm.control}
            render={({ field }) => (
              <AppSelect label="역할" options={roleOptions} value={field.value} onChange={field.onChange} />
            )}
          />
        </AppForm>
      )}
    </AppModal>
  )
}
