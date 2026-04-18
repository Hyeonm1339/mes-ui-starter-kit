import { Palette, LayoutTemplate } from 'lucide-react'
import type { NavLevel1 } from '@hyeonm1339/mes-ui-kit'
import { page } from '@hyeonm1339/mes-ui-kit'

// ─── re-export for pageRegistry ──────────────────────────────────────────────
export type { NavLevel1, NavLevel2, NavLeaf } from '@hyeonm1339/mes-ui-kit'

// ─── DEV 전용 메뉴 (import.meta.env.DEV === true 일 때만 포함) ─────────────────
const devNavItems: NavLevel1[] = import.meta.env.DEV
  ? [
      {
        label: 'nav.devTools',
        icon: Palette,
        children: [
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
        ],
      },
      {
        label: 'nav.samplePages',
        icon: LayoutTemplate,
        children: [
          {
            label: 'nav.loginPages',
            children: [
              {
                label: 'nav.loginPage',
                to: '/samples/page/login',
                component: page(
                  () => import('@/pages/samples/page/LoginPageSample'),
                  'LoginPageSample',
                ),
              },
            ],
          },
          {
            label: 'nav.chartPages',
            children: [
              {
                label: 'nav.chartSample',
                to: '/samples/display/chart',
                component: page(
                  () => import('@/pages/samples/display/ChartSample'),
                  'ChartSample',
                ),
              },
            ],
          },
          {
            label: 'nav.listLayout',
            children: [
              {
                label: 'nav.searchLayoutSample',
                to: '/samples/page/search-layout',
                component: page(
                  () => import('@/pages/samples/page/SearchLayoutSample'),
                  'SearchLayoutSample',
                ),
              },
            ],
          },
          {
            label: 'nav.popLayout',
            children: [
              {
                label: 'nav.popSamplePage',
                to: '/samples/pop/work-order',
                component: page(
                  () => import('@/pages/samples/pop/PopSamplePage'),
                  'PopSamplePage',
                ),
              },
            ],
          },
        ],
      },
    ]
  : []

// ─── 메뉴 구조 정의 ───────────────────────────────────────────────────────────
// 새 기능 추가 시:
//   1. src/features/<name>/pages/<Name>Page.tsx 생성
//   2. 아래 navItems 배열에 leaf 항목 추가
//   3. pageRegistry는 navItems에서 자동 생성됨
export const navItems: NavLevel1[] = [
  // ↓ 실제 업무 메뉴를 여기에 추가
  ...devNavItems,
]
