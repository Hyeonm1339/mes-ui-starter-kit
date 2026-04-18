import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/config/navigation'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { openTab } from '@/store/slices/tabSlice'

export const TopNav = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const activeTabPath = useAppSelector((state) => state.tab.activeTabPath)
  const [openL1, setOpenL1] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenL1(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLeafClick = (to: string, labelKey: string) => {
    dispatch(openTab({ path: to, labelKey }))
    navigate(to)
    setOpenL1(null)
  }

  // 현재 활성 탭이 속한 L1 레이블 계산
  const activeL1 = navItems.find((l1) =>
    l1.children.some((l2) => l2.children.some((leaf) => leaf.to === activeTabPath)),
  )?.label

  return (
    <nav ref={navRef} className="relative flex items-center border-b bg-card px-2 h-9 shrink-0">
      {navItems.map((l1) => {
        const isOpen = openL1 === l1.label
        const isActive = activeL1 === l1.label
        const Icon = l1.icon

        return (
          <div key={l1.label} className="relative">
            <button
              onClick={() => setOpenL1(isOpen ? null : l1.label)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 h-7 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                isOpen && 'bg-accent text-accent-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {t(l1.label)}
              <ChevronDown
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform duration-150',
                  isOpen && 'rotate-180',
                )}
              />
            </button>

            {/* 드롭다운 */}
            {isOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-none border bg-popover shadow-md">
                {l1.children.map((l2) => (
                  <div key={l2.label}>
                    {/* L2 그룹 헤더 */}
                    <div className="border-b px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 bg-muted/50">
                      {t(l2.label)}
                    </div>
                    {/* L3 리프 항목 */}
                    {l2.children.map((leaf) => (
                      <button
                        key={leaf.to}
                        onClick={() => handleLeafClick(leaf.to, leaf.label)}
                        className={cn(
                          'w-full px-3 py-1.5 text-left text-xs transition-colors',
                          activeTabPath === leaf.to
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                        )}
                      >
                        {t(leaf.label)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
