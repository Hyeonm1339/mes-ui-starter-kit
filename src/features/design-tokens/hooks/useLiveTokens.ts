import { useEffect } from 'react'
import type { TokenSet } from '../types'
import { defaultTokens } from '../tokens.config'

// 현재 테마(light/dark)에 맞춰 해당 모드의 토큰값을 documentElement에 실시간 적용한다.
// 언마운트 시 defaultTokens로 복원해 전역 상태 오염을 방지한다.
export const useLiveTokens = (tokens: TokenSet) => {
  useEffect(() => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    const active = isDark ? tokens.dark : tokens.light

    Object.entries(active).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

    // MutationObserver로 .dark 토글 감지 (헤더의 테마 스위치)
    const observer = new MutationObserver(() => {
      const nowDark = root.classList.contains('dark')
      const nextActive = nowDark ? tokens.dark : tokens.light
      Object.entries(nextActive).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => {
      observer.disconnect()
      const restore = isDark ? defaultTokens.dark : defaultTokens.light
      Object.keys(restore).forEach((key) => {
        root.style.removeProperty(key)
      })
    }
  }, [tokens])
}
