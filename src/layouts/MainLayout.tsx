import { useState, useEffect, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { Header } from './Header'
import { TabBar } from '@/components/common/TabBar'
import { useAppSelector } from '@/hooks/useAppSelector'
import { pageRegistry } from '@/config/pageRegistry'
import { useZoom } from '@/lib/zoom'
import { useNavPosition } from '@/lib/navPosition'

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches)
  const { t } = useTranslation()
  const { tabs, activeTabPath } = useAppSelector((state) => state.tab)
  const { getZoom } = useZoom()
  const { position, setPosition } = useNavPosition()

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)')
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (e.matches) setCollapsed(true)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        navPosition={position}
        onNavPositionChange={setPosition}
        sidebarCollapsed={collapsed}
        onSidebarToggle={() => setCollapsed((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden min-w-0">
        {position === 'left' && !collapsed && (
          <div
            className="fixed inset-x-0 bottom-0 top-10 z-40 bg-black/40 sm:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}

        {position === 'left' && (
          <Sidebar
            collapsed={collapsed}
            onClose={() => {
              if (isMobile) setCollapsed(true)
            }}
          />
        )}

        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {position === 'top' && <TopNav />}

          <TabBar />

          <main className="flex-1 overflow-auto">
            {tabs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                {position === 'left' ? t('layout.selectPageLeft') : t('layout.selectPageTop')}
              </div>
            ) : (
              tabs.map((tab) => (
                <div
                  key={tab.path}
                  style={{ display: tab.path === activeTabPath ? 'block' : 'none' }}
                  className="h-full p-6"
                >
                  <div style={{ zoom: getZoom(tab.path) }} className="h-full">
                    <Suspense
                      fallback={
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          로딩 중...
                        </div>
                      }
                    >
                      {pageRegistry[tab.path]}
                    </Suspense>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
