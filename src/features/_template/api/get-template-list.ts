import { api } from '@/lib/api'
import type { TemplateItem, TemplateSearchParams } from '../types'

export const getTemplateList = (params: TemplateSearchParams) =>
  api.get<TemplateItem[]>('/template', params)
