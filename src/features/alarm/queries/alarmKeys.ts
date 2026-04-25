export const alarmKeys = {
  all: ['alarms'] as const,
  list: () => [...alarmKeys.all, 'list'] as const,
}
