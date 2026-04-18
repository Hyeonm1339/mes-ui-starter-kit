import { Wand2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TokenDef, TokenValues } from '../types'
import { ColorInput } from './ColorInput'
import { LengthInput } from './LengthInput'
import { ContrastBadge } from './ContrastBadge'

interface TokenRowProps {
  def: TokenDef
  lightValue: string
  darkValue: string
  // 같은 모드의 모든 토큰 값 — 대비비 계산에 사용
  lightAll: TokenValues
  darkAll: TokenValues
  isAnchor: boolean
  onChangeLight: (next: string) => void
  onChangeDark: (next: string) => void
  onDerive?: () => void
}

export const TokenRow = ({
  def,
  lightValue,
  darkValue,
  lightAll,
  darkAll,
  isAnchor,
  onChangeLight,
  onChangeDark,
  onDerive,
}: TokenRowProps) => {
  const { t } = useTranslation('designTokens')
  const Input = def.kind === 'length' ? LengthInput : ColorInput
  const showContrast = def.kind !== 'length' && def.contrastWith
  const lightPair = showContrast ? lightAll[def.contrastWith!] : undefined
  const darkPair = showContrast ? darkAll[def.contrastWith!] : undefined

  const label = t(`${def.label}.label`, { defaultValue: def.label })
  const desc = t(`${def.label}.desc`, { defaultValue: '' })

  return (
    <div
      className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-border px-3 py-1.5"
      title={desc || undefined}
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium text-foreground">{label}</div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">{def.key}</div>
        </div>
        {isAnchor && onDerive && (
          <button
            onClick={onDerive}
            title={t('tokenRow.deriveTitle')}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label={t('tokenRow.deriveLabel')}
          >
            <Wand2 className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <Input value={lightValue} onChange={onChangeLight} />
        {showContrast && lightPair && <ContrastBadge fg={lightValue} bg={lightPair} />}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <Input value={darkValue} onChange={onChangeDark} />
        {showContrast && darkPair && <ContrastBadge fg={darkValue} bg={darkPair} />}
      </div>
    </div>
  )
}
