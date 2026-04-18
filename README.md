# MES UI Starter Kit

MES(제조 실행 시스템) 개발을 위한 스캐폴드 프로젝트입니다.  
공통 UI 컴포넌트는 `@hyeonm1339/mes-ui-kit` 패키지로 제공되며,  
이 프로젝트는 레이아웃, 라우터, 상태관리 등 앱 인프라와 예제 페이지를 포함합니다.

---

## 시작하기

### 1. GitHub Packages 인증 설정

프로젝트 루트에 `.npmrc` 파일을 생성합니다.  
(`.npmrc.example`을 참고하세요)

```bash
cp .npmrc.example .npmrc
```

`.npmrc` 파일을 열어 토큰을 입력합니다:

```
@hyeonm1339:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=발급받은_토큰
```

> GitHub Personal Access Token 발급: GitHub → Settings → Developer settings → Personal access tokens  
> 필요 권한: `read:packages`

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
# http://localhost:3000
```

---

## 포함된 예제 페이지

| 경로 | 설명 |
|---|---|
| `/dev/design-tokens` | 디자인 토큰 편집기 (CSS 변수 실시간 수정 및 내보내기) |
| `/samples/page/login` | 로그인 / 비밀번호 변경 페이지 예시 |
| `/samples/display/chart` | 막대 · 라인 · 영역 · 파이 · 복합 · 방사형 차트 예시 |
| `/samples/page/search-layout` | 조회 조건 + 데이터 그리드 레이아웃 예시 |
| `/samples/pop/work-order` | POP(현장용) 작업지시 실행 화면 예시 |

---

## 새 기능 추가 절차

### 1. 피처 폴더 생성

`src/features/_template/`을 복사해서 시작합니다:

```bash
cp -r src/features/_template src/features/<기능명>
```

### 2. 파일명 / 컴포넌트명 변경

`template` → `<기능명>`으로 일괄 치환합니다.

### 3. 메뉴 등록 (`src/config/navigation.ts`)

```ts
import { page } from '@hyeonm1339/mes-ui-kit'

// navItems 배열에 항목 추가
{
  label: 'nav.workOrder',
  children: [
    {
      label: 'nav.workOrderList',
      to: '/production/work-order',
      component: page(
        () => import('@/features/work-order/pages/WorkOrderPage'),
        'WorkOrderPage',
      ),
    },
  ],
}
```

> `pageRegistry`는 `navItems`에서 자동 생성되므로 별도 등록 불필요

### 4. 번역 키 추가 (`src/locales/ko/common.json`)

```json
{
  "nav": {
    "workOrderList": "작업지시 목록"
  }
}
```

---

## 프로젝트 구조

```
src/
├── App.tsx                    # 앱 루트
├── main.tsx                   # 엔트리 포인트
├── index.css                  # 전역 스타일 + 디자인 토큰
│
├── config/
│   ├── navigation.ts          # 사이드바 메뉴 트리 (3단계)
│   ├── pageRegistry.tsx       # 경로 → 컴포넌트 매핑 (자동 생성)
│   └── theme.ts               # 디자인 토큰 오버라이드
│
├── layouts/                   # 앱 레이아웃 (헤더, 사이드바, 탭바)
├── router/                    # React Router 설정
├── store/                     # Redux store (auth, tab 슬라이스)
│
├── hooks/
│   ├── useAppSelector.ts      # 타입 지정 Redux 훅
│   ├── useAppDispatch.ts
│   ├── useApiQuery.ts         # React Query 래퍼
│   ├── useApiMutation.ts
│   └── useBreadcrumb.ts
│
├── lib/
│   ├── axios.ts               # Axios 인스턴스 + 인터셉터
│   ├── api.ts                 # API 헬퍼 (get/post/put/delete)
│   ├── theme.tsx              # 다크모드 Provider
│   ├── zoom.tsx               # 페이지별 줌 Provider
│   ├── i18n.tsx               # 다국어 설정
│   └── toast.ts               # 토스트 헬퍼
│
├── pages/
│   ├── LoginPage.tsx          # 실제 로그인 페이지
│   └── samples/               # 예제 페이지
│       ├── page/              # 로그인 · 조회 레이아웃 예시
│       ├── display/           # 차트 예시
│       └── pop/               # POP 레이아웃 예시
│
├── features/
│   ├── _template/             # 새 기능 추가 시 복사 기준
│   │   ├── api/               # API 호출 함수
│   │   ├── components/        # View 컴포넌트
│   │   ├── hooks/             # 비즈니스 로직 훅
│   │   ├── pages/             # 라우팅 진입점
│   │   ├── queries/           # React Query 키 팩토리
│   │   ├── schemas/           # Zod 유효성 검사
│   │   └── types/             # 피처 전용 타입
│   │
│   └── design-tokens/         # 디자인 토큰 편집기
│
└── locales/
    ├── ko/common.json         # 한국어 번역
    └── en/common.json         # 영어 번역
```

---

## 컴포넌트 사용법

모든 공통 컴포넌트는 `@hyeonm1339/mes-ui-kit`에서 import합니다.

```tsx
import {
  AppInput,
  AppButton,
  AppSelect,
  AppDataGrid,
  AppSection,
  AppDatePicker,
  AppPageLayout,
  AppForm,
  // POP 컴포넌트
  PopButton,
  PopCard,
  PopTable,
  // 유틸
  cn,
  page,
} from '@hyeonm1339/mes-ui-kit'
```

---

## API 레이어

```ts
// src/features/<name>/api/get-<name>-list.ts
import { api } from '@/lib/api'
import type { WorkOrderItem, WorkOrderSearchParams } from '../types'

export const getWorkOrderList = (params: WorkOrderSearchParams) =>
  api.get<WorkOrderItem[]>('/work-order', params)
```

서버 응답 규격: `{ success: boolean, message: string, data: T }`

---

## 환경 변수

| 변수 | 기본값 | 설명 |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | API 서버 주소 |

개발 서버는 `/api` 요청을 `http://localhost:8080`으로 프록시합니다.

---

## 디자인 토큰 커스터마이징

`src/config/theme.ts`에 CSS 변수를 붙여넣으면 전체 앱에 즉시 반영됩니다:

```ts
export const themeOverrideCss = `
  :root {
    --primary: oklch(0.5 0.2 250);
    --radius: 0.3rem;
  }
  .dark {
    --primary: oklch(0.6 0.2 250);
  }
`
```

또는 `/dev/design-tokens` 페이지에서 UI로 편집 후 JSON/CSS로 내보내기 할 수 있습니다.

---

## 스크립트

```bash
npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 타입 체크 + 프로덕션 빌드
npm run lint       # ESLint 검사
npm run lint:fix   # ESLint 자동 수정
npm run format     # Prettier 포맷
npm run preview    # 빌드 결과 미리보기
```
