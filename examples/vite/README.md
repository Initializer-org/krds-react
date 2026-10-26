# KRDS React 예제 (Vite)

[@krds.ui/react](https://github.com/Initializer-org/krds-react)를 Vite + React + TypeScript 프로젝트에서 쓰는 가장 작은 예제입니다. 저장소 README의 빠른 시작(스타일 import, 컴포넌트 import)을 그대로 따릅니다.

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 타입 검사(tsc) 후 빌드
```

화면은 민원 신청 페이지 하나입니다.

- `src/main.tsx`: 스타일 import(`@krds.ui/react/style`)와 앱 마운트
- `src/App.tsx`: 공식 배너·브레드크럼·단계 표시기·텍스트 입력·셀렉트·날짜 입력·라디오·체크박스·버튼, 신청하면 모달로 확인
- `src/App.css`: 화면 배치 (KRDS CSS는 html font-size를 62.5%로 두어 1rem이 10px)
- `pnpm-workspace.yaml`: pnpm으로 설치할 때 '나온 지 하루 안 된 버전 거부' 정책에서 `@krds.ui/react`만 빼, 방금 배포된 버전도 바로 받음

krds-react CSS는 글꼴로 Pretendard GOV를 지정하지만 글꼴 파일은 넣지 않으므로, 같은 글꼴로 보려면 애플리케이션에서 따로 불러와야 합니다.
