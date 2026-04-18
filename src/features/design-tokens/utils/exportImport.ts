import type { TokenSet } from '../types'
import { tokenDefs } from '../tokens.config'

// :root / .dark CSS 블록 문자열 생성
export const buildCss = (tokens: TokenSet): string => {
  const keys = tokenDefs.map((t) => t.key)
  // radius는 수정 대상 아님 — 정의만 유지하고 값은 light에서만 뽑는다 (필요 시 확장)

  const lightLines = keys
    .filter((k) => tokens.light[k])
    .map((k) => `  ${k}: ${tokens.light[k]};`)
    .join('\n')

  const darkLines = keys
    .filter((k) => tokens.dark[k])
    .map((k) => `  ${k}: ${tokens.dark[k]};`)
    .join('\n')

  return `:root {\n${lightLines}\n}\n\n.dark {\n${darkLines}\n}\n`
}

// JSON 파일 다운로드
export const downloadJson = (tokens: TokenSet, filename = 'design-tokens.json') => {
  const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// 클립보드 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// JSON 파일 읽기
export const readJsonFile = (file: File): Promise<TokenSet> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as TokenSet
        if (!parsed.light || !parsed.dark) throw new Error('invalid token file')
        resolve(parsed)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
