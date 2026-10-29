# 기여하기

버그와 기능 요청은 [이슈](https://github.com/Initializer-org/krds-react/issues)로 남겨 주세요.

## 개발 환경

Node.js `>=22.0.0`과 `package.json`에 지정된 pnpm 버전이 필요합니다.

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

## 문서와 검사

문서 사이트는 KRDS Vue 문서의 VitePress 테마를 그대로 쓰고, React 예제(`docs/components/demos/*.tsx`)를 페이지 안에 마운트합니다. props 표는 컴포넌트 소스의 타입·JSDoc에서 `react-docgen-typescript`로 만듭니다.

문서 예제는 원본의 원래 사용법(id 없이, children 레이블 등) 그대로 쓰고, 접근성 검사에서 제외하는 규칙은 없습니다. axe로 드러나지 않는 부분(이름이 보이는 글자와 같은지, 레이블 클릭, 서버 렌더링 id)은 `src/test/a11y-fixes.test.tsx`에서 확인합니다. 원본 코드에서 걸리는 아래 React Compiler 규칙은 `.oxlintrc.json`에서 경고로 낮췄습니다.

| 규칙                          | 컴포넌트                                              |
| ----------------------------- | ----------------------------------------------------- |
| `react/purity`                | Calendar, DateInput                                   |
| `react/refs`                  | HelpPanel, Tooltip                                    |
| `react/set-state-in-effect`   | Calendar, DateInput, MainMenu, Portal, TextInput      |
| `react/static-components`     | InPageNavigation                                      |
| `react-hooks/exhaustive-deps` | Calendar, ContextualHelp, DateInput, InPageNavigation |
