import { useLocation } from 'react-router-dom'
import { navItems } from '@/config/navigation'

export interface BreadcrumbItem {
  labelKey: string
}

type BreadcrumbMap = Record<string, BreadcrumbItem[]>

const breadcrumbMap: BreadcrumbMap = (() => {
  const map: BreadcrumbMap = {}

  for (const l1 of navItems) {
    for (const l2 of l1.children) {
      for (const l3 of l2.children) {
        map[l3.to] = [{ labelKey: l1.label }, { labelKey: l2.label }, { labelKey: l3.label }]
      }
    }
  }

  return map
})()

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const { pathname } = useLocation()
  return breadcrumbMap[pathname] ?? []
}
