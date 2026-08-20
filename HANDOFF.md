# 인수인계 문서 — 우리 반 시간표

학급 친구들이 링크만으로 시간표를 보고, 숙제·수행평가·할 일을 함께 적는 웹사이트입니다.
**코드는 완성되어 있고, 남은 일은 배포뿐입니다.**

| 항목 | 값 |
| --- | --- |
| 저장소 | `github.com/miky-hash/school-timetable` |
| 작업 브랜치 | `claude/class-schedule-website-plan-j1yvcg` |
| 스택 | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase |
| 배포 대상 | Vercel (무료) + Supabase (무료) |
| 현재 상태 | 기능 구현 완료 · 빌드 통과 · 브라우저 E2E 14항목 통과 · **미배포** |

---

## 1. 지금 상태

### 되어 있는 것

- **시간표 화면** (`/`) — 요일×교시 그리드, 오늘 요일 강조, 칸을 눌러 과목 지정·메모·비우기.
  상단에 마감 임박한 할 일이 가로 스크롤 카드로 표시됨
- **할 일 화면** (`/tasks`) — 숙제/수행평가/할 일 추가·수정·삭제, 마감 임박순 정렬,
  D-day 배지, 종류·과목 필터, 완료 체크, 작성자 이름 기억(localStorage)
- **과목 화면** (`/subjects`) — 과목 추가·수정·삭제, 색상 10종
- **편집 잠금** — 회원가입 없이 반 공용 비밀번호 하나로 해제. 쿠키 90일 유지
- **디자인** — Apple Liquid Glass 스타일(반투명 유리 + 배경 그라데이션), 라이트/다크 모두 대응
- **환경변수 미설정 시** 안내 화면이 뜨고 쓰기 API는 503 반환 (크래시 없음)

### 안 되어 있는 것

- **배포** — Supabase 프로젝트 생성, 스키마 실행, Vercel 배포가 남았습니다 (아래 2번)
- **실제 DB 연동 테스트** — 개발 중에는 인메모리 가짜 DB로 검증했습니다.
  실제 Supabase에 붙여 한 번 확인이 필요합니다
- (선택) 피그마 목업 — 계정 좌석이 View라 진행하지 못했습니다. 사이트와 무관합니다

---

## 2. 남은 작업: 배포

### 2-1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 가입 → **New project** (무료 플랜)
2. 왼쪽 메뉴 **SQL Editor** → `supabase/schema.sql` 내용을 통째로 붙여넣고 **Run**
3. **Project Settings → API** 에서 두 값 복사
   - `Project URL` → `SUPABASE_URL`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ `service_role` 키는 DB를 전부 조작할 수 있는 키입니다.
> 서버에서만 쓰이고 브라우저로는 나가지 않지만, 깃허브·메신저에 붙여넣지 마세요.

### 2-2. 로컬에서 한 번 확인

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000
```

`.env.local`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLASS_EDIT_PASSWORD=반친구들과공유할비밀번호
AUTH_SECRET=아무_긴_문자열
```

확인할 것: 과목 추가 → 시간표 칸에 넣기 → 할 일 추가 → 완료 체크.
이게 되면 DB 연동은 정상입니다.

### 2-3. Vercel 배포

1. 저장소를 깃허브에 올린 상태에서 [vercel.com](https://vercel.com) 깃허브 로그인
2. **Add New → Project** → 저장소 선택
3. **Environment Variables** 에 위 4개 값 입력
4. **Deploy** → `https://이름.vercel.app` 주소를 친구들에게 공유

배포 후에는 컴퓨터를 꺼도 사이트는 계속 열려 있습니다.

---

## 3. 프로젝트 구조

```
app/
  layout.tsx              루트 레이아웃 · 유리 헤더 · 편집 잠금 버튼
  page.tsx                시간표 화면 (서버 컴포넌트)
  tasks/page.tsx          할 일 화면
  subjects/page.tsx       과목 화면
  globals.css             ★ 디자인 시스템 전체 (유리 토큰, 버튼, 입력, 세그먼트)
  api/
    auth/route.ts         POST 로그인 / DELETE 로그아웃
    subjects/route.ts     POST 과목 생성
    subjects/[id]/route.ts   PATCH · DELETE
    tasks/route.ts        POST 할 일 생성
    tasks/[id]/route.ts   PATCH · DELETE
    timetable/route.ts    PUT 칸 저장 (과목·메모 모두 없으면 칸 삭제)

components/
  TimetableBoard.tsx      시간표 그리드 + 칸 편집 모달
  TaskListView.tsx        할 일 목록 + 필터 + 정렬
  TaskForm.tsx            할 일 추가·수정 폼 (둘 다 이 컴포넌트)
  SubjectManager.tsx      과목 목록 + 추가·수정 폼
  UpcomingStrip.tsx       홈 상단 마감 임박 카드
  EditLockButton.tsx      편집 잠금 해제/잠그기
  NavLinks.tsx            캡슐 세그먼티드 내비게이션
  Modal.tsx               공용 모달 (role="dialog")
  SetupNotice.tsx         환경변수 미설정 안내 화면

lib/
  constants.ts            ★ 요일·교시·교시별 시간·과목 색상 (여기만 고치면 됨)
  supabase.ts             service_role 클라이언트 (서버 전용)
  auth.ts                 비밀번호 확인 · HMAC 쿠키 발급/검증
  guard.ts                쓰기 API 공통 가드 (DB 설정 + 편집 권한)
  data.ts                 서버 측 조회 쿼리
  date.ts                 D-day 계산 · 날짜 포맷
  client.ts               클라이언트 fetch 헬퍼
  types.ts                Subject / TimetableSlot / Task 타입

supabase/schema.sql       ★ DB 스키마 (Supabase SQL Editor에 붙여넣기)
```

---

## 4. 데이터 모델

**subjects** — 과목
`id` uuid · `name` text · `teacher` text? · `color` text · `created_at`

**timetable_slots** — 시간표 칸
`id` uuid · `day` 1~7 (1=월) · `period` 1~12 · `subject_id` uuid? · `note` text?
→ `(day, period)` 유니크. 칸 하나에 과목 하나

**tasks** — 할 일
`id` uuid · `type` `homework`|`performance`|`todo` · `subject_id` uuid?
`title` text · `description` text? · `due_date` date? · `done` bool
`created_by` text? · `created_at`

삭제 동작: 과목을 지우면 시간표 칸은 함께 사라지고(`cascade`),
할 일은 "과목 없음"으로 바뀝니다(`set null`).

---

## 5. 왜 이렇게 만들었나 (설계 의도)

인수받는 사람이 뒤집기 전에 알아둬야 할 결정들입니다.

**브라우저가 DB에 직접 접속하지 않습니다.**
모든 읽기·쓰기가 Next.js 서버를 거칩니다. 그래서 모든 테이블에 RLS를 켜두고
정책을 하나도 만들지 않았습니다 — `service_role`은 RLS를 우회하므로 서버만 통과합니다.
결과적으로 정책을 짤 필요 없이 "서버 외에는 아무도 접근 불가"가 보장됩니다.

**편집 권한은 계정이 아니라 공용 비밀번호입니다.**
반 친구 전원에게 회원가입을 시키지 않기 위한 선택입니다.
비밀번호가 맞으면 `HMAC(AUTH_SECRET, CLASS_EDIT_PASSWORD)` 토큰을 httpOnly 쿠키로 90일 저장합니다.
→ `CLASS_EDIT_PASSWORD`를 바꾸면 기존 쿠키가 자동으로 전부 무효가 됩니다.

**날짜 계산은 클라이언트에서 합니다.**
Vercel 서버는 UTC라 서버에서 D-day를 계산하면 한국 시간과 하루가 어긋납니다.
그래서 `useEffect`로 마운트 후 브라우저 시간 기준으로 계산합니다.
이 때문에 D-day 배지가 아주 잠깐 늦게 뜨는데, **의도된 동작입니다.**

**실시간 동기화 대신 `router.refresh()`를 씁니다.**
Supabase Realtime을 쓰면 anon 키를 브라우저에 노출해야 하고 RLS 정책도 짜야 합니다.
학급 규모에서는 저장 후 새로고침으로 충분하다고 판단했습니다.

**시간표 칸에는 blur를 걸지 않았습니다.**
칸이 35개인데 각각 `backdrop-filter`를 걸면 휴대폰에서 버벅입니다.
판 전체에 한 번만 걸고, 칸은 반투명 틴트만 씁니다. 성능 때문이니 유지하세요.

---

## 6. 디자인 시스템

`app/globals.css` 한 파일에 모여 있습니다.

- **토큰** — `--glass-bg`, `--glass-border`, `--glass-highlight`, `--tint`, `--accent`
  라이트/다크를 `prefers-color-scheme`로 각각 정의
- **유리** — `@utility glass` / `@utility glass-strong`
- **컴포넌트 클래스** — `.card` `.btn` `.btn-primary` `.btn-soft` `.input` `.segmented`
- **폴백** — `backdrop-filter` 미지원 브라우저는 불투명 배경으로 자동 전환
- **접근성** — `prefers-reduced-transparency`, `prefers-reduced-motion` 대응

색감을 바꾸고 싶으면 `:root`의 토큰 값과 `body`의 `radial-gradient` 4줄만 만지면 됩니다.

---

## 7. 함정 (미리 알아두기)

**Tailwind v4에서 `@apply`는 커스텀 클래스를 못 받습니다.**
`@layer components`에 정의한 `.glass`를 `@apply glass`로 쓰면 빌드가 깨집니다.
그래서 `@utility glass { }`로 정의했습니다. 유리 관련 클래스를 추가할 때 같은 방식으로 하세요.

**Supabase 무료 플랜은 7일간 요청이 없으면 프로젝트가 일시정지됩니다.**
친구들이 며칠에 한 번이라도 들어오면 괜찮고, 멈추면 대시보드에서 버튼 한 번으로 재개합니다.

**`npm run lint` 스크립트는 없습니다.**
ESLint를 설정하지 않아서 일부러 지웠습니다. 필요하면 직접 추가하세요.

**Tailwind는 소스에 그대로 적힌 클래스만 생성합니다.**
`lib/constants.ts`의 과목 색상이 문자열 조합 없이 전부 나열되어 있는 이유입니다.
`` `bg-${color}-400` `` 같은 식으로 바꾸면 색이 사라집니다.

**과목 색을 추가하려면** `lib/constants.ts`의 `SUBJECT_COLORS`에 `dot`/`chip`/`cell`
세 가지를 모두 적어야 합니다.

---

## 8. 검증 방법 (참고)

개발 중에는 Playwright로 실제 브라우저를 띄워 14개 항목을 확인했습니다:

잠금 상태에서 편집 UI 숨김 · 체크박스 비활성 · 틀린 비밀번호 안내 · 잠금 해제 ·
할 일 추가/수정/삭제/완료 체크 · 필터 · 과목 추가 · 시간표 칸 저장/비우기 · 재잠금

같은 방식으로 검증하려면 `npm run build && npm run start` 후 Playwright로 붙이면 됩니다.

---

## 9. 안 한 것 / 나중에 하면 좋을 것

- **시간표 여러 개** (예: 1학기/2학기, 학급별) — 지금은 시간표 하나 기준입니다
- **알림** — 마감 하루 전 알림 같은 건 없습니다
- **되돌리기** — 삭제하면 바로 사라집니다. 실수 방지는 `confirm` 창뿐입니다
- **누가 고쳤는지 기록** — 할 일에 "적은 사람"만 남고, 수정 이력은 없습니다
- **이미지 첨부** — 수행평가 안내 사진 같은 걸 붙이려면 Supabase Storage 추가 필요

---

## 10. 학교에 맞게 고치기

`lib/constants.ts` 맨 위:

```ts
export const DAYS = [...]        // 요일 (토요일 수업이 있으면 추가)
export const PERIOD_COUNT = 7    // 하루 교시 수
export const PERIOD_TIMES = {...} // 교시별 시작 시간
```

교시 수를 12보다 크게 하려면 `supabase/schema.sql`의
`check (period between 1 and 12)` 도 함께 고쳐야 합니다.
