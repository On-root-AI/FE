# FE

> onRoot 프로젝트의 프론트엔드 레포지토리입니다.

<br/>
🛠 Tech Stack
 
| 역할 | 기술 |
|------|------|
| 빌드 | Vite |
| UI | React |
| 스타일링 | Tailwind CSS |
| 라우팅 | React Router v6 |
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
├── hooks/         # 커스텀 훅
├── pages/         # 라우트별 페이지 컴포넌트
├── store/         # Context 전역 상태
├── styles/        # 전역 스타일 (Tailwind base 등)
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
 
프로젝트 루트의 `.eslintrc` 파일을 기준으로 통일합니다.
 
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
