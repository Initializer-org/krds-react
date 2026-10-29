# 포팅 기록

공식 `krds-react@1.1.1`을 기준으로 한 변경 사항과 알려진 문제입니다.

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

## 0.1.1에서 수정한 호환성과 export

- `Modal`: React 18에서도 observer·animation frame·포커스 타이머가 정리되도록 ref 콜백의 작업을 effect로 옮겼습니다. 열린 모달을 unmount해도 배경의 `inert`·스크롤 잠금·포커스를 복원합니다.
- `TagWrap`, `BadgeWrapper`, `TextListItem`, `CriticalAlerts`와 HelpPanel 하위 컴포넌트를 패키지 최상위에서 export합니다.
- `SelectOption`, `StepItem`, `BreadcrumbItem`, `TextInputProps` 등 컴포넌트 모듈에 이미 있던 공개 타입을 패키지 최상위에서도 가져올 수 있습니다.

## 원본 코드와 자산

공식 패키지의 원본 저장소가 공개돼 있지 않아, 코드는 npm에 함께 배포된 source map(`sourcesContent`)과 타입 선언(`*.d.ts`)에서 복원했습니다. 스타일(`public/index.css`)과 아이콘(`public/img`)은 배포된 `dist`를 그대로 가져왔습니다(원본 SCSS는 배포되지 않음). 테스트·스토리도 배포되지 않아 문서 예제와 접근성 검사는 새로 작성했습니다. [원본과 다른 점](#원본과-다른-점) 외에 원본 코드에서 고친 곳은 Node 타입 없이 타입 검사되도록 `Modal`의 `NodeJS.Timeout`을 `ReturnType<typeof setTimeout>`으로 바꾼 것과, 구현 없이 선언만 남아 있던 `hooks/use-is-mobile`을 뺀 것입니다.
