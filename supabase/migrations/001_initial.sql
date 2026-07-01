-- ============================================================
-- SOLDI - Schema inicial do banco de dados
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  role text not null default 'SDR',
  avatar_url text,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- MODULES
-- ============================================================
create table if not exists public.modules (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text not null,
  role text not null default 'SDR',
  order_index integer not null default 0,
  is_locked boolean not null default true,
  icon text not null default 'BookOpen',
  total_lessons integer not null default 0,
  color text not null default '#7DC832'
);

alter table public.modules enable row level security;
create policy "Anyone can view modules" on public.modules for select using (true);

-- ============================================================
-- LESSONS
-- ============================================================
create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid references public.modules on delete cascade not null,
  title text not null,
  content text not null default '',
  lesson_type text not null check (lesson_type in ('theory', 'quiz', 'simulation')) default 'theory',
  order_index integer not null default 0,
  xp_reward integer not null default 30
);

alter table public.lessons enable row level security;
create policy "Anyone can view lessons" on public.lessons for select using (true);

-- ============================================================
-- USER LESSON PROGRESS
-- ============================================================
create table if not exists public.user_lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  lesson_id uuid references public.lessons on delete cascade not null,
  completed boolean not null default false,
  score integer,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

alter table public.user_lesson_progress enable row level security;

create policy "Users can view own lesson progress"
  on public.user_lesson_progress for select using (auth.uid() = user_id);

create policy "Users can insert own lesson progress"
  on public.user_lesson_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own lesson progress"
  on public.user_lesson_progress for update using (auth.uid() = user_id);

-- ============================================================
-- SIMULATIONS
-- ============================================================
create table if not exists public.simulations (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  context text not null,
  lead_name text not null,
  lead_company text not null,
  lead_role text not null,
  channel text not null check (channel in ('cold_call', 'email', 'linkedin', 'whatsapp')) default 'cold_call',
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')) default 'medium'
);

alter table public.simulations enable row level security;
create policy "Anyone can view simulations" on public.simulations for select using (true);

-- ============================================================
-- SIMULATION TURNS
-- ============================================================
create table if not exists public.simulation_turns (
  id uuid primary key default uuid_generate_v4(),
  simulation_id uuid references public.simulations on delete cascade not null,
  turn_index integer not null,
  lead_message text not null,
  options jsonb not null default '[]'
);

alter table public.simulation_turns enable row level security;
create policy "Anyone can view simulation turns" on public.simulation_turns for select using (true);

-- ============================================================
-- USER SIMULATION RESULTS
-- ============================================================
create table if not exists public.user_simulation_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  simulation_id uuid references public.simulations not null,
  total_score integer not null default 0,
  xp_earned integer not null default 0,
  feedback text not null default '',
  answers jsonb not null default '[]',
  completed_at timestamptz not null default now()
);

alter table public.user_simulation_results enable row level security;

create policy "Users can view own simulation results"
  on public.user_simulation_results for select using (auth.uid() = user_id);

create policy "Users can insert own simulation results"
  on public.user_simulation_results for insert with check (auth.uid() = user_id);

-- ============================================================
-- DAILY MISSIONS
-- ============================================================
create table if not exists public.daily_missions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  mission_type text not null,
  target_value integer not null default 1,
  xp_reward integer not null default 75
);

alter table public.daily_missions enable row level security;
create policy "Anyone can view daily missions" on public.daily_missions for select using (true);

-- ============================================================
-- USER DAILY MISSIONS
-- ============================================================
create table if not exists public.user_daily_missions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  mission_id uuid references public.daily_missions not null,
  date date not null default current_date,
  completed boolean not null default false,
  progress integer not null default 0,
  unique(user_id, mission_id, date)
);

alter table public.user_daily_missions enable row level security;

create policy "Users can view own daily missions"
  on public.user_daily_missions for select using (auth.uid() = user_id);

create policy "Users can insert own daily missions"
  on public.user_daily_missions for insert with check (auth.uid() = user_id);

create policy "Users can update own daily missions"
  on public.user_daily_missions for update using (auth.uid() = user_id);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null default '🏆',
  xp_reward integer not null default 100,
  condition_type text not null,
  condition_value integer not null default 1
);

alter table public.achievements enable row level security;
create policy "Anyone can view achievements" on public.achievements for select using (true);

-- ============================================================
-- USER ACHIEVEMENTS
-- ============================================================
create table if not exists public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles on delete cascade not null,
  achievement_id uuid references public.achievements not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "Users can view own achievements"
  on public.user_achievements for select using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on public.user_achievements for insert with check (auth.uid() = user_id);

-- ============================================================
-- RANKING VIEW (public, aggregated)
-- ============================================================
create or replace view public.ranking_view as
select
  p.id,
  p.name,
  p.xp,
  p.level,
  p.streak_days,
  row_number() over (order by p.xp desc) as position
from public.profiles p
order by p.xp desc
limit 100;
