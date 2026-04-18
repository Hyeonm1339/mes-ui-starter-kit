import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { getTemplateList } from '../api'
import { templateKeys } from '../queries/templateKeys'
import type { TemplateSearchParams } from '../types'

const defaultParams: TemplateSearchParams = {
  keyword: '',
}

export const useTemplateList = () => {
  const [params, setParams] = useState<TemplateSearchParams>(defaultParams)
  const [submittedParams, setSubmittedParams] = useState<TemplateSearchParams>(defaultParams)

  const {
    data = [],
    isLoading,
    isError,
  } = useApiQuery({
    queryKey: templateKeys.list(submittedParams),
    queryFn: () => getTemplateList(submittedParams),
  })

  const handleSearch = () => setSubmittedParams(params)
  const handleReset = () => {
    setParams(defaultParams)
    setSubmittedParams(defaultParams)
  }

  return { params, setParams, data, isLoading, isError, handleSearch, handleReset }
}
