
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  owner text not null,
  repo text not null,
  repo_url text not null,
  description text,
  stars integer default 0,
  forks integer default 0,
  language text,
  languages jsonb default '{}'::jsonb,
  tech_stack jsonb default '[]'::jsonb,
  summary text,
  beginner_explanation text,
  setup_guide text,
  architecture text,
  folder_explanations jsonb default '[]'::jsonb,
  difficulty_score integer,
  raw jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analyses_owner_repo_idx on public.analyses(owner, repo);
create index analyses_created_at_idx on public.analyses(created_at desc);

alter table public.analyses enable row level security;

create policy "anyone can read analyses"
  on public.analyses for select using (true);
create policy "anyone can create analyses"
  on public.analyses for insert with check (true);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_analysis_idx on public.chat_messages(analysis_id, created_at);

alter table public.chat_messages enable row level security;

create policy "anyone can read chat messages"
  on public.chat_messages for select using (true);
create policy "anyone can create chat messages"
  on public.chat_messages for insert with check (true);
