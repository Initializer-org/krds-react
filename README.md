<p align="center">
  <a href="https://react.krds.initializer.org/">
    <img src="./.github/assets/banner.jpg" alt="KRDS React" />
  </a>
</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@krds.ui/react.svg)](https://www.npmjs.com/package/@krds.ui/react)
[![npm downloads](https://img.shields.io/npm/dm/@krds.ui/react.svg)](https://www.npmjs.com/package/@krds.ui/react)
[![CI](https://github.com/Initializer-org/krds-react/actions/workflows/ci.yml/badge.svg)](https://github.com/Initializer-org/krds-react/actions/workflows/ci.yml)
[![types](https://img.shields.io/npm/types/@krds.ui/react.svg)](https://www.npmjs.com/package/@krds.ui/react)
[![react](https://img.shields.io/npm/dependency-version/@krds.ui/react/peer/react.svg)](https://react.dev/)
[![krds-react](https://img.shields.io/badge/krds--react-1.1.1-256ef4.svg)](https://www.npmjs.com/package/krds-react)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)

</div>

<hr />
<div align="center">

<a href="https://react.krds.initializer.org/">문서</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://react.krds.initializer.org/guide/getting-started">시작하기</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://react.krds.initializer.org/components/">컴포넌트</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://www.npmjs.com/package/krds-react">공식 krds-react</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://krds.initializer.org/">KRDS Vue</a>

</div>
<hr />

## KRDS React: 대한민국 정부 디자인 시스템을 React로

[KRDS(대한민국 정부 디자인 시스템)](https://www.krds.go.kr/html/site/index.html) 공식 React 패키지 [`krds-react@1.1.1`](https://www.npmjs.com/package/krds-react)을 포팅한 React + TypeScript 컴포넌트 라이브러리입니다. 공공 웹서비스에서 반복되는 폼, 내비게이션, 레이아웃, 피드백 UI를 제공합니다.

- **공식 krds-react 기반.** 원본의 컴포넌트·props·CSS를 기반으로 접근성과 React 호환성 문제를 수정했습니다. 원본과의 차이는 [포팅 기록](./PORTING.md)에 정리했습니다.
- **접근성 자동 검사.** 문서의 모든 컴포넌트 예제를 실제 브라우저에서 axe-core로 검사합니다. 레이블 연결·접근 가능한 이름·서버 렌더링 ID는 회귀 테스트로 확인합니다.
- **필요한 만큼만.** ESM·Tree-shaking으로 쓰는 컴포넌트만 번들에 포함됩니다. TypeScript 타입 정의와 Next.js App Router를 지원합니다.

## 빠른 시작

```bash
pnpm add @krds.ui/react
```

```tsx
import { Button, TextInput } from '@krds.ui/react'
import '@krds.ui/react/style'

export default function Page() {
  return (
    <>
      <TextInput label="신청인 이름" />
      <Button variant="primary">신청하기</Button>
    </>
  )
}
```

React `>=18.2.0`과 ESM을 지원하는 번들러가 필요합니다(CommonJS `require()`는 지원하지 않음). 개별 import, Next.js App Router, 스타일, 글꼴 설정은 [시작하기](https://react.krds.initializer.org/guide/getting-started)를 참고하세요.

위 설정을 담은 Vite 예제가 [`examples/vite`](./examples/vite)에 있습니다.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Initializer-org/krds-react/tree/main/examples/vite)

## 접근성

라이브러리 차원의 자동 검사는 서비스 전체의 접근성 평가를 대체하지 않습니다. 사용처의 콘텐츠와 화면 구성에 맞춰 별도로 검증해야 합니다.

## 기준 버전과 호환성

공식 `krds-react@1.1.1`(ISC)을 기준으로 합니다. 원본과의 차이와 남아 있는 제약은 [포팅 기록](./PORTING.md)에 있습니다.

`0.1.1`에서 React 18의 Modal 정리 문제와 누락된 컴포넌트·타입 export를 수정했습니다. 변경 내역은 [릴리스](https://github.com/Initializer-org/krds-react/releases)를 참고하세요.

## 기여하기

**버그와 기능 요청**은 [이슈](https://github.com/Initializer-org/krds-react/issues)로 남겨 주세요.

개발 환경과 빌드·테스트 방법은 [CONTRIBUTING](./.github/CONTRIBUTING.md)에 있습니다.

## 라이선스

ISC © [Initializer Team](https://github.com/Initializer-org). 원본 krds-react의 저작권 표시를 [LICENSE](./LICENSE)에 함께 남깁니다.
