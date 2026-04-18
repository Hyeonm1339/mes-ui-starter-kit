import type { TemplateSearchParams } from '../types'

export const templateKeys = {
  all: ['template'] as const,
  list: (params: TemplateSearchParams) => ['template', 'list', params] as const,
  detail: (id: number) => ['template', 'detail', id] as const,
}
