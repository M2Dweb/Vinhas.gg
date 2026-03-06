-- Vinhas.gg Database Schema for Supabase
-- Run this in the Supabase SQL Editor (todo de uma vez)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ═══════════════════════════════════════
-- STEP 1: Create ALL tables first
-- ═══════════════════════════════════════

-- Profiles (must be first — referenced by other tables)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  username text,
  discord_id text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Products
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  price numeric(10,2) not null default 0,
  stripe_price_id text,
  type text not null default 'one-time' check (type in ('one-time', 'subscription')),
  "interval" text check ("interval" in ('monthly', 'yearly')),
  features jsonb,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  stripe_session_id text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  amount numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- Subscriptions
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  stripe_subscription_id text not null,
  status text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'paused')),
  current_period_end timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc', now()) not null
);

-- ═══════════════════════════════════════
-- STEP 2: Enable RLS on all tables
-- ═══════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.subscriptions enable row level security;

-- ═══════════════════════════════════════
-- STEP 3: Create all policies
-- ═══════════════════════════════════════

-- Profiles policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Profiles are auto-created" on public.profiles
  for insert with check (auth.uid() = id);

-- Categories policies
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

create policy "Only admins can insert categories" on public.categories
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update categories" on public.categories
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete categories" on public.categories
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Products policies
create policy "Active products are viewable by everyone" on public.products
  for select using (active = true or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Only admins can insert products" on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update products" on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete products" on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders policies
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Orders can be inserted by authenticated users" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Only admins can update orders" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Subscriptions policies
create policy "Users can view their own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Subscriptions can be inserted for authenticated users" on public.subscriptions
  for insert with check (auth.uid() = user_id);

create policy "Admins can update subscriptions" on public.subscriptions
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ═══════════════════════════════════════
-- STEP 4: Auto-create profile on signup
-- ═══════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
