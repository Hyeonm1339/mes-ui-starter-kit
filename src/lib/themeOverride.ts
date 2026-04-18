import { themeOverrideCss } from '@/config/theme'

const STYLE_ID = 'theme-override'

/**
 * src/config/theme.ts의 themeOverrideCss를 <style> 태그로 주입합니다.
 * index.css보다 뒤에 추가되므로 동일 셀렉터에 대해 자동으로 우선 적용됩니다.
 */
export const installThemeOverride = () => {
  if (typeof document === 'undefined') return
  if (!themeOverrideCss.trim()) return

  document.getElementById(STYLE_ID)?.remove()

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = themeOverrideCss
  document.head.appendChild(style)
}
