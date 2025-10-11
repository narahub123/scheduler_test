# Frontend 설정 요약

## 기술 스택
- Vite + React 19
- Tailwind CSS 4 + DaisyUI 5
- TypeScript

## Tailwind & DaisyUI 설정
- `src/index.css`는 `@import "tailwindcss";`, `@plugin "daisyui";` 두 줄만 유지해 Tailwind 계층으로 스타일을 관리합니다.
- DaisyUI 컴포넌트는 Tailwind 플러그인으로 자동 적용됩니다.

## 글꼴 설정
- `index.html` 헤더에 Google Fonts 링크를 추가해 나눔고딕을 불러옵니다.
- `tailwind.config.ts`에서 `theme.extend.fontFamily.sans`에 `"Nanum Gothic"`을 앞에 배치해 `font-sans`가 나눔고딕을 기본으로 사용합니다.

## 개발 명령어
- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 번들 생성
- `npm run lint`: ESLint 검사

## 확인 사항
- 새 구성 후 `npm run lint`로 문제없는지 확인했습니다.
- 브라우저에서 나눔고딕 적용 여부를 확인하려면 개발 서버 실행 후 UI를 검사하세요.
