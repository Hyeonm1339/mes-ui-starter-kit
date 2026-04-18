import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { MutationFunction } from '@tanstack/react-query'

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: MutationFunction<TData, TVariables>
  invalidateKeys?: readonly unknown[][]
  onSuccess?: (data: TData) => void
}

export const useApiMutation = <TData, TVariables>({
  mutationFn,
  invalidateKeys,
  onSuccess,
}: UseApiMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data) => {
      invalidateKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }))
      onSuccess?.(data)
    },
  })
}
