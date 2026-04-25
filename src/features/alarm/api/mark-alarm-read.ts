import { api } from '@/lib/api'

export const markAlarmRead = (id: number) => api.patch<void>(`/alarms/${id}/read`)
