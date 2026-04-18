# 페이지 등록 가이드

새 업무 페이지를 추가하는 전체 흐름을 설명합니다.

---

## 구조 개요

메뉴 트리는 **3단계**로 구성됩니다.

```
NavLevel1 (대분류)   → src/config/navigation.ts   icon + label
  NavLevel2 (중분류) → src/config/nav/<domain>.ts  label
    NavLeaf (페이지) → src/config/nav/<domain>.ts  label + to + component
```

`pageRegistry`와 `useBreadcrumb`는 `navItems`에서 **자동 생성**되므로 별도로 수정할 필요가 없습니다.

---

## 단계별 추가 방법

### 1. 피처 폴더 생성

`_template`을 복사해서 시작합니다.

```bash
cp -r src/features/_template src/features/work-order
```

### 2. Page 컴포넌트 작성

```tsx
// src/features/work-order/pages/WorkOrderPage.tsx
import { WorkOrderView } from '../components'
export const WorkOrderPage = () => <WorkOrderView />
```

### 3. nav 파일에 메뉴 정의

도메인별로 `src/config/nav/<domain>.ts` 파일을 만들고 `NavLevel2[]`를 export합니다.

```ts
// src/config/nav/production.ts
import type { NavLevel2 } from '@hyeonm1339/mes-ui-kit'
import { page } from '@hyeonm1339/mes-ui-kit'

export const productionNav: NavLevel2[] = [
  {
    label: 'nav.workOrder',           // ← 중분류 레이블 (i18n 키)
    children: [
      {
        label: 'nav.workOrderList',   // ← 페이지 레이블 (i18n 키)
        to: '/production/work-order',
        component: page(
          () => import('@/features/work-order/pages/WorkOrderPage'),
          'WorkOrderPage',
        ),
      },
    ],
  },
]
```

### 4. navigation.ts에 NavLevel1로 조립

```ts
// src/config/navigation.ts
import { Factory } from 'lucide-react'
import { productionNav } from './nav/production'

export const navItems: NavLevel1[] = [
  {
    label: 'nav.production',   // ← 대분류 레이블 (i18n 키)
    icon: Factory,
    children: productionNav,
  },
  ...devNavItems,
]
```

### 5. 번역 키 추가

`src/locales/ko/common.json`과 `src/locales/en/common.json`에 nav 키를 추가합니다.  
→ [다국어 등록 가이드](./i18n.md) 참고

---

## 파일 구조 정리

추가 완료 시 파일 구조는 다음과 같습니다.

```
src/
├── config/
│   ├── navigation.ts              ← NavLevel1 조립
│   └── nav/
│       └── production.ts          ← productionNav: NavLevel2[]
│
└── features/
    └── work-order/
        ├── pages/
        │   └── WorkOrderPage.tsx  ← pageRegistry 진입점
        ├── components/
        │   └── WorkOrderView.tsx
        ├── hooks/
        ├── api/
        └── ...
```

---

## 자동 처리되는 항목

| 항목 | 설명 |
|---|---|
| `pageRegistry` | `navItems`의 모든 leaf를 수집해 `{ to: element }` 맵 자동 생성 |
| 브레드크럼 | `useBreadcrumb`가 현재 경로로 트리를 역추적해 Level1 → Level2 → Leaf 순으로 반환 |
| 탭 제목 | leaf의 `label` 키를 i18n으로 번역해 탭 이름으로 사용 |

---

## DEV 전용 메뉴

개발 빌드에서만 보여야 하는 메뉴는 `navigation.ts`의 `devNavItems` 배열에 추가합니다.  
`import.meta.env.DEV`가 `false`인 프로덕션 빌드에서는 해당 코드와 페이지 청크가 번들에서 완전히 제외됩니다.

```ts
const devNavItems: NavLevel1[] = import.meta.env.DEV
  ? [
      { label: 'nav.devTools', icon: Palette, children: devToolsNav },
      // ...
    ]
  : []
```
