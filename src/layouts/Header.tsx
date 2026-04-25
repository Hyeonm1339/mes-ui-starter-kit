import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LogOut,
  User,
  ChevronRight,
  ChevronLeft,
  Home,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  PanelLeft,
  PanelTop,
  Menu,
} from 'lucide-react'
import { AppAlertDialog } from '@hyeonm1339/mes-ui-kit'
import { AlarmBell } from '@/features/alarm/components'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { clearCredentials } from '@/store/slices/authSlice'
import { logoutApi } from '@/features/auth/api/login'
import { setActiveTab } from '@/store/slices/tabSlice'
import { useBreadcrumb } from '@/hooks/useBreadcrumb'
import { useTheme } from '@/lib/theme'
import { useZoom } from '@/lib/zoom'
import type { NavPosition } from '@/lib/navPosition'

interface HeaderProps {
  navPosition: NavPosition
  onNavPositionChange: (pos: NavPosition) => void
  sidebarCollapsed?: boolean
  onSidebarToggle?: () => void
}

export const Header = ({
  navPosition,
  onNavPositionChange,
  sidebarCollapsed,
  onSidebarToggle,
}: HeaderProps) => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const breadcrumb = useBreadcrumb()
  const { theme, toggleTheme } = useTheme()
  const { getZoom, zoomIn, zoomOut, resetZoom } = useZoom()
  const activeTabPath = useAppSelector((state) => state.tab.activeTabPath)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const handleLogout = () => {
    const userId = user?.userId
    dispatch(clearCredentials())
    if (userId) logoutApi(userId).catch(() => {})
  }

  const handleHome = () => {
    dispatch(setActiveTab(''))
    navigate('/')
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko')
  }

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-header-border bg-header px-2">
      {/* 좌측 영역: 사이드바 토글 + breadcrumb */}
      <div className="flex items-center gap-1 min-w-0">
        {/* 사이드바 토글 버튼 (좌측 네비게이션 모드일 때) */}
        {navPosition === 'left' && onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-header-foreground/70 hover:bg-header-foreground/10 transition-colors"
            title={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
        {/* MES 브랜드 — 항상 표시, 클릭 시 홈 이동 */}
        <button
          onClick={handleHome}
          className="px-1 text-sm font-bold text-header-foreground hover:opacity-70 transition-opacity"
          title="홈으로"
        >
          MES
        </button>
        {/* breadcrumb + 홈 버튼 */}
        <nav className="flex items-center gap-1 text-sm min-w-0">
          <button
            onClick={handleHome}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-header-foreground/70 hover:bg-header-foreground/10 transition-colors"
            title="홈으로"
            aria-label="홈으로"
          >
            <Home className="h-4 w-4" />
          </button>
          {/* 모바일: 마지막 페이지명만 */}
          {breadcrumb.length > 0 && (
            <span className="truncate font-medium text-header-foreground lg:hidden">
              {t(breadcrumb[breadcrumb.length - 1].labelKey)}
            </span>
          )}
          {/* lg 이상: 전체 경로 */}
          <span className="hidden lg:contents">
            {breadcrumb.map((item, index) => (
              <span key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3 w-3 text-header-foreground/50" />}
                <span
                  className={
                    index === breadcrumb.length - 1
                      ? 'font-medium text-header-foreground'
                      : 'text-header-foreground/70'
                  }
                >
                  {t(item.labelKey)}
                </span>
              </span>
            ))}
          </span>
        </nav>
      </div>

      {/* 우측 영역: 각종 액션 버튼 */}
      <div className="flex items-center gap-1">
        {/* 내비게이션 위치 토글 */}
        <button
          onClick={() => onNavPositionChange(navPosition === 'left' ? 'top' : 'left')}
          className="flex h-8 w-8 items-center justify-center rounded-md text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors"
          title={navPosition === 'left' ? '상단 내비게이션으로 전환' : '좌측 내비게이션으로 전환'}
        >
          {navPosition === 'left' ? (
            <PanelTop className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </button>

        {/* 다크모드 토글 */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors"
          title={theme === 'light' ? '다크 모드' : '라이트 모드'}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* 화면 확대/축소 — 작은 화면에서 숨김 */}
        {activeTabPath && (
          <div className="hidden md:flex items-center">
            <button
              onClick={() => zoomOut(activeTabPath)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors"
              title="축소"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => resetZoom(activeTabPath)}
              className="rounded-md px-1.5 py-1 text-xs tabular-nums text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors min-w-[3rem] text-center"
              title="배율 초기화"
            >
              {Math.round(getZoom(activeTabPath) * 100)}%
            </button>
            <button
              onClick={() => zoomIn(activeTabPath)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors"
              title="확대"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 언어 토글 */}
        <button
          onClick={toggleLanguage}
          className="rounded-md px-2 py-1 text-sm text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors"
        >
          {i18n.language === 'ko' ? 'EN' : 'KO'}
        </button>

        {/* 알람 */}
        <AlarmBell />

        <div className="mx-2 h-4 w-px bg-header-foreground/20" />

        {/* 사용자 */}
        <div className="flex items-center gap-2 text-sm text-header-foreground/70">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user?.userName}</span>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={() => setLogoutOpen(true)}
          className="flex h-8 w-8 sm:w-auto items-center justify-center gap-1 rounded-md sm:px-2 py-1 text-sm text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors"
          title={t('auth.logout')}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t('auth.logout')}</span>
        </button>

        <AppAlertDialog
          open={logoutOpen}
          title="로그아웃"
          description="로그아웃 하시겠습니까?"
          confirmLabel="로그아웃"
          cancelLabel="취소"
          onClose={() => setLogoutOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </header>
  )
}
