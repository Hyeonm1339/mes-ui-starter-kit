import type { TokenValues } from '../types'

// :root { ... } 또는 .dark { ... } 블록 안의 --key: value; 줄을 추출.
// 디자이너에게 받은 CSS 문자열을 편집기 초기값으로 되살릴 때 사용한다.
const parseBlock = (css: string, selectorPattern: string): TokenValues => {
  const re = new RegExp(`${selectorPattern}\\s*\\{([^}]*)\\}`, 'i')
  const m = css.match(re)
  if (!m) return {}
  const body = m[1]
  const out: TokenValues = {}
  const lineRe = /(--[\w-]+)\s*:\s*([^;]+);/g
  let line: RegExpExecArray | null
  while ((line = lineRe.exec(body)) !== null) {
    out[line[1]] = line[2].trim()
  }
  return out
}

export const parseThemeCss = (css: string): { light: TokenValues; dark: TokenValues } => {
  return {
    light: parseBlock(css, ':root'),
    dark: parseBlock(css, '\\.dark'),
  }
}
