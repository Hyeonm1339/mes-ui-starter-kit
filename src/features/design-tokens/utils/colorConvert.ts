import Color from 'colorjs.io'

// oklch 문자열에서 알파값 추출 ("oklch(l c h / 30%)" → 0.3, 없으면 1)
const extractAlpha = (oklch: string): number => {
  const match = oklch.match(/\/\s*([0-9.]+)(%?)\s*\)/)
  if (!match) return 1
  const value = parseFloat(match[1])
  return match[2] === '%' ? value / 100 : value
}

// oklch 문자열 → hex (#rrggbb, 알파가 1이 아니면 #rrggbbaa)
export const oklchToHex = (oklch: string): string => {
  try {
    const alpha = extractAlpha(oklch)
    const color = new Color(oklch).to('srgb')
    color.alpha = 1 // hex 변환 시 알파는 별도 처리
    const hex = color.toString({ format: 'hex' })
    if (alpha < 1) {
      const a = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0')
      return `${hex}${a}`
    }
    return hex
  } catch {
    return '#000000'
  }
}

// hex (#rrggbb 또는 #rrggbbaa) → oklch 문자열 ("oklch(l c h)" 또는 "oklch(l c h / a%)")
export const hexToOklch = (hex: string): string => {
  try {
    const normalized = hex.startsWith('#') ? hex : `#${hex}`
    let alpha = 1
    let base = normalized
    if (normalized.length === 9) {
      // #rrggbbaa
      const aHex = normalized.slice(7, 9)
      alpha = parseInt(aHex, 16) / 255
      base = normalized.slice(0, 7)
    }
    const color = new Color(base).to('oklch')
    const [l, c, h] = color.coords
    const lr = Number((l || 0).toFixed(3))
    const cr = Number((c || 0).toFixed(3))
    const hr = Number((h || 0).toFixed(3))
    if (alpha < 1) {
      return `oklch(${lr} ${cr} ${hr} / ${Math.round(alpha * 100)}%)`
    }
    return `oklch(${lr} ${cr} ${hr})`
  } catch {
    return 'oklch(0 0 0)'
  }
}

// hex만 반환 (알파 무시), 색상 피커용
export const oklchToHexRgb = (oklch: string): string => {
  try {
    const color = new Color(oklch).to('srgb')
    color.alpha = 1
    return color.toString({ format: 'hex' })
  } catch {
    return '#000000'
  }
}
