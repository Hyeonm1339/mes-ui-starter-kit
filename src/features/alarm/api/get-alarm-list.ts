import { api } from '@/lib/api'
import type { AlarmItem } from '../types'

export const getAlarmList = () => api.get<AlarmItem[]>('/alarms')
