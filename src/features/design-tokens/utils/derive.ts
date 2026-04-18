import Color from 'colorjs.io'
import type { DeriveTransform, TokenDef, TokenValues } from '../types'

// anchor 색상에 변환을 적용해 새 oklch 문자열을 생성한다.
const applyTransform = (anchorOklch: string, transform: DeriveTransform): string => {
  try {
    const c = new Color(anchorOklch)
    const coords = c.coords
    const l = (coords[0] ?? 0) as number
    const ch = (coords[1] ?? 0) as number
    const h = (coords[2] ?? 0) as number
    let nl = l
    let nc = ch
    const nh = h

    switch (transform) {
      case 'foreground':
        // anchor가 어두우면 밝은 전경, 밝으면 어두운 전경
        nl = l < 0.6 ? 0.97 : 0.15
        nc = Math.min(ch, 0.02)
        break
      case 'lighten-90':
        nl = 0.97
        nc = Math.min(ch * 0.06, 0.02)
        break
      case 'lighten-80':
        nl = 0.92
        nc = Math.min(ch * 0.1, 0.04)
        break
      case 'darken-20':
        nl = Math.max(0, l - 0.2)
        break
      case 'mute-bg':
        nl = l > 0.5 ? 0.97 : 0.25
        nc = Math.min(ch * 0.15, 0.03)
        break
      case 'same':
        return anchorOklch
    }

    const round = (n: number) => Number(n.toFixed(3))
    return `oklch(${round(nl)} ${round(nc)} ${round(nh)})`
  } catch {
    return anchorOklch
  }
}

// 주어진 anchor 토큰의 새 값으로부터 의존하는 모든 토큰 값을 일괄 계산한다.
// tokenDefs 전체를 훑어 deriveFrom.anchor === anchorKey인 것만 골라 반환.
export const deriveDependents = (
  anchorKey: string,
  anchorValue: string,
  tokenDefs: TokenDef[],
): TokenValues => {
  const out: TokenValues = {}
  for (const def of tokenDefs) {
    if (def.deriveFrom?.anchor === anchorKey && def.kind !== 'length') {
      out[def.key] = applyTransform(anchorValue, def.deriveFrom.transform)
    }
  }
  return out
}

// 어떤 토큰이 anchor 역할을 하는지(파생을 가질 수 있는지) 판단
export const isAnchor = (def: TokenDef, allDefs: TokenDef[]): boolean => {
  if (def.kind === 'length') return false
  if (def.deriveFrom) return false
  return allDefs.some((d) => d.deriveFrom?.anchor === def.key)
}

// 두 oklch 색상의 WCAG 2.1 대비비 계산. 실패 시 null.
export const contrastRatio = (a: string, b: string): number | null => {
  try {
    const ca = new Color(a)
    const cb = new Color(b)
    return ca.contrast(cb, 'WCAG21')
  } catch {
    return null
  }
}

export interface ContrastBadge {
  ratio: number
  level: 'AAA' | 'AA' | 'AA-Large' | 'Fail'
}

export const contrastBadge = (ratio: number): ContrastBadge => {
  let level: ContrastBadge['level']
  if (ratio >= 7) level = 'AAA'
  else if (ratio >= 4.5) level = 'AA'
  else if (ratio >= 3) level = 'AA-Large'
  else level = 'Fail'
  return { ratio, level }
}
