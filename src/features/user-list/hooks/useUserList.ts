import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getUserList } from '../api'
import { userListKeys } from '../queries'
import type { PaginationParams, SortParam } from '@/types/api'
import type { UserSearchParams } from '../types'

export const useUserList = () => {
  const [submittedFilters, setSubmittedFilters] = useState<UserSearchParams>({})
  const [pageNo, setPageNo] = useState(1)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState<SortParam[]>([])

  const params: PaginationParams<UserSearchParams> = {
    page: { pageNo, size },
    sort,
    filters: submittedFilters,
  }

  const { data, isLoading } = useApiQuery({
    queryKey: userListKeys.list(params),
    queryFn: () => getUserList(params),
  })

  const submitSearch = (filters: UserSearchParams) => {
    setPageNo(1)
    setSubmittedFilters(filters)
  }

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    setPageNo(pageIndex + 1)
    setSize(pageSize)
  }

  const handleSortChange = (sorts: SortParam[]) => {
    setPageNo(1)
    setSort(sorts)
  }

  return {
    data: data?.data ?? [],
    page: data?.page,
    isLoading,
    size,
    submitSearch,
    handlePageChange,
    handleSortChange,
  }
}
