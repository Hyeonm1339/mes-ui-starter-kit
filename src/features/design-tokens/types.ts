export type TokenCategory =
  | 'surface'
  | 'text'
  | 'border'
  | 'primary'
  | 'secondary'
  | 'feedback'
  | 'chart'
  | 'sidebar'
  | 'header'
  | 'table'
  | 'shape'

export type TokenKind = 'color' | 'length'

export type ThemeMode = 'light' | 'dark'

export interface TokenDef {
  key: string // CSS 변수명 (예: --primary)
  label: string
  category: TokenCategory
  kind?: TokenKind // 기본 'color'
  description?: string
  // 대비비 계산: 짝지을 토큰 키. 예: --foreground는 --background와 측정.
  contrastWith?: string
  // 자동 파생: 어떤 anchor 토큰에서 어떤 변환으로 파생되는지.
  // anchor 토큰 자체는 deriveFrom을 비워두면 됨 → "🪄" 버튼이 표시됨.
  deriveFrom?: { anchor: string; transform: DeriveTransform }
}

// OKLCH 색 공간에서의 변환 종류
export type DeriveTransform =
  | 'foreground' // 밝기 자동 반전 (anchor가 어두우면 밝게, 밝으면 어둡게)
  | 'lighten-90' // L = 0.97, C 약하게
  | 'lighten-80' // L = 0.92, C 약하게
  | 'darken-20' // L -= 0.2
  | 'mute-bg' // 매우 약한 배경 톤
  | 'same' // anchor 그대로 복사 (예: --ring ← --primary)

export type TokenValues = Record<string, string> // key → oklch 문자열

export interface TokenSet {
  light: TokenValues
  dark: TokenValues
}
