---
layout: home
title: KRDS React (@krds.ui/react)
titleTemplate: 대한민국 정부 디자인 시스템 React 컴포넌트 라이브러리
description: 'Initializer Team의 @krds.ui/react 문서입니다. 공식 krds-react 기반의 접근성·React 호환성 개선, React 18.2 이상 설치, Next.js 연결과 컴포넌트 API를 안내합니다.'

hero:
  name: KRDS React
  text: KRDS에 접근성과 React 호환성을 더하다
  tagline: 공식 krds-react 1.1.1을 기반으로 접근성 오류와 React 18 호환성 문제를 고치고, Next.js 연결과 공개 API를 보완했습니다.
  actions:
    - theme: brand
      text: 시작하기
      link: /guide/getting-started
    - theme: alt
      text: 컴포넌트 보기
      link: /components/
    - theme: alt
      text: 개선한 점
      link: /#improvements

features:
  - title: 원본의 접근성 오류 수정
    details: 체크박스·셀렉트의 레이블 연결, 모달 제목, 툴팁 설명을 바로잡았습니다. 문서 예제의 axe-core 검사와 회귀 테스트로 수정 사항을 확인합니다.
  - title: React 18·19 동작 검증
    details: 원본 Modal의 React 18 경고와 정리 누락을 수정했습니다. 닫기와 화면 전환 뒤 포커스·스크롤 복원을 두 버전에서 검증했습니다.
  - title: Next.js·TypeScript 연결 보완
    details: Next.js App Router용 "use client", CSS import 타입 선언, 누락된 하위 컴포넌트와 props 타입 export를 제공합니다.
---

## KRDS React는 무엇인가요? {#about}

KRDS React(`@krds.ui/react`)는 Initializer Team이 공식 `krds-react@1.1.1`을 기반으로 접근성과 React 호환성을 보완한 커뮤니티 라이브러리입니다. 정부가 배포하는 공식 패키지와는 별도로 유지보수합니다. React·React DOM 18.2.0 이상과 ESM 환경에서 사용할 수 있으며 ISC 라이선스로 배포됩니다.

```sh
npm install @krds.ui/react
```

[npm: @krds.ui/react](https://www.npmjs.com/package/@krds.ui/react) · [소스: Initializer-org/krds-react](https://github.com/Initializer-org/krds-react) · [패키지 이름 구분하기](/guide/faq#package-names)

[설치와 Next.js 설정](/guide/getting-started), [컴포넌트별 예제와 API](/components/), [자주 묻는 질문](/guide/faq)에서 적용 방법을 확인하세요.

## 공식 패키지에서 개선한 점 {#improvements}

공식 `krds-react@1.1.1`을 기준으로 직접 수정하고 검증한 내용입니다.

| 사용 중 겪을 수 있는 문제                                              | @krds.ui/react의 개선                                                                                             |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 레이블이 입력 요소와 연결되지 않거나 화면낭독기에 잘못된 이름이 전달됨 | 체크박스·셀렉트의 자동 ID와 레이블 연결, 모달 제목, 툴팁 설명을 수정했습니다.                                     |
| React 18에서 Modal 경고가 발생하고 정리 작업이 누락됨                  | 닫기·화면 전환 시 observer와 타이머를 해제하고 포커스·배경 스크롤을 복원합니다. React 18.2와 19에서 검증했습니다. |
| 서버 렌더링과 브라우저의 라디오 ID가 달라짐                            | 임의의 숫자 대신 `useId`를 사용해 서버·브라우저 ID를 맞췄습니다.                                                  |
| 구현된 하위 컴포넌트와 타입을 패키지에서 가져올 수 없음                | `TagWrap`, HelpPanel 하위 컴포넌트, `SelectOption`, `StepItem` 등 누락된 export를 보완했습니다.                   |

Next.js App Router에서 불러올 수 있도록 빌드에 `"use client"`를 선언하고, TypeScript의 CSS import 검사에 필요한 타입 선언도 제공합니다. 문서 예제의 axe-core 검사와 회귀 테스트를 CI에서 실행해 수정한 동작을 계속 확인합니다.

[포팅 기록](https://github.com/Initializer-org/krds-react/blob/main/PORTING.md)에서 코드 수준의 차이와 원본 출처를 확인할 수 있습니다.

[플레이그라운드](/playground)에서 공공서비스 화면으로 조합한 컴포넌트를 직접 사용해 보세요.

## 컴포넌트 미리보기

공공 서비스 화면을 KRDS React 컴포넌트로 조합한 예시입니다. 직접 입력하고 선택해 보세요. 상단 화면 모드 버튼으로 "선명하게 (어두운 배경)" 모드도 확인할 수 있습니다.

<ReactDemo name="Showcase" />
