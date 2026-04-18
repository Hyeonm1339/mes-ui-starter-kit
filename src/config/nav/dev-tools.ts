import type { NavLevel2 } from '@hyeonm1339/mes-ui-kit'
import { page } from '@hyeonm1339/mes-ui-kit'

export const devToolsNav: NavLevel2[] = [
  {
    label: 'nav.design',
    children: [
      {
        label: 'nav.designTokens',
        to: '/dev/design-tokens',
        component: page(
          () => import('@/pages/DesignTokensPage'),
          'DesignTokensPage',
        ),
      },
    ],
  },
]
