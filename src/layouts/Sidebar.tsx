import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/config/navigation'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { openTab } from '@/store/slices/tabSlice'

interface SidebarProps {
  collapsed: boolean
  onClose?: () => void
}

const findParents = (path: string): { l1: string; l2: string } | null => {
  for (const l1 of navItems) {
    for (const l2 of l1.children) {
      if (l2.children.some((leaf) => leaf.to === path)) {
        return { l1: l1.label, l2: l2.label }
      }
    }
  }
  return null
}

export const Sidebar = ({ collapsed, onClose }: SidebarProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const activeTabPath = useAppSelector((state) => state.tab.activeTabPath)
  const [openL1, setOpenL1] = useState<Set<string>>(new Set())
  const [openL2, setOpenL2] = useState<Set<string>>(new Set())
  const [activePopoverL1, setActivePopoverL1] = useState<string | null>(null)
  const [popoverTop, setPopoverTop] = useState(0)
  const popoverRef = useRef<HTMLDivElement>(null)

  const syncSidebar = useCallback((path: string) => {
    const parents = findParents(path)
    if (parents) {
      setOpenL1(new Set([parents.l1]))
      setOpenL2(new Set([parents.l2]))
    } else {
      setOpenL1(new Set())
      setOpenL2(new Set())
    }
  }, [])

  useEffect(() => {
    // Redux 탭 상태(외부) → 사이드바 열림 상태(로컬 UI) 동기화: 정당한 setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncSidebar(activeTabPath)
  }, [activeTabPath, syncSidebar])

  // 팝오버 외부 클릭 / ESC 닫기
  useEffect(() => {
    if (!activePopoverL1) return
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === 'Escape') setActivePopoverL1(null)
      } else if (e instanceof MouseEvent) {
        if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
          setActivePopoverL1(null)
        }
      }
    }
    window.addEventListener('mousedown', handler)
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('mousedown', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [activePopoverL1])

  // 사이드바가 펼쳐지면 팝오버 닫기
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!collapsed) setActivePopoverL1(null)
  }, [collapsed])

  const handleLeafClick = (to: string, labelKey: string) => {
    dispatch(openTab({ path: to, labelKey }))
    navigate(to)
    onClose?.()
  }

  const toggleL1 = (label: string) => {
    setOpenL1((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const toggleL2 = (label: string) => {
    setOpenL2((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const handleL1Click = (e: React.MouseEvent<HTMLButtonElement>, label: string) => {
    if (collapsed) {
      const rect = e.currentTarget.getBoundingClientRect()
      setPopoverTop(rect.top)
      setActivePopoverL1((prev) => (prev === label ? null : label))
    } else {
      toggleL1(label)
    }
  }

  const activePopoverData = activePopoverL1
    ? (navItems.find((n) => n.label === activePopoverL1) ?? null)
    : null

  return (
    <aside
      className={cn(
        'flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        collapsed
          ? 'hidden sm:flex sm:w-16'
          : 'fixed inset-x-0 bottom-0 top-10 z-50 flex w-full sm:relative sm:inset-auto sm:z-auto sm:w-60',
      )}
    >
      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((l1) => {
            const isL1Open = openL1.has(l1.label)
            const Icon = l1.icon

            return (
              <li key={l1.label}>
                {/* 1뎁스 */}
                <button
                  onClick={(e) => handleL1Click(e, l1.label)}
                  title={collapsed ? t(l1.label) : undefined}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    collapsed && 'justify-center',
                    collapsed &&
                      activePopoverL1 === l1.label &&
                      'bg-sidebar-accent text-sidebar-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{t(l1.label)}</span>
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 shrink-0 transition-transform duration-200',
                          isL1Open && 'rotate-180',
                        )}
                      />
                    </>
                  )}
                </button>

                {/* 2뎁스 */}
                {!collapsed && isL1Open && (
                  <ul className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                    {l1.children.map((l2) => {
                      const isL2Open = openL2.has(l2.label)

                      return (
                        <li key={l2.label}>
                          <button
                            onClick={() => toggleL2(l2.label)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          >
                            <span className="flex-1 truncate text-left">{t(l2.label)}</span>
                            <ChevronDown
                              className={cn(
                                'h-3 w-3 shrink-0 transition-transform duration-200',
                                isL2Open && 'rotate-180',
                              )}
                            />
                          </button>

                          {/* 3뎁스 */}
                          {isL2Open && (
                            <ul className="ml-2 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                              {l2.children.map((l3) => (
                                <li key={l3.to}>
                                  <button
                                    onClick={() => handleLeafClick(l3.to, l3.label)}
                                    className={cn(
                                      'w-full truncate rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                                      activeTabPath === l3.to
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                    )}
                                  >
                                    {t(l3.label)}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 축소 상태 플라이아웃 팝오버 */}
      {collapsed && activePopoverData && (
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            left: 64,
            top: popoverTop,
            maxHeight: `calc(100vh - ${popoverTop + 16}px)`,
          }}
          className="z-50 w-44 overflow-y-auto rounded-md border border-sidebar-border bg-sidebar py-1 shadow-lg"
        >
          {/* L1 제목 */}
          <div className="px-3 py-1.5 text-xs font-semibold text-sidebar-foreground/50">
            {t(activePopoverData.label)}
          </div>
          <div className="my-1 h-px bg-sidebar-border" />

          {activePopoverData.children.map((l2) => (
            <div key={l2.label}>
              {/* L2 그룹 헤더 */}
              <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-sidebar-foreground/40">
                {t(l2.label)}
              </div>
              {/* L3 리프 */}
              {l2.children.map((l3) => (
                <button
                  key={l3.to}
                  onClick={() => {
                    handleLeafClick(l3.to, l3.label)
                    setActivePopoverL1(null)
                  }}
                  className={cn(
                    'w-full px-5 py-1.5 text-left text-sm transition-colors',
                    activeTabPath === l3.to
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  {t(l3.label)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
