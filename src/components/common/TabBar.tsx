import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, ChevronDown, PanelLeftClose, PanelRightClose, Layers, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { closeTab, setActiveTab } from '@/store/slices/tabSlice'
import { useNavigate } from 'react-router-dom'
import { store } from '@/store'

interface ContextMenu {
  x: number
  y: number
  tabPath: string
}

const MORE_BTN_WIDTH = 36 // "..." 버튼 너비(px) 예약

export const TabBar = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { tabs, activeTabPath } = useAppSelector((state) => state.tab)

  const containerRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const [splitIdx, setSplitIdx] = useState(tabs.length)
  const [moreOpen, setMoreOpen] = useState(false)
  const [moreRect, setMoreRect] = useState<{ top: number; right: number } | null>(null)
  const moreBtnRef = useRef<HTMLButtonElement>(null)
  const moreDropdownRef = useRef<HTMLDivElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null)

  // 컨테이너/ghost 측정 → splitIdx 계산
  useLayoutEffect(() => {
    const container = containerRef.current
    const ghost = ghostRef.current
    if (!container || !ghost) return

    const recalc = () => {
      const available = container.clientWidth
      const children = Array.from(ghost.children) as HTMLElement[]
      const widths = children.map((el) => el.getBoundingClientRect().width + 2)

      let used = 0
      let next = tabs.length
      for (let i = 0; i < tabs.length; i++) {
        const w = widths[i] ?? 80
        const needMore = i < tabs.length - 1
        if (used + w + (needMore ? MORE_BTN_WIDTH : 0) > available) {
          next = i
          break
        }
        used += w
      }
      setSplitIdx(next)
    }

    recalc()
    const ro = new ResizeObserver(recalc)
    ro.observe(container)
    return () => ro.disconnect()
  }, [tabs])

  // 외부 클릭 시 더보기 드롭다운 / 컨텍스트 메뉴 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const insideMoreBtn = moreBtnRef.current?.contains(target)
      const insideMoreDropdown = moreDropdownRef.current?.contains(target)
      if (!insideMoreBtn && !insideMoreDropdown) {
        setMoreOpen(false)
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(target)) {
        setContextMenu(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const visibleTabs = tabs.slice(0, splitIdx)
  const overflowTabs = tabs.slice(splitIdx)

  if (tabs.length === 0) return null

  const handleTabClick = (path: string) => {
    dispatch(setActiveTab(path))
    navigate(path)
  }

  const handleClose = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    dispatch(closeTab(path))
    const { tabs: currentTabs } = store.getState().tab
    if (path === activeTabPath) {
      const next = currentTabs.find((t) => t.path !== path)
      if (next) navigate(next.path)
      else navigate('/')
    }
  }

  const handleContextMenu = (e: React.MouseEvent, tabPath: string) => {
    e.preventDefault()
    e.stopPropagation()
    // 뷰포트 경계를 넘지 않도록 위치 조정
    const menuWidth = 192
    const menuHeight = 160
    const x = e.clientX + menuWidth > window.innerWidth ? e.clientX - menuWidth : e.clientX
    const y = e.clientY + menuHeight > window.innerHeight ? e.clientY - menuHeight : e.clientY
    setContextMenu({ x, y, tabPath })
  }

  const handleCloseTab = (tabPath: string) => {
    dispatch(closeTab(tabPath))
    const { tabs: currentTabs } = store.getState().tab
    if (tabPath === activeTabPath) {
      const next = currentTabs.find((t) => t.path !== tabPath)
      if (next) navigate(next.path)
      else navigate('/')
    }
    setContextMenu(null)
  }

  const handleCloseOthers = (tabPath: string) => {
    const { tabs: allTabs } = store.getState().tab
    allTabs.forEach((t) => {
      if (t.path !== tabPath) dispatch(closeTab(t.path))
    })
    dispatch(setActiveTab(tabPath))
    navigate(tabPath)
    setContextMenu(null)
  }

  const handleCloseLeft = (tabPath: string) => {
    const { tabs: allTabs } = store.getState().tab
    const idx = allTabs.findIndex((t) => t.path === tabPath)
    if (idx > 0) {
      allTabs.slice(0, idx).forEach((t) => dispatch(closeTab(t.path)))
    }
    setContextMenu(null)
  }

  const handleCloseRight = (tabPath: string) => {
    const { tabs: allTabs } = store.getState().tab
    const idx = allTabs.findIndex((t) => t.path === tabPath)
    if (idx >= 0) {
      allTabs.slice(idx + 1).forEach((t) => dispatch(closeTab(t.path)))
    }
    setContextMenu(null)
  }

  const handleCloseAll = () => {
    const { tabs: allTabs } = store.getState().tab
    allTabs.forEach((t) => dispatch(closeTab(t.path)))
    navigate('/')
    setContextMenu(null)
  }

  const renderTab = (tab: { path: string; labelKey: string }, inDropdown = false) => {
    const isActive = tab.path === activeTabPath
    if (inDropdown) {
      return (
        <button
          key={tab.path}
          onClick={() => {
            handleTabClick(tab.path)
            setMoreOpen(false)
          }}
          className={cn(
            'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-xs transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <span className="truncate">{t(tab.labelKey)}</span>
          <span
            onClick={(e) => {
              handleClose(e, tab.path)
              setMoreOpen(false)
            }}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm hover:bg-black/10"
          >
            <X className="h-3 w-3" />
          </span>
        </button>
      )
    }

    return (
      <button
        key={tab.path}
        onClick={() => handleTabClick(tab.path)}
        onContextMenu={(e) => handleContextMenu(e, tab.path)}
        className={cn(
          'group flex shrink-0 items-center gap-1.5 rounded-t-md border border-b-0 px-3 py-1.5 text-xs transition-colors whitespace-nowrap',
          isActive
            ? 'bg-background text-foreground border-border'
            : 'bg-transparent text-muted-foreground border-transparent hover:bg-background/60 hover:text-foreground',
        )}
      >
        {t(tab.labelKey)}
        <span
          onClick={(e) => handleClose(e, tab.path)}
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-sm transition-colors',
            isActive
              ? 'hover:bg-muted text-muted-foreground'
              : 'opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground',
          )}
        >
          <X className="h-3 w-3" />
        </span>
      </button>
    )
  }

  const overflowHasActive = overflowTabs.some((t) => t.path === activeTabPath)

  return (
    <div className="border-b bg-muted/40 pt-1 px-2 shrink-0 min-w-0">
      {/* Ghost 측정 영역 — 격리된 zero-height 컨테이너 (문서 흐름과 스크롤에 영향 없음) */}
      <div className="relative h-0 overflow-hidden" aria-hidden>
        <div
          ref={ghostRef}
          className="absolute top-0 left-0 flex gap-0.5 w-max invisible pointer-events-none"
        >
          {tabs.map((tab) => (
            <button
              key={tab.path}
              className="flex shrink-0 items-center gap-1.5 rounded-t-md border border-b-0 px-3 py-1.5 text-xs whitespace-nowrap"
            >
              {t(tab.labelKey)}
              <span className="flex h-4 w-4 items-center justify-center">
                <X className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 실제 탭 행 */}
      <div ref={containerRef} className="flex items-center gap-0.5 overflow-hidden min-w-0">
        {visibleTabs.map((tab) => renderTab(tab))}

        {/* 더보기 버튼 */}
        {overflowTabs.length > 0 && (
          <button
            ref={moreBtnRef}
            onClick={() => {
              if (moreOpen) {
                setMoreOpen(false)
                return
              }
              const rect = moreBtnRef.current?.getBoundingClientRect()
              if (rect) {
                setMoreRect({ top: rect.bottom + 2, right: window.innerWidth - rect.right })
              }
              setMoreOpen(true)
            }}
            title="더보기"
            className={cn(
              'flex shrink-0 items-center gap-0.5 rounded-t-md border border-b-0 px-2 py-1.5 text-xs transition-colors whitespace-nowrap',
              overflowHasActive
                ? 'bg-background text-foreground border-border'
                : 'bg-transparent text-muted-foreground border-transparent hover:bg-background/60 hover:text-foreground',
            )}
          >
            <span className="text-[10px] font-medium">+{overflowTabs.length}</span>
            <ChevronDown className={cn('h-3 w-3 transition-transform', moreOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* 더보기 드롭다운 — fixed 포지셔닝으로 overflow-hidden 벗어남 */}
      {moreOpen && moreRect && (
        <div
          ref={moreDropdownRef}
          className="fixed z-50 min-w-[160px] max-h-64 overflow-y-auto rounded-md border bg-popover shadow-md"
          style={{ top: moreRect.top, right: moreRect.right }}
        >
          {overflowTabs.map((tab) => renderTab(tab, true))}
        </div>
      )}

      {/* 컨텍스트 메뉴 */}
      {contextMenu &&
        (() => {
          const { tabs: allTabs } = store.getState().tab
          const idx = allTabs.findIndex((t) => t.path === contextMenu.tabPath)
          const hasLeft = idx > 0
          const hasRight = idx < allTabs.length - 1
          const hasOthers = allTabs.length > 1

          return (
            <div
              ref={contextMenuRef}
              className="fixed z-50 w-48 rounded-md border bg-popover py-1 shadow-lg"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button
                onClick={() => handleCloseTab(contextMenu.tabPath)}
                className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-left hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5 shrink-0" />
                현재 탭 닫기
              </button>

              <div className="my-1 border-t" />

              <button
                onClick={() => handleCloseLeft(contextMenu.tabPath)}
                disabled={!hasLeft}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors',
                  hasLeft
                    ? 'hover:bg-accent hover:text-accent-foreground'
                    : 'text-muted-foreground/40 cursor-default',
                )}
              >
                <PanelLeftClose className="h-3.5 w-3.5 shrink-0" />
                좌측 탭 닫기
              </button>
              <button
                onClick={() => handleCloseRight(contextMenu.tabPath)}
                disabled={!hasRight}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors',
                  hasRight
                    ? 'hover:bg-accent hover:text-accent-foreground'
                    : 'text-muted-foreground/40 cursor-default',
                )}
              >
                <PanelRightClose className="h-3.5 w-3.5 shrink-0" />
                우측 탭 닫기
              </button>
              <button
                onClick={() => handleCloseOthers(contextMenu.tabPath)}
                disabled={!hasOthers}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-left transition-colors',
                  hasOthers
                    ? 'hover:bg-accent hover:text-accent-foreground'
                    : 'text-muted-foreground/40 cursor-default',
                )}
              >
                <Layers className="h-3.5 w-3.5 shrink-0" />
                다른 탭 모두 닫기
              </button>

              <div className="my-1 border-t" />

              <button
                onClick={handleCloseAll}
                className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-left text-destructive hover:bg-destructive/10 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5 shrink-0" />
                모두 닫기
              </button>
            </div>
          )
        })()}
    </div>
  )
}
