import { useState } from 'react'
import { Eye, EyeOff, Factory, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react'
import { AppInput } from '@hyeonm1339/mes-ui-kit'

type Screen = 'login' | 'change-password'

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
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  return (
    <>
      <Logo />
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <AppInput
            label="아이디"
            labelAlign="top"
            placeholder="아이디를 입력하세요"
            prefixIcon={User}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <AppInput
            label="비밀번호"
            labelAlign="top"
            type={showPw ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요"
            prefixIcon={Lock}
            suffixIcon={showPw ? EyeOff : Eye}
            onSuffixClick={() => setShowPw((v) => !v)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="rounded border-border accent-primary" />
              아이디 저장
            </label>
            <button onClick={onChangePassword} className="text-primary hover:underline">
              비밀번호 변경
            </button>
          </div>

          <button
            type="button"
            className="mt-1 h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
          >
            로그인
          </button>
        </div>
      </div>
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

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <AppInput
            label="아이디"
            labelAlign="top"
            placeholder="아이디를 입력하세요"
            prefixIcon={User}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <AppInput
            label="현재 비밀번호"
            labelAlign="top"
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
            labelAlign="top"
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
            labelAlign="top"
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

          <button
            type="button"
            className="mt-1 h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!id || !currentPw || !isMatch}
          >
            비밀번호 변경
          </button>
        </div>
      </div>

      <button
        onClick={onBack}
        className="mt-4 flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        로그인으로 돌아가기
      </button>
    </>
  )
}

export const LoginPageSample = () => {
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
