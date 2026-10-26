<p align="center">
  <img src="./.github/assets/banner.jpg" alt="KRDS React" />
</p>

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)
[![react](https://img.shields.io/badge/react-%3E%3D18.2.0-256ef4.svg)](https://react.dev/)
[![types](https://img.shields.io/badge/types-TypeScript-256ef4.svg)](https://www.typescriptlang.org/)
[![krds-react](https://img.shields.io/badge/krds--react-1.1.1-256ef4.svg)](https://www.npmjs.com/package/krds-react)

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
<a href="https://www.krds.go.kr/storybook/react">공식 Storybook</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://krds.initializer.org/">KRDS Vue</a>

</div>
<hr />

## KRDS React: 대한민국 정부 디자인 시스템을 React로

[KRDS(대한민국 정부 디자인 시스템)](https://www.krds.go.kr/html/site/index.html) 공식 React 패키지 [`krds-react@1.1.1`](https://www.npmjs.com/package/krds-react)(ISC)을 포팅한 컴포넌트 라이브러리입니다. 아직 npm에 배포하지 않았습니다.

- **공식 krds-react 그대로.** 컴포넌트·props·마크업·CSS가 공식 krds-react 1.1.1과 같습니다. 달라진 점은 아래 [원본과 다른 점](#원본과-다른-점)에 모았습니다.
- **접근성 자동 검사.** 문서 사이트의 모든 예제를 실제 브라우저에서 axe-core로 검사합니다. 문서에 보이는 예제가 곧 검사 대상입니다. 원본에서 찾은 문제는 아래 [알려진 문제](#알려진-문제)에 정리했습니다.
- **Next.js App Router 지원.** 빌드 결과에 `"use client"`를 넣어 서버 컴포넌트에서 바로 import할 수 있습니다 (Next.js 16 `next build`로 확인).

## 빠른 시작

아직 배포 전이라 저장소에서 빌드해 씁니다.

```bash
pnpm install
pnpm build
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

React `>=18.2.0`과 ESM을 지원하는 번들러가 필요합니다(CommonJS `require()`는 지원하지 않음). 컴포넌트별 예제·코드·props는 [문서 사이트](https://react.krds.initializer.org/)에 있습니다. krds-react CSS는 글꼴로 Pretendard GOV를 지정하지만 글꼴 파일은 넣지 않으므로 애플리케이션에서 따로 불러와야 합니다.

위 설정을 담은 Vite 예제가 [`examples/vite`](./examples/vite)에 있습니다.

## 원본과 다른 점

- ESM 전용으로 빌드합니다. 원본의 `main`과 `exports.require`는 배포 파일에 없는 `dist/index.js`를 가리켜 CommonJS에서 불러올 수 없었습니다.
- 빌드 결과 첫 줄에 `"use client"`를 넣었습니다.
- 스타일 경로는 `@krds.ui/react/style`이며, TypeScript 6부터 기본으로 켜진 `noUncheckedSideEffectImports`에서 오류가 나지 않도록 빈 타입 선언(`style.d.ts`)을 함께 둡니다.

## 알려진 문제

원본 krds-react에서 온 문제입니다. 원본 동작을 그대로 두기 위해 고치지 않았습니다.

**접근성**

- `Checkbox`: children으로 레이블을 쓰면 입력 요소의 이름이 고정 문자열 `'레이블'`이 됩니다(`aria-label={label || '레이블'}`). axe는 이름이 있다고 보고 통과시키므로 화면낭독기에서만 드러납니다. `label` prop과 `id`를 함께 주면 피할 수 있습니다.
- `Checkbox`, `CheckboxChip`, `Select`: `<label htmlFor={id}>`가 넘겨받은 `id`에만 의존해, `id`를 주지 않으면 레이블이 입력 요소와 연결되지 않습니다(레이블을 눌러도 선택되지 않음, axe `label`·`select-name`). `TextInput`·`Textarea`·`Radio`는 연결됩니다.
- `Modal`: 대화상자에 `aria-labelledby`가 없어 `Modal.Title`이 대화상자의 이름이 되지 않습니다(axe `aria-dialog-name`). `Modal.Content`에 `aria-labelledby`, `Modal.Title`에 같은 `id`를 주면 피할 수 있습니다.
- `Tooltip`: 트리거 버튼의 `aria-labelledby`가 툴팁 내용을 가리켜, 보이는 글자 대신 툴팁 설명이 버튼 이름이 됩니다(axe `label-content-name-mismatch`, WCAG 2.5.3).
- `LanguageSwitcher`: 트리거 버튼에 `aria-label`(기본값 `'Language'`)이 붙어, 보이는 현재 언어(예: 한국어) 대신 그 값이 버튼 이름이 됩니다(axe `label-content-name-mismatch`).

**API**

- `TagWrap`(태그 묶음), `HelpPanel` 하위 컴포넌트, `SelectOption`·`StepItem`·`BreadcrumbItem` 같은 props 타입이 패키지 최상위에서 export되지 않아 쓸 수 없습니다. 태그는 `TagWrap`과 같은 마크업(`<div className="krds-tag-wrap">`)을 직접 써야 스타일이 적용됩니다.

**React**

- `Modal`: 콜백 ref가 정리 함수를 반환합니다(React 19 기능). React 18에서는 경고가 나고 정리 함수가 실행되지 않습니다.
- `Radio`: 렌더할 때마다 `Math.random()`으로 id를 만들어 서버 렌더링 결과와 브라우저의 id가 달라질 수 있습니다.

## 개발

```bash
pnpm install
pnpm docs:dev    # 문서 사이트 개발 서버 (VitePress, KRDS Vue 문서와 같은 테마)
pnpm test        # 문서 예제를 vitest 브라우저 모드(Playwright Chromium)에서 접근성 검사
pnpm lint        # oxlint
pnpm format      # oxfmt
pnpm build       # 타입 검사(TypeScript 7)와 라이브러리 빌드
pnpm ssr-smoke   # 빌드 결과의 모든 컴포넌트 서버 렌더링 확인
pnpm docs:build  # 문서 사이트 빌드
```

문서 사이트는 KRDS Vue 문서의 VitePress 테마를 그대로 쓰고, React 예제(`docs/components/demos/*.tsx`)를 페이지 안에 마운트합니다. props 표는 컴포넌트 소스의 타입·JSDoc에서 `react-docgen-typescript`로 만듭니다.

공식 패키지의 원본 저장소가 공개돼 있지 않아, 코드는 npm에 함께 배포된 source map(`sourcesContent`)과 타입 선언(`*.d.ts`)에서 복원했습니다. 스타일(`public/index.css`)과 아이콘(`public/img`)은 배포된 `dist`를 그대로 가져왔습니다(원본 SCSS는 배포되지 않음). 테스트·스토리도 배포되지 않아 문서 예제와 접근성 검사는 새로 작성했습니다. 원본 코드에서 고친 곳은 Node 타입 없이 타입 검사되도록 `Modal`의 `NodeJS.Timeout`을 `ReturnType<typeof setTimeout>`으로 바꾼 것과, 구현 없이 선언만 남아 있던 `hooks/use-is-mobile`을 뺀 것입니다.

문서 예제는 [알려진 문제](#알려진-문제)를 피해 가는 사용법으로 씁니다. 피할 수 없는 `Tooltip`·`LanguageSwitcher`의 `label-content-name-mismatch`만 접근성 검사에서 제외합니다. 원본 코드에서 걸리는 아래 React Compiler 규칙은 `.oxlintrc.json`에서 경고로 낮췄습니다.

| 규칙                          | 컴포넌트                                              |
| ----------------------------- | ----------------------------------------------------- |
| `react/purity`                | Calendar, DateInput, Radio                            |
| `react/refs`                  | HelpPanel, Tooltip                                    |
| `react/set-state-in-effect`   | Calendar, DateInput, MainMenu, Portal, TextInput      |
| `react/static-components`     | InPageNavigation                                      |
| `react-hooks/exhaustive-deps` | Calendar, ContextualHelp, DateInput, InPageNavigation |

## 라이선스

ISC. 원본 krds-react의 저작권 표시를 [LICENSE](./LICENSE)에 함께 남깁니다.
