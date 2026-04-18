import type { NavLevel2 } from '@hyeonm1339/mes-ui-kit'
import { page } from '@hyeonm1339/mes-ui-kit'

export const samplePagesNav: NavLevel2[] = [
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
]
