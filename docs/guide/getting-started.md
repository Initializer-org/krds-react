# 시작하기

KRDS React는 [KRDS(대한민국 정부 디자인 시스템)](https://www.krds.go.kr/html/site/index.html) 공식 React 패키지 [krds-react](https://www.npmjs.com/package/krds-react) 1.1.1(ISC)을 포팅한 컴포넌트 라이브러리입니다. 이 패키지는 **ESM 전용**이며 CommonJS `require()`는 지원하지 않습니다.

## 설치

::: code-group

```sh [pnpm]
pnpm add @krds.ui/react
```

```sh [npm]
npm install @krds.ui/react
```

```sh [yarn]
yarn add @krds.ui/react
```

:::

## 스타일

애플리케이션 엔트리에서 스타일을 한 번 import합니다. 아이콘은 CSS 안에 data URI로 들어 있어 따로 복사할 자산이 없습니다.

```ts
import '@krds.ui/react/style'
```

TypeScript 6부터 기본으로 켜진 `noUncheckedSideEffectImports`에서도 오류가 나지 않도록 패키지에 빈 타입 선언이 들어 있습니다.

## 컴포넌트 import

```tsx
import { Button, TextInput } from '@krds.ui/react'

export default function ApplyForm() {
  return (
    <>
      <TextInput label="신청인 이름" />
      <Button variant="primary">신청하기</Button>
    </>
  )
}
```

## Next.js App Router

빌드 결과 첫 줄에 `"use client"`가 있어 서버 컴포넌트(`app/page.tsx` 등)에서 바로 import할 수 있습니다. 스타일은 루트 레이아웃에서 import합니다.

```tsx
// app/layout.tsx
import '@krds.ui/react/style'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
```

## 예제 프로젝트

위 설정을 담은 Vite + React + TypeScript 예제가 저장소의 [`examples/vite`](https://github.com/Initializer-org/krds-react/tree/main/examples/vite)에 있습니다.

## 글꼴

krds-react CSS는 글꼴로 Pretendard GOV를 지정하지만 글꼴 파일은 넣지 않습니다. 애플리케이션에서 Pretendard GOV를 불러와야 KRDS와 같은 글꼴로 보입니다.

## 요구사항

- React `>=18.2.0`
- ESM을 지원하는 번들러

## 알려진 문제

원본 krds-react에서 고친 접근성 문제는 저장소 [포팅 기록의 원본과 다른 점](https://github.com/Initializer-org/krds-react/blob/main/PORTING.md#원본과-다른-점), 아직 남은 문제는 [알려진 문제](https://github.com/Initializer-org/krds-react/blob/main/PORTING.md#알려진-문제)에 정리했습니다.
