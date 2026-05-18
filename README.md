# FE

> onRoot 프로젝트의 프론트엔드 레포지토리입니다.

<br/>
MVP 실행

```bash
npm install
npm install react-router-dom
npm run dev
```

주요 의존성은 `package.json` 기준으로 설치됩니다. API 통신에는 `axios`를 사용합니다.

`.env` 예시는 `.env.example`을 참고합니다.

```bash
VITE_API_BASE_URL=
VITE_CHAT_API_URL=/api/ai/generate
```

- `/`: onroot 스플래시 화면
- `/main`: onroot 홈 mock 화면
- `/chat`: onruAI 챗봇 화면
- 현재 MVP는 AI 챗봇 API만 실제 연동하고, D-Day/캘린더/루트 추가는 mock UI로 제공합니다.
- 챗봇 API는 일반 JSON 응답을 기준으로 하며, UI에서는 `answer`와 선택적 `studyPlan`을 사용합니다.

<br/>
🛠 Tech Stack
 
| 역할 | 기술 |
|------|------|
| 빌드 | Vite |
| UI | React |
| 스타일링 | CSS |
| 라우팅 | React Router v7 |
| 상태 관리 | Context API |
| HTTP | Axios |
| 코드 품질 | ESLint + Prettier |
 
<br/>
📁 폴더 구조
 
```
src/
├── apis/          # axios 인스턴스 및 API 호출 함수
├── assets/        # 이미지, 폰트 등 정적 파일
├── components/    # 재사용 UI 컴포넌트
│   ├── common/    # 여러 페이지에서 공유되는 공통 컴포넌트
│   ├── layout/    # 화면 레이아웃 컴포넌트
│   ├── main/      # 메인 화면 전용 컴포넌트
│   └── chat/      # 채팅 화면 전용 컴포넌트
├── hooks/         # 커스텀 훅
├── pages/         # 라우트별 페이지 컴포넌트
├── store/         # Context 전역 상태
├── styles/        # 전역 스타일, 디자인 토큰, CSS Module
│   ├── components/# 컴포넌트별 CSS Module
│   └── pages/     # 페이지별 CSS Module
└── utils/         # 순수 유틸 함수
```
 
<br/>
🌿 브랜치 전략 (GitHub Flow)
 
```
main
└── feature/기능명       # 기능 개발
└── fix/버그명           # 버그 수정
└── refactor/대상        # 리팩토링
└── chore/작업명         # 설정, 패키지 등 기타 작업
```
 
| 브랜치 | 설명 |
|--------|------|
| `main` | 배포 가능한 안정 브랜치 |
| `feature/...` | 기능 단위 개발 브랜치 |
 
### 브랜치 네이밍 규칙
 
```
feature/login-page
feature/product-card
fix/cart-quantity-bug
refactor/user-context
```
<br/>
## ✍️ 커밋 컨벤션
 
```
type: 작업 내용 (한글 또는 영어)
```
 
깃모지| type | 설명 |
|----|------|------|
|✨| `feat`| 새로운 기능 추가 |
|🐛| `fix` | 버그 수정 |
|💄| `style`| UI/스타일 변경 (기능 변화 없음) |
|♻️| `refactor`| 코드 리팩토링 |
|🔧| `chore`| 설정, 패키지, 기타 작업 |
|📝| `docs`| 문서 수정 |
 
### 예시
 
```
feat: 로그인 페이지 UI 구현
fix: 장바구니 수량 계산 오류 수정
style: 상품 카드 반응형 레이아웃 수정
chore: Prettier 설정 추가
```
 
<br/>
## 💅 코드 컨벤션
 
### Prettier 설정 (`.prettierrc`)
 
```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "printWidth": 80
}
```
 
### ESLint
 
프로젝트 루트의 `eslint.config.js` 파일을 기준으로 통일합니다.
 
### VS Code 설정
 
1. **Prettier - Code formatter** 익스텐션 설치
2. `Editor: Default Formatter` → Prettier로 설정
3. `Format On Save` 활성화
> 설정 방법: `Ctrl + Shift + P` → `Open User Settings (JSON)` → 아래 추가
 
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```
 
<br/>
## 👥 팀원
 
| 이름 | 역할 | GitHub |
|------|------|--------|
| 최용주 | Frontend | https://github.com/YJEND |
| 윤서희 | Frontend | https://github.com/SeoHeeYoon38 |
