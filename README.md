🌱 onRoot — Frontend

onRoot 프로젝트의 프론트엔드 레포지토리입니다.

<br/>
- Stack
역할기술빌드ViteUIReact스타일링Tailwind CSS라우팅React Router v6상태 관리Context APIHTTPAxios코드 품질ESLint + Prettier
<br/>
📁 폴더 구조
src/
├── apis/          # axios 인스턴스 및 API 호출 함수
├── assets/        # 이미지, 폰트 등 정적 파일
├── components/    # 재사용 UI 컴포넌트
├── hooks/         # 커스텀 훅
├── pages/         # 라우트별 페이지 컴포넌트
├── store/         # Context 전역 상태
├── styles/        # 전역 스타일 (Tailwind base 등)
└── utils/         # 순수 유틸 함수
<br/>
- 시작 방법
요구 사항

Node.js 18 이상

설치 및 실행
bash# 레포지토리 클론
git clone https://github.com/your-org/onroot-frontend.git
cd onroot-frontend

# 패키지 설치

npm install

# 개발 서버 실행

npm run dev
환경 변수 설정
루트 디렉토리에 .env 파일을 생성하세요.
envVITE_API_BASE_URL=http://localhost:8080

.env 파일은 Git에 올리지 않습니다. 팀원에게 직접 공유하세요.

<br/>
🌿 브랜치 전략 (GitHub Flow)
main
└── feature/기능명       # 기능 개발
└── fix/버그명           # 버그 수정
└── refactor/대상        # 리팩토링
└── chore/작업명         # 설정, 패키지 등 기타 작업
브랜치설명main배포 가능한 안정 브랜치feature/...기능 단위 개발 브랜치
브랜치 네이밍 규칙
feature/login-page
feature/product-card
fix/cart-quantity-bug
refactor/user-context
PR 규칙

main 브랜치로 직접 push ❌
작업 완료 후 PR 생성 → 팀원 1명 이상 코드 리뷰 후 merge ✅
PR 제목은 커밋 컨벤션 형식과 동일하게 작성

<br/>
✍️ 커밋 컨벤션
type: 작업 내용 (한글 또는 영어)
type설명feat새로운 기능 추가fix버그 수정styleUI/스타일 변경 (기능 변화 없음)refactor코드 리팩토링chore설정, 패키지, 기타 작업docs문서 수정
예시
feat: 로그인 페이지 UI 구현
fix: 장바구니 수량 계산 오류 수정
style: 상품 카드 반응형 레이아웃 수정
chore: Prettier 설정 추가
<br/>
💅 코드 컨벤션
Prettier 설정 (.prettierrc)
json{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "printWidth": 80
}
ESLint
프로젝트 루트의 .eslintrc 파일을 기준으로 통일합니다.
VS Code 설정

Prettier - Code formatter 익스텐션 설치
Editor: Default Formatter → Prettier로 설정
Format On Save 활성화

설정 방법: Ctrl + Shift + P → Open User Settings (JSON) → 아래 추가

json{
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
}
<br/>
👥 팀원
이름역할GitHub-Frontend--Frontend-
