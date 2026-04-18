import { useEffect, useState } from 'react'

interface LengthInputProps {
  value: string // 예: "0.45rem", "8px", "0"
  onChange: (next: string) => void
}

const LENGTH_RE = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|%|vh|vw)?$/

// CSS 길이 값 입력. text 입력 + 시각 미리보기(라운드 사각형).
// 단위가 없으면 px로 처리되지 않고 invalid로 본다(혼란 방지). "0"만 단위 없이 허용.
export const LengthInput = ({ value, onChange }: LengthInputProps) => {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  const commit = (next: string) => {
    const trimmed = next.trim()
    if (!LENGTH_RE.test(trimmed)) {
      setText(value) // 롤백
      return
    }
    onChange(trimmed)
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="block h-6 w-6 shrink-0 border border-border bg-primary"
        style={{ borderRadius: value }}
        aria-hidden="true"
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => commit(text)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit(text)
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        spellCheck={false}
        placeholder="0.5rem"
        className="h-6 w-24 rounded border border-border bg-background px-1.5 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
