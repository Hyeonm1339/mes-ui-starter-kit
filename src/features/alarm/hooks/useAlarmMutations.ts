import { useApiMutation } from '@/hooks/useApiMutation'
import { markAlarmRead, markAllAlarmsRead } from '../api'
import { alarmKeys } from '../queries/alarmKeys'

export const useAlarmMutations = () => {
  const markRead = useApiMutation({
    mutationFn: (id: number) => markAlarmRead(id),
    invalidateKeys: [alarmKeys.list()],
  })

  const markAllRead = useApiMutation({
    mutationFn: () => markAllAlarmsRead(),
    invalidateKeys: [alarmKeys.list()],
  })

  return { markRead, markAllRead }
}
