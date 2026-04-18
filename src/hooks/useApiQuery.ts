import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

type UseApiQueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> & {
  queryKey: readonly unknown[]
  queryFn: () => Promise<T>
}

export const useApiQuery = <T>({ queryKey, queryFn, ...options }: UseApiQueryOptions<T>) => {
  return useQuery<T>({
    queryKey,
    queryFn,
    ...options,
  })
}
