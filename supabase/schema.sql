-- 우리 반 시간표 · 할 일 사이트 DB 스키마
-- Supabase 대시보드 > SQL Editor 에 이 파일 내용을 그대로 붙여넣고 실행하세요.

-- ─────────────────────────────────────────────
-- 과목
-- ─────────────────────────────────────────────
create table if not exists public.subjects (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  teacher    text,
  color      text        not null default 'slate',
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 시간표 칸 (요일 1=월 ~ 5=금, 교시 1~N)
-- 한 칸에는 과목 하나만 들어갈 수 있습니다.
-- ─────────────────────────────────────────────
create table if not exists public.timetable_slots (
  id         uuid primary key default gen_random_uuid(),
  day        smallint not null check (day between 1 and 7),
  period     smallint not null check (period between 1 and 12),
  subject_id uuid references public.subjects (id) on delete cascade,
  note       text,
  unique (day, period)
);

-- ─────────────────────────────────────────────
-- 할 일 (숙제 / 수행평가 / 기타 할 일)
-- ─────────────────────────────────────────────
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'homework'
              check (type in ('homework', 'performance', 'todo')),
  subject_id  uuid references public.subjects (id) on delete set null,
  title       text        not null,
  description text,
  due_date    date,
  done        boolean     not null default false,
  created_by  text,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists tasks_done_idx     on public.tasks (done);

-- ─────────────────────────────────────────────
-- 보안
-- 이 사이트는 브라우저에서 DB로 직접 접속하지 않습니다.
-- 모든 읽기/쓰기는 Next.js 서버(service_role 키)를 거치므로
-- RLS 를 켜두고 정책을 만들지 않는 것이 가장 안전합니다.
-- (service_role 키는 RLS 를 우회합니다.)
-- ─────────────────────────────────────────────
alter table public.subjects       enable row level security;
alter table public.timetable_slots enable row level security;
alter table public.tasks          enable row level security;
