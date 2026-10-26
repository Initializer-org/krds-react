<p align="center">
  <img src="./.github/assets/banner.jpg" alt="KRDS React" />
</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@krds.ui/react.svg)](https://www.npmjs.com/package/@krds.ui/react)
[![CI](https://github.com/Initializer-org/krds-react/actions/workflows/ci.yml/badge.svg)](https://github.com/Initializer-org/krds-react/actions/workflows/ci.yml)
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

[KRDS(대한민국 정부 디자인 시스템)](https://www.krds.go.kr/html/site/index.html) 공식 React 패키지 [`krds-react@1.1.1`](https://www.npmjs.com/package/krds-react)(ISC)을 포팅한 컴포넌트 라이브러리입니다.

- **공식 krds-react 그대로.** 컴포넌트·props·CSS가 공식 krds-react 1.1.1과 같고, 원본의 접근성 문제를 고쳤습니다. 달라진 점은 아래 [원본과 다른 점](#원본과-다른-점)에 모았습니다.
- **접근성 자동 검사.** 문서 사이트의 모든 예제를 실제 브라우저에서 axe-core로 검사합니다. 문서에 보이는 예제가 곧 검사 대상이며, axe로 드러나지 않는 레이블 연결·이름은 회귀 테스트로 확인합니다.
- **Next.js App Router 지원.** 빌드 결과에 `"use client"`를 넣어 서버 컴포넌트에서 바로 import할 수 있습니다 (Next.js 16 `next build`로 확인).

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

React `>=18.2.0`과 ESM을 지원하는 번들러가 필요합니다(CommonJS `require()`는 지원하지 않음). 컴포넌트별 예제·코드·props는 [문서 사이트](https://react.krds.initializer.org/)에 있습니다. krds-react CSS는 글꼴로 Pretendard GOV를 지정하지만 글꼴 파일은 넣지 않으므로 애플리케이션에서 따로 불러와야 합니다.

위 설정을 담은 Vite 예제가 [`examples/vite`](./examples/vite)에 있습니다.

## 원본과 다른 점

- ESM 전용으로 빌드합니다. 원본의 `main`과 `exports.require`는 배포 파일에 없는 `dist/index.js`를 가리켜 CommonJS에서 불러올 수 없었습니다.
- 빌드 결과 첫 줄에 `"use client"`를 넣었습니다.
- 스타일 경로는 `@krds.ui/react/style`이며, TypeScript 6부터 기본으로 켜진 `noUncheckedSideEffectImports`에서 오류가 나지 않도록 빈 타입 선언(`style.d.ts`)을 함께 둡니다.

**접근성 수정**

- `Checkbox`: children으로 레이블을 쓰면 입력 요소의 이름이 고정 문자열 `'레이블'`이 되던 것(`aria-label={label || '레이블'}`)을 지워, 연결된 레이블이 이름이 됩니다. axe는 이름이 있다고 보고 통과시켜 화면낭독기에서만 드러나던 문제입니다.
- `Checkbox`, `CheckboxChip`, `Select`: `id`를 주지 않으면 레이블이 입력 요소와 연결되지 않던 것(레이블을 눌러도 선택되지 않음)을 `useId`로 자동 id를 만들어 연결합니다.
- `Modal`: 렌더된 `Modal.Title`(`Modal.Header`의 `title` 포함)을 대화상자의 `aria-labelledby`로 연결합니다. 원본은 대화상자에 이름이 없었습니다. 직접 준 `aria-labelledby`가 우선합니다.
- `Tooltip`: 트리거 버튼이 툴팁 내용을 이름(`aria-labelledby`)으로 쓰던 것을 설명(`aria-describedby`)으로 바꾸고 말풍선에 `role="tooltip"`을 붙였습니다. 보이는 글자가 버튼 이름이 됩니다(WCAG 2.5.3). 폼 안에서 제출 버튼이 되지 않도록 `type="button"`도 붙였습니다.
- `LanguageSwitcher`: 트리거 버튼의 `aria-label`(기본값 `'Language'`)이 보이는 현재 언어를 이름에서 빼던 것을, 숨긴 글자로 바꿔 현재 언어가 이름에 들어가게 했습니다.
- `Radio`, `RadioChip`: 렌더할 때마다 `Math.random()`으로 만들던 id를 `useId`로 바꿔 서버 렌더링 결과와 브라우저의 id가 같습니다.

**React**

- `Checkbox`, `CheckboxChip`: 기본값 없이 쓰면 처음 체크할 때 비제어 → 제어 입력 경고가 나던 것을, 기본 체크 상태를 `false`로 두어 고쳤습니다.

## 알려진 문제

원본 krds-react에서 온 문제 중 아직 고치지 않은 것입니다.

**API**

- `TagWrap`(태그 묶음), `HelpPanel` 하위 컴포넌트, `SelectOption`·`StepItem`·`BreadcrumbItem` 같은 props 타입이 패키지 최상위에서 export되지 않아 쓸 수 없습니다. 태그는 `TagWrap`과 같은 마크업(`<div className="krds-tag-wrap">`)을 직접 써야 스타일이 적용됩니다.

**React**

- `Modal`: 콜백 ref가 정리 함수를 반환합니다(React 19 기능). React 18에서는 경고가 나고 정리 함수가 실행되지 않습니다.

## 개발

```bash
pnpm install
pnpm docs:dev    # 문서 사이트 개발 서버 (VitePress, KRDS Vue 문서와 같은 테마)
pnpm test        # 문서 예제 접근성 검사와 회귀 테스트 (vitest 브라우저 모드, Playwright Chromium)
pnpm lint        # oxlint
pnpm format      # oxfmt
pnpm build       # 타입 검사(TypeScript 7)와 라이브러리 빌드
pnpm ssr-smoke   # 빌드 결과의 모든 컴포넌트 서버 렌더링 확인
pnpm docs:build  # 문서 사이트 빌드
```

문서 사이트는 KRDS Vue 문서의 VitePress 테마를 그대로 쓰고, React 예제(`docs/components/demos/*.tsx`)를 페이지 안에 마운트합니다. props 표는 컴포넌트 소스의 타입·JSDoc에서 `react-docgen-typescript`로 만듭니다.

공식 패키지의 원본 저장소가 공개돼 있지 않아, 코드는 npm에 함께 배포된 source map(`sourcesContent`)과 타입 선언(`*.d.ts`)에서 복원했습니다. 스타일(`public/index.css`)과 아이콘(`public/img`)은 배포된 `dist`를 그대로 가져왔습니다(원본 SCSS는 배포되지 않음). 테스트·스토리도 배포되지 않아 문서 예제와 접근성 검사는 새로 작성했습니다. [원본과 다른 점](#원본과-다른-점) 외에 원본 코드에서 고친 곳은 Node 타입 없이 타입 검사되도록 `Modal`의 `NodeJS.Timeout`을 `ReturnType<typeof setTimeout>`으로 바꾼 것과, 구현 없이 선언만 남아 있던 `hooks/use-is-mobile`을 뺀 것입니다.

문서 예제는 원본의 원래 사용법(id 없이, children 레이블 등) 그대로 쓰고, 접근성 검사에서 제외하는 규칙은 없습니다. axe로 드러나지 않는 부분(이름이 보이는 글자와 같은지, 레이블 클릭, 서버 렌더링 id)은 `src/test/a11y-fixes.test.tsx`에서 확인합니다. 원본 코드에서 걸리는 아래 React Compiler 규칙은 `.oxlintrc.json`에서 경고로 낮췄습니다.

| 규칙                          | 컴포넌트                                              |
| ----------------------------- | ----------------------------------------------------- |
| `react/purity`                | Calendar, DateInput                                   |
| `react/refs`                  | HelpPanel, Tooltip                                    |
| `react/set-state-in-effect`   | Calendar, DateInput, MainMenu, Portal, TextInput      |
| `react/static-components`     | InPageNavigation                                      |
| `react-hooks/exhaustive-deps` | Calendar, ContextualHelp, DateInput, InPageNavigation |

## 라이선스

ISC. 원본 krds-react의 저작권 표시를 [LICENSE](./LICENSE)에 함께 남깁니다.
