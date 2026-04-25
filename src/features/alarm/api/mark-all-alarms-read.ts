import { api } from '@/lib/api'

export const markAllAlarmsRead = () => api.patch<void>('/alarms/read-all')
