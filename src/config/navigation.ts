import { Palette, LayoutTemplate, Users } from 'lucide-react'
import type { NavLevel1 } from '@hyeonm1339/mes-ui-kit'
import { devToolsNav } from './nav/dev-tools'
import { samplePagesNav } from './nav/sample-pages'
import { userNav } from './nav/user'

// ─── re-export for pageRegistry / layout ─────────────────────────────────────
export type { NavLevel1, NavLevel2, NavLeaf } from '@hyeonm1339/mes-ui-kit'

// ─── DEV 전용 메뉴 (개발 빌드에서만 번들에 포함) ──────────────────────────────
const devNavItems: NavLevel1[] = import.meta.env.DEV
  ? [
      { label: 'nav.devTools',   icon: Palette,       children: devToolsNav },
      { label: 'nav.samplePages', icon: LayoutTemplate, children: samplePagesNav },
    ]
  : []

// ─── 메뉴 구조 정의 ───────────────────────────────────────────────────────────
// 새 기능 추가 시:
//   1. src/features/<name>/pages/<Name>Page.tsx 생성
//   2. src/config/nav/<domain>.ts 파일에 NavLevel2 배열 추가
//   3. 아래 navItems 배열에 NavLevel1 항목으로 조립
export const navItems: NavLevel1[] = [
  { label: 'nav.userManagement', icon: Users, children: userNav },
  ...devNavItems,
]
