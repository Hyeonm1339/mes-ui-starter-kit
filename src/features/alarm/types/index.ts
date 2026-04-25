export type AlarmSeverity = 'info' | 'warning' | 'critical'

export interface AlarmItem {
  id: number
  title: string
  content: string
  severity: AlarmSeverity
  isRead: boolean
  source: string
  createdAt: string
}
