import { useLocation } from 'react-router-dom'
import { navItems } from '@/config/navigation'

export interface BreadcrumbItem {
  labelKey: string
}

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const { pathname } = useLocation()

  for (const l1 of navItems) {
    for (const l2 of l1.children) {
      for (const l3 of l2.children) {
        if (l3.to === pathname) {
          return [{ labelKey: l1.label }, { labelKey: l2.label }, { labelKey: l3.label }]
        }
      }
    }
  }

  return []
}
