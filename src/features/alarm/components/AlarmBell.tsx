import { useState } from 'react'
import { Bell } from 'lucide-react'
import {
  AppPopover,
  AppDialog,
  AppBadge,
  AppButton,
  AppScrollArea,
} from '@hyeonm1339/mes-ui-kit'
import { cn } from '@/lib/utils'
import { useAlarmList } from '../hooks/useAlarmList'
import { useAlarmMutations } from '../hooks/useAlarmMutations'
import type { AlarmItem, AlarmSeverity } from '../types'

const severityConfig: Record<AlarmSeverity, { status: 'error' | 'warning' | 'info'; label: string }> = {
  critical: { status: 'error', label: '긴급' },
  warning: { status: 'warning', label: '경고' },
  info: { status: 'info', label: '정보' },
}

const formatRelativeTime = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

export const AlarmBell = () => {
  const [open, setOpen] = useState(false)
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmItem | null>(null)

  const { alarms, unreadCount } = useAlarmList()
  const { markRead, markAllRead } = useAlarmMutations()

  const handleItemClick = (alarm: AlarmItem) => {
    setOpen(false)
    setSelectedAlarm(alarm)
    if (!alarm.isRead) {
      markRead.mutate(alarm.id)
    }
  }

  const handleCloseDetail = () => setSelectedAlarm(null)

  return (
    <>
      <AppPopover
        open={open}
        onOpenChange={setOpen}
        align="end"
        className="w-80 p-0"
        trigger={
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-header-foreground/70 hover:bg-header-foreground/10 hover:text-header-foreground transition-colors"
            title="알람"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        }
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">알람</span>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              모두 읽음
            </button>
          )}
        </div>

        {/* 목록 */}
        {alarms.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            알람이 없습니다.
          </div>
        ) : (
          <AppScrollArea height={320}>
            <ul>
              {alarms.map((alarm) => (
                <li key={alarm.id}>
                  <button
                    onClick={() => handleItemClick(alarm)}
                    className={cn(
                      'w-full px-3 py-2.5 text-left transition-colors hover:bg-accent',
                      !alarm.isRead && 'bg-accent/40',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                          !alarm.isRead ? 'bg-blue-500' : 'bg-transparent',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <AppBadge
                            status={severityConfig[alarm.severity].status}
                            className="text-[10px] h-4 px-1 py-0"
                          >
                            {severityConfig[alarm.severity].label}
                          </AppBadge>
                          <span
                            className={cn(
                              'truncate text-xs font-medium',
                              alarm.isRead && 'text-muted-foreground',
                            )}
                          >
                            {alarm.title}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="truncate text-[11px] text-muted-foreground">
                            {alarm.source}
                          </span>
                          <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">
                            {formatRelativeTime(alarm.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="mx-3 h-px bg-border" />
                </li>
              ))}
            </ul>
          </AppScrollArea>
        )}
      </AppPopover>

      {/* 상세 다이얼로그 */}
      <AppDialog
        open={!!selectedAlarm}
        onClose={handleCloseDetail}
        title={selectedAlarm?.title}
        size="sm"
        footer={
          <AppButton variant="outline" onClick={handleCloseDetail}>
            닫기
          </AppButton>
        }
      >
        {selectedAlarm && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AppBadge status={severityConfig[selectedAlarm.severity].status}>
                {severityConfig[selectedAlarm.severity].label}
              </AppBadge>
              <span>{selectedAlarm.source}</span>
              <span>·</span>
              <span>{formatRelativeTime(selectedAlarm.createdAt)}</span>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {selectedAlarm.content}
            </p>
          </div>
        )}
      </AppDialog>
    </>
  )
}
