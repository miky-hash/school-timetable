# 🗓️ 우리 반 시간표

학급 친구들이 링크만으로 시간표를 보고, 숙제 · 수행평가 · 할 일을 함께 적어두는 웹사이트입니다.

- **보기**: 회원가입 없이 링크만 있으면 누구나
- **고치기**: 반에서 공유하는 비밀번호 하나만 입력하면 됨 (계정 필요 없음)
- **비용**: Vercel + Supabase 무료 플랜으로 충분 (컴퓨터를 켜둘 필요 없음)

## 화면

| 경로         | 내용                                                            |
| ------------ | --------------------------------------------------------------- |
| `/`          | 요일 × 교시 시간표. 칸을 눌러 과목을 넣거나 그 과목의 할 일을 봄 |
| `/tasks`     | 숙제 · 수행평가 · 할 일 목록. 종류/과목별 거르기, 완료 체크      |
| `/subjects`  | 과목 추가 · 수정 · 삭제, 색깔 지정                              |

## 만들기 (처음 한 번만)

### 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 가입 후 새 프로젝트 생성 (무료 플랜)
2. 왼쪽 메뉴 **SQL Editor** 에서 [`supabase/schema.sql`](supabase/schema.sql) 내용을 통째로 붙여넣고 **Run**
3. **Project Settings → API** 에서 아래 두 값을 복사
   - `Project URL` → `SUPABASE_URL`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ `service_role` 키는 DB 를 마음대로 고칠 수 있는 키입니다. 서버에서만 쓰이고 브라우저로는
> 절대 나가지 않지만, 깃허브나 카톡에 붙여넣지 않도록 조심하세요.

### 2. 내 컴퓨터에서 돌려보기

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000
```

`.env.local` 에 넣을 값:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLASS_EDIT_PASSWORD=반친구들과공유할비밀번호
AUTH_SECRET=아무_긴_문자열
```

### 3. 배포하기 (친구들에게 링크 주기)

1. 이 저장소를 깃허브에 올립니다.
2. [vercel.com](https://vercel.com) 에 깃허브로 로그인 → **Add New → Project** → 저장소 선택
3. **Environment Variables** 에 위 4개 값을 그대로 입력
4. **Deploy** → `https://이름.vercel.app` 주소가 나오면 친구들에게 공유

배포한 뒤에는 컴퓨터를 꺼도 사이트는 계속 열려 있습니다.

## 알아두면 좋은 것

- **Supabase 무료 플랜은 7일 동안 아무도 접속하지 않으면 프로젝트가 잠시 멈춥니다.**
  친구들이 며칠에 한 번이라도 들어오면 괜찮고, 멈췄더라도 Supabase 대시보드에서
  버튼 한 번으로 다시 켤 수 있습니다.
- 편집 비밀번호를 바꾸고 싶으면 Vercel 환경변수의 `CLASS_EDIT_PASSWORD` 만 바꾸면 됩니다.
  이미 잠금을 풀어둔 사람들도 자동으로 다시 잠깁니다.
- 교시 수, 요일, 교시별 시간은 [`lib/constants.ts`](lib/constants.ts) 위쪽에서 고칠 수 있습니다.

## 보안이 어떻게 되어 있나요

- 브라우저는 Supabase 에 직접 접속하지 않습니다. 모든 읽기/쓰기는 Next.js 서버를 거칩니다.
- 모든 테이블은 RLS(행 수준 보안)를 켜두고 정책을 만들지 않았습니다.
  즉 서버(`service_role`)를 거치지 않으면 아무도 데이터에 접근할 수 없습니다.
- 편집 비밀번호는 서버에서만 확인하고, 통과하면 서명된 `httpOnly` 쿠키를 90일간 저장합니다.

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase(PostgreSQL)
