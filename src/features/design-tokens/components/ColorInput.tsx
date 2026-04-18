import { useEffect, useState } from 'react'
import { hexToOklch, oklchToHex, oklchToHexRgb } from '../utils/colorConvert'

interface ColorInputProps {
  value: string // oklch 문자열
  onChange: (next: string) => void
}

// oklch 값을 받아 hex picker로 편집하는 입력 컴포넌트
// 로컬에 hex 상태를 두고 blur/change 시 oklch 문자열로 변환해 상위로 전달한다.
export const ColorInput = ({ value, onChange }: ColorInputProps) => {
  const [hex, setHex] = useState(() => oklchToHex(value))

  useEffect(() => {
    setHex(oklchToHex(value))
  }, [value])

  // color picker는 hex 6자리만 지원 → 알파는 무시됨
  const pickerHex = oklchToHexRgb(value)

  const commit = (nextHex: string) => {
    const normalized = nextHex.trim()
    if (!/^#?[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(normalized)) return
    const next = hexToOklch(normalized)
    onChange(next)
  }

  return (
    <div className="flex items-center gap-1.5">
      <label className="relative h-6 w-6 shrink-0 cursor-pointer overflow-hidden rounded border border-border">
        <input
          type="color"
          value={pickerHex}
          onChange={(e) => {
            setHex(e.target.value)
            commit(e.target.value)
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="색상 선택"
        />
        <span
          className="block h-full w-full"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />
      </label>
      <input
        type="text"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        onBlur={() => commit(hex)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit(hex)
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        spellCheck={false}
        className="h-6 w-24 rounded border border-border bg-background px-1.5 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  )
}
