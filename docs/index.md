---
layout: home
title: KRDS React
titleTemplate: 대한민국 정부 디자인 시스템 React 컴포넌트 라이브러리

hero:
  name: KRDS React
  text: 대한민국 정부 디자인 시스템을 React로
  tagline: KRDS 공식 krds-react 1.1.1을 포팅한 React + TypeScript 컴포넌트 라이브러리
  actions:
    - theme: brand
      text: 시작하기
      link: /guide/getting-started
    - theme: alt
      text: 컴포넌트 보기
      link: /components/
    - theme: alt
      text: GitHub
      link: https://github.com/Initializer-org/krds-react

features:
  - title: 공식 코드 그대로
    details: 공식 krds-react의 원본 저장소가 공개돼 있지 않아, npm에 함께 배포된 source map에서 코드를 복원했습니다. 빌드에 필요한 최소한만 고쳤습니다.
  - title: 접근성 자동 검사
    details: 이 문서의 모든 예제를 실제 브라우저에서 axe-core로 검사합니다. 원본에서 찾은 위반은 알려진 문제로 정리했습니다. 고대비 모드를 지원합니다.
  - title: Next.js App Router
    details: 빌드 결과에 "use client"를 넣어 서버 컴포넌트에서 바로 import할 수 있습니다. TypeScript 타입 정의를 함께 제공합니다.
---

## 컴포넌트 미리보기

공공 서비스 화면을 KRDS React 컴포넌트로 조합한 예시입니다. 직접 입력하고 선택해 보세요. 상단 화면 모드 버튼으로 "선명하게 (어두운 배경)" 모드도 확인할 수 있습니다.

<ReactDemo name="Showcase" />
