import { useApiQuery } from '@/hooks/useApiQuery'
import { getAlarmList } from '../api'
import { alarmKeys } from '../queries/alarmKeys'

export const useAlarmList = () => {
  const { data = [], isLoading } = useApiQuery({
    queryKey: alarmKeys.list(),
    queryFn: getAlarmList,
    refetchInterval: 30_000,
  })

  const unreadCount = data.filter((a) => !a.isRead).length

  return { alarms: data, unreadCount, isLoading }
}
