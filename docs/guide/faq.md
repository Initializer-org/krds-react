---
title: KRDS React 자주 묻는 질문
description: 'KRDS React의 공식 패키지와의 차이, 설치 패키지명, React 지원 버전, Next.js 사용법, 스타일과 접근성 검증 범위를 설명합니다.'
---

# KRDS React 자주 묻는 질문

KRDS React는 Initializer Team이 유지보수하는 `@krds.ui/react`입니다. 공식 `krds-react@1.1.1`을 기반으로 접근성과 React 호환성을 보완한 커뮤니티 라이브러리입니다.

## 정부가 배포하는 공식 React 패키지인가요? {#official-package}

아닙니다. 정부 디자인 시스템의 공식 패키지는 [`krds-react`](https://www.npmjs.com/package/krds-react)이며, 이 문서는 [`@krds.ui/react`](https://www.npmjs.com/package/@krds.ui/react)를 설명합니다. 원본과의 차이와 수정 근거는 [포팅 기록](https://github.com/Initializer-org/krds-react/blob/main/PORTING.md)에 정리되어 있습니다.

## krds-react와 @krds.ui/react는 같은 패키지인가요? {#package-names}

서로 다른 npm 패키지입니다. 이 문서에서 사용하는 패키지는 Initializer Team의 [`@krds.ui/react`](https://www.npmjs.com/package/@krds.ui/react)이며 설치 명령은 `npm install @krds.ui/react`입니다. [`krds-react`](https://www.npmjs.com/package/krds-react)는 포팅의 기반이 된 공식 React 패키지입니다. `Initializer-org/krds-react`는 이 프로젝트의 GitHub 저장소 이름입니다. 공식 `krds-react@1.1.1`에서 수정한 접근성·Modal·공개 API 문제는 [개선 사항](/#improvements)과 [포팅 기록](https://github.com/Initializer-org/krds-react/blob/main/PORTING.md)에서 확인하세요.

## Vue·React·Angular 중 어떤 패키지를 선택하나요? {#framework-packages}

Initializer Team의 KRDS 라이브러리는 프레임워크별로 별도 배포됩니다. 프로젝트에 사용하는 프레임워크에 맞는 패키지를 선택하세요.

| 프레임워크 | npm 패키지                                                           | 설치 명령                      | 문서                                                                       |
| ---------- | -------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| Vue        | [`@krds.ui/vue`](https://www.npmjs.com/package/@krds.ui/vue)         | `npm install @krds.ui/vue`     | [KRDS Vue](https://krds.initializer.org/guide/getting-started)             |
| React      | [`@krds.ui/react`](https://www.npmjs.com/package/@krds.ui/react)     | `npm install @krds.ui/react`   | [KRDS React](https://react.krds.initializer.org/guide/getting-started)     |
| Angular    | [`@krds.ui/angular`](https://www.npmjs.com/package/@krds.ui/angular) | `npm install @krds.ui/angular` | [KRDS Angular](https://angular.krds.initializer.org/guide/getting-started) |

세 패키지는 각각의 프레임워크 API를 사용합니다. 설치 이름과 import 경로도 선택한 패키지에 맞춰야 합니다.

## 어떤 패키지를 설치하고 어떤 React 버전을 써야 하나요? {#installation}

`npm install @krds.ui/react` 또는 `pnpm add @krds.ui/react`로 설치합니다. `react`와 `react-dom`은 모두 18.2.0 이상이어야 합니다. 패키지는 ESM 전용이므로 CommonJS `require()`로 불러올 수 없습니다. 전체 설정과 첫 컴포넌트 예제는 [시작하기](/guide/getting-started)에서 확인하세요.

## Next.js App Router에서 사용할 수 있나요? {#nextjs}

사용할 수 있습니다. 라이브러리 빌드에 `"use client"`가 있어 서버 컴포넌트에서 import할 수 있습니다. `onClick` 같은 이벤트 핸들러나 상태를 작성하는 애플리케이션 컴포넌트에는 별도로 `"use client"`를 선언합니다. 전역 스타일은 `app/layout.tsx`에서 `import '@krds.ui/react/style'`로 불러옵니다.

```tsx
'use client'

import { Button } from '@krds.ui/react'

export default function SubmitButton() {
  return <Button onClick={() => window.alert('신청했습니다.')}>신청하기</Button>
}
```

## 컴포넌트에 스타일이나 글꼴이 적용되지 않으면 어떻게 하나요? {#styles}

애플리케이션 엔트리에서 `import '@krds.ui/react/style'`를 한 번 실행했는지 확인하세요. 아이콘은 CSS에 포함되어 있지만 Pretendard GOV 글꼴 파일은 패키지에 포함되지 않으므로 애플리케이션에서 별도로 불러와야 합니다. 자세한 설정은 [스타일 안내](/guide/getting-started#스타일)와 [글꼴 안내](/guide/getting-started#글꼴)를 참고하세요.

## 이 라이브러리를 쓰면 웹 접근성 인증을 받은 것인가요? {#accessibility}

아닙니다. 컴포넌트와 문서 예제의 axe-core 검사 및 회귀 테스트는 구현 오류를 찾는 검사이며 웹 접근성 인증을 대신하지 않습니다. 실제 서비스의 레이블, 키보드 이동, 화면낭독기 흐름과 콘텐츠는 별도로 검증해야 합니다. 검사 구성은 [CI 워크플로](https://github.com/Initializer-org/krds-react/blob/main/.github/workflows/ci.yml)에서 확인할 수 있습니다.

## 라이선스와 버그 제보 경로는 어디인가요? {#license-and-support}

코드는 [ISC 라이선스](https://github.com/Initializer-org/krds-react/blob/main/LICENSE)로 배포됩니다. 버그는 재현 코드와 React 버전을 포함해 [GitHub Issues](https://github.com/Initializer-org/krds-react/issues)에 제보할 수 있습니다. 각 컴포넌트의 props와 예제는 [컴포넌트 목록](/components/)에서 찾을 수 있습니다.
