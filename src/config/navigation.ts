import { Factory } from 'lucide-react'
import type { NavLevel1 } from '@hyeonm1339/mes-ui-kit'
import { page } from '@hyeonm1339/mes-ui-kit'

// ─── re-export for pageRegistry ──────────────────────────────────────────────
export type { NavLevel1, NavLevel2, NavLeaf } from '@hyeonm1339/mes-ui-kit'

// ─── 메뉴 구조 정의 ───────────────────────────────────────────────────────────
// 새 기능 추가 시:
//   1. src/features/<name>/pages/<Name>Page.tsx 생성
//   2. 아래 children 배열에 leaf 항목 추가
//   3. pageRegistry는 navItems에서 자동 생성됨
export const navItems: NavLevel1[] = [
  {
    label: 'nav.production',
    icon: Factory,
    children: [
      {
        label: 'nav.workOrder',
        children: [
          {
            label: 'nav.workOrderList',
            to: '/production/work-order',
            component: page(
              () => import('@/features/_template/pages/TemplatePage'),
              'TemplatePage',
            ),
          },
        ],
      },
    ],
  },
]
