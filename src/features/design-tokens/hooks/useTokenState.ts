import { useCallback, useEffect, useRef, useState } from 'react'
import { themeOverrideCss } from '@/config/theme'
import type { ThemeMode, TokenSet, TokenValues } from '../types'
import { defaultTokens } from '../tokens.config'
import { parseThemeCss } from '../utils/parseThemeCss'

const STORAGE_KEY = 'design_tokens_draft'
const HISTORY_LIMIT = 50

// theme.ts의 오버라이드를 defaultTokens 위에 얹어 "현재 적용된 테마"를 만든다.
// 편집기 초기 상태로 사용 — 편집기를 열어도 화면 색이 디폴트로 튀지 않도록 하기 위함.
// reset()은 이 함수를 거치지 않고 항상 defaultTokens로 돌려보낸다(공장 디폴트).
const computeAppliedTokens = (): TokenSet => {
  if (!themeOverrideCss.trim()) return defaultTokens
  const override = parseThemeCss(themeOverrideCss)
  return {
    light: { ...defaultTokens.light, ...override.light },
    dark: { ...defaultTokens.dark, ...override.dark },
  }
}

const loadInitial = (): TokenSet => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<TokenSet>
      const base = computeAppliedTokens()
      return {
        light: { ...base.light, ...parsed.light },
        dark: { ...base.dark, ...parsed.dark },
      }
    }
  } catch {
    /* fallthrough */
  }
  return computeAppliedTokens()
}

export const useTokenState = () => {
  const [tokens, setTokensState] = useState<TokenSet>(loadInitial)

  // history는 commit된 스냅샷의 배열. cursor는 현재 위치(undo로 과거로 갈 수 있음).
  // setValue 호출 시 새 스냅샷을 cursor 다음에 push하고 cursor를 끝으로 옮긴다.
  const historyRef = useRef<TokenSet[]>([])
  const cursorRef = useRef<number>(-1)
  const [historyVersion, setHistoryVersion] = useState(0) // canUndo/canRedo 리렌더 트리거

  // 첫 렌더에서 초기값을 history에 시드
  useEffect(() => {
    if (historyRef.current.length === 0) {
      historyRef.current = [tokens]
      cursorRef.current = 0
      setHistoryVersion((v) => v + 1)
    }
    // 의도적으로 빈 deps — 1회만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    } catch {
      /* quota 초과 등 */
    }
  }, [tokens])

  // 새 스냅샷을 히스토리에 추가하고 적용
  const commit = useCallback((next: TokenSet) => {
    const cur = cursorRef.current
    const truncated = historyRef.current.slice(0, cur + 1)
    truncated.push(next)
    // limit 초과 시 앞에서 제거
    while (truncated.length > HISTORY_LIMIT) truncated.shift()
    historyRef.current = truncated
    cursorRef.current = truncated.length - 1
    setTokensState(next)
    setHistoryVersion((v) => v + 1)
  }, [])

  const setValue = useCallback(
    (mode: ThemeMode, key: string, value: string) => {
      commit({
        ...tokens,
        [mode]: { ...tokens[mode], [key]: value },
      })
    },
    [commit, tokens],
  )

  // 여러 키를 한 번에 변경 (자동 파생 등에 사용)
  const setValues = useCallback(
    (mode: ThemeMode, patch: TokenValues) => {
      commit({
        ...tokens,
        [mode]: { ...tokens[mode], ...patch },
      })
    },
    [commit, tokens],
  )

  const reset = useCallback(() => {
    commit(defaultTokens)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [commit])

  const replaceAll = useCallback(
    (next: TokenSet) => {
      const base = computeAppliedTokens()
      commit({
        light: { ...base.light, ...next.light },
        dark: { ...base.dark, ...next.dark },
      })
    },
    [commit],
  )

  const undo = useCallback(() => {
    if (cursorRef.current <= 0) return
    cursorRef.current -= 1
    setTokensState(historyRef.current[cursorRef.current])
    setHistoryVersion((v) => v + 1)
  }, [])

  const redo = useCallback(() => {
    if (cursorRef.current >= historyRef.current.length - 1) return
    cursorRef.current += 1
    setTokensState(historyRef.current[cursorRef.current])
    setHistoryVersion((v) => v + 1)
  }, [])

  // historyVersion을 사용해 의존성 추적 — 매 변경마다 새로 계산되도록
  void historyVersion
  const canUndo = cursorRef.current > 0
  const canRedo = cursorRef.current < historyRef.current.length - 1

  return { tokens, setValue, setValues, reset, replaceAll, undo, redo, canUndo, canRedo }
}
