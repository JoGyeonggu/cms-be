# 📘 CMS-ERP Backend

NestJS 기반의 CMS 프로젝트입니다.  
기존 CMS 기능을 중심으로 시작해, 향후 ERP 시스템으로 확장 가능한 구조를 지향합니다.

---

## 🛠️ 기술 스택

- **Backend**: [NestJS](https://nestjs.com/)
- **Frontend**: [Next.js](https://nextjs.org/) (관리자/사용자 분리)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **인증 방식**: JWT + HttpOnly Refresh Token
- **권한 관리**: RBAC (Role, Permission, Menu 기반)

---

## 📁 프로젝트 구조

```
cms-be/
├── src/
│   ├── auth/                # 인증/인가 (JWT, Refresh Token)
│   ├── users/               # 사용자 관리
│   ├── roles/               # 역할 관리
│   ├── permissions/         # 권한 관리
│   ├── menus/               # 메뉴 관리
│   ├── boards/              # 확장형 게시판
│   ├── common/              # 공통 유틸, 데코레이터 등
│   └── main.ts              # 앱 시작점
├── .env                     # 환경 변수
└── README.md
```

---

## 🔐 인증 및 권한 관리

- **Access Token**: JWT (Authorization: Bearer)
- **Refresh Token**: HttpOnly Cookie 기반
- **RBAC 구조**:
  - 사용자 → 역할(Role)
  - 역할 → 권한(Permission)
  - 메뉴(Menu) 기반 접근 제어

---

## 🧩 게시판 구조

- DB 기반 확장형 게시판
- 게시판 구분은 `type` 필드로 관리
- 다양한 게시판 유형 추가 가능
- 관리자 페이지에서 게시판 설정 가능

---

## 🚀 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run start:dev
```

---

## 🧭 향후 개발 계획

- 관리자 페이지: 게시판/사용자/권한 UI 구성
- Next.js 기반 SSR 프론트엔드 구축
- 외부 시스템 연동 및 ERP 기능 점진적 추가

---

## 📂 관련 프로젝트

- [cms-fe (프론트엔드)](https://github.com/JoGyeonggu/cms-fe) ← 추가 예정

---

## 👨‍💻 개발자

- **JoGyeonggu**  
  [GitHub 프로필](https://github.com/JoGyeonggu)

---
