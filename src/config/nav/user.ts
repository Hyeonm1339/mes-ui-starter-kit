import type { NavLevel2 } from '@hyeonm1339/mes-ui-kit'
import { page } from '@hyeonm1339/mes-ui-kit'

export const userNav: NavLevel2[] = [
  {
    label: 'nav.systemAccess',
    children: [
      {
        label: 'nav.userList',
        to: '/user/user-list',
        component: page(
          () => import('@/features/user-list/pages/UserListPage'),
          'UserListPage',
        ),
      },
    ],
  },
]
