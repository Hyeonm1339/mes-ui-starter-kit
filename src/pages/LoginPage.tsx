import { useState, useEffect } from 'react'
import { Eye, EyeOff, Factory, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react'
import { AppInput, AppForm, AppButton, AppCheckbox, AppCard } from '@hyeonm1339/mes-ui-kit'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useChangePassword } from '@/features/auth/hooks/useChangePassword'

type Screen = 'login' | 'change-password'

const SAVED_ID_KEY = 'saved_user_id'

const Logo = () => (
  <div className="mb-8 flex flex-col items-center gap-3">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
      <Factory className="h-8 w-8 text-primary-foreground" />
    </div>
    <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground">MES 시스템</h1>
      <p className="mt-1 text-sm text-muted-foreground">제조 실행 시스템에 로그인하세요</p>
    </div>
  </div>
)

const LoginScreen = ({ onChangePassword }: { onChangePassword: () => void }) => {
  const savedId = localStorage.getItem(SAVED_ID_KEY) ?? ''
  const [userId, setUserId] = useState(savedId)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [saveId, setSaveId] = useState(!!savedId)

  const { mutate: login, isPending, error } = useLogin()

  useEffect(() => {
    if (saveId && userId) {
      localStorage.setItem(SAVED_ID_KEY, userId)
    } else if (!saveId) {
      localStorage.removeItem(SAVED_ID_KEY)
    }
  }, [saveId, userId])

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
      '아이디 또는 비밀번호를 확인해주세요.'
    : undefined

  return (
    <>
      <Logo />
      <AppCard className="rounded-2xl shadow-sm">
        <AppForm labelAlign="top" onSubmit={() => login({ userId, password })}>
          <AppInput
            label="아이디"
            placeholder="아이디를 입력하세요"
            prefixIcon={User}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <AppInput
            label="비밀번호"
            type={showPw ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요"
            prefixIcon={Lock}
            suffixIcon={showPw ? EyeOff : Eye}
            onSuffixClick={() => setShowPw((v) => !v)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

          <div className="flex items-center justify-between">
            <AppCheckbox
              id="save-id"
              label="아이디 저장"
              checked={saveId}
              onCheckedChange={setSaveId}
            />
            <AppButton
              type="button"
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={onChangePassword}
            >
              비밀번호 변경
            </AppButton>
          </div>

          <AppButton type="submit" className="w-full" loading={isPending}>
            로그인
          </AppButton>
        </AppForm>
      </AppCard>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        계정 문의는 시스템 관리자에게 연락하세요
      </p>
    </>
  )
}

const ChangePasswordScreen = ({ onBack }: { onBack: () => void }) => {
  const [id, setId] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const isMatch = newPw.length > 0 && confirmPw.length > 0 && newPw === confirmPw
  const isMismatch = confirmPw.length > 0 && newPw !== confirmPw

  const { mutate: changePassword, isPending, error } = useChangePassword(onBack)

  const errorMessage = error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
      '비밀번호 변경에 실패했습니다.'
    : undefined

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">비밀번호 변경</h1>
          <p className="mt-1 text-sm text-muted-foreground">새로운 비밀번호를 설정하세요</p>
        </div>
      </div>

      <AppCard className="rounded-2xl shadow-sm">
        <AppForm
          labelAlign="top"
          onSubmit={() =>
            changePassword({ userId: id, currentPassword: currentPw, newPassword: newPw })
          }
        >
          <AppInput
            label="아이디"
            placeholder="아이디를 입력하세요"
            prefixIcon={User}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <AppInput
            label="현재 비밀번호"
            type={showCurrent ? 'text' : 'password'}
            placeholder="현재 비밀번호를 입력하세요"
            prefixIcon={Lock}
            suffixIcon={showCurrent ? EyeOff : Eye}
            onSuffixClick={() => setShowCurrent((v) => !v)}
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
          />

          <div className="border-t border-border" />

          <AppInput
            label="새 비밀번호"
            type={showNew ? 'text' : 'password'}
            placeholder="새 비밀번호를 입력하세요"
            prefixIcon={Lock}
            suffixIcon={showNew ? EyeOff : Eye}
            onSuffixClick={() => setShowNew((v) => !v)}
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            hint="8자 이상, 영문·숫자·특수문자 조합"
          />
          <AppInput
            label="새 비밀번호 확인"
            type={showConfirm ? 'text' : 'password'}
            placeholder="새 비밀번호를 한 번 더 입력하세요"
            prefixIcon={Lock}
            suffixIcon={showConfirm ? EyeOff : Eye}
            onSuffixClick={() => setShowConfirm((v) => !v)}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            error={isMismatch ? '비밀번호가 일치하지 않습니다' : undefined}
          />

          {isMatch && (
            <p className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              비밀번호가 일치합니다
            </p>
          )}

          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

          <AppButton
            type="submit"
            className="w-full"
            disabled={!id || !currentPw || !isMatch}
            loading={isPending}
          >
            비밀번호 변경
          </AppButton>
        </AppForm>
      </AppCard>

      <AppButton
        type="button"
        variant="ghost"
        className="mt-4 w-full gap-1.5 text-muted-foreground"
        prefixIcon={ArrowLeft}
        onClick={onBack}
      >
        로그인으로 돌아가기
      </AppButton>
    </>
  )
}

export const LoginPage = () => {
  const [screen, setScreen] = useState<Screen>('login')

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        {screen === 'login' ? (
          <LoginScreen onChangePassword={() => setScreen('change-password')} />
        ) : (
          <ChangePasswordScreen onBack={() => setScreen('login')} />
        )}
      </div>
    </div>
  )
}
