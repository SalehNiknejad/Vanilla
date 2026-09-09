-- Vanilla Supabase SQL schema
-- Run this in the Supabase SQL editor or apply via Supabase CLI migration.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  phone_number text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_phone_number on public.profiles (phone_number);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.cuisines (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image_url text,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  image_url text,
  prep_time integer not null default 0,
  cook_time integer not null default 0,
  servings integer not null default 1,
  difficulty text not null check (difficulty in ('آسان', 'متوسط', 'سخت')),
  is_public boolean not null default false,
  notes text,
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id),
  amount numeric not null default 0,
  unit text not null default 'عدد',
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_categories (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (recipe_id, category_id)
);

create table if not exists public.recipe_cuisines (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  cuisine_id uuid not null references public.cuisines (id) on delete cascade,
  primary key (recipe_id, cuisine_id)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_tags (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (recipe_id, tag_id)
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

create index if not exists idx_profiles_display_name on public.profiles (display_name);
create index if not exists idx_recipes_user_id on public.recipes (user_id);
create index if not exists idx_recipes_slug on public.recipes (slug);
create index if not exists idx_recipes_public on public.recipes (is_public);
create index if not exists idx_recipes_updated_at on public.recipes (updated_at desc);
create index if not exists idx_recipe_ingredients_recipe_id on public.recipe_ingredients (recipe_id);
create index if not exists idx_recipe_categories_category_id on public.recipe_categories (category_id);
create index if not exists idx_recipe_cuisines_cuisine_id on public.recipe_cuisines (cuisine_id);
create index if not exists idx_recipe_tags_tag_id on public.recipe_tags (tag_id);
create index if not exists idx_favorites_recipe_id on public.favorites (recipe_id);
create index if not exists idx_ingredients_name on public.ingredients (name);
create index if not exists idx_tags_name on public.tags (name);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, phone_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'phone', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'phone', null)
  )
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    phone_number = coalesce(excluded.phone_number, public.profiles.phone_number),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
before update on public.profiles
for each row execute procedure public.update_updated_at_column();

create trigger update_recipes_updated_at
before update on public.recipes
for each row execute procedure public.update_updated_at_column();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.cuisines enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_categories enable row level security;
alter table public.recipe_cuisines enable row level security;
alter table public.tags enable row level security;
alter table public.recipe_tags enable row level security;
alter table public.favorites enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "categories_select_all"
on public.categories
for select
using (true);

create policy "categories_manage_authenticated"
on public.categories
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "cuisines_select_all"
on public.cuisines
for select
using (true);

create policy "cuisines_manage_authenticated"
on public.cuisines
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "ingredients_select_all"
on public.ingredients
for select
using (true);

create policy "ingredients_manage_authenticated"
on public.ingredients
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "recipes_select_public_or_own"
on public.recipes
for select
using (
  is_public = true
  or user_id = auth.uid()
);

create policy "recipes_insert_own"
on public.recipes
for insert
with check (user_id = auth.uid());

create policy "recipes_update_own"
on public.recipes
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "recipes_delete_own"
on public.recipes
for delete
using (user_id = auth.uid());

create policy "recipe_ingredients_select_visible"
on public.recipe_ingredients
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_ingredients.recipe_id
      and (r.is_public = true or r.user_id = auth.uid())
  )
);

create policy "recipe_ingredients_manage_own"
on public.recipe_ingredients
for all
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_ingredients.recipe_id
      and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_ingredients.recipe_id
      and r.user_id = auth.uid()
  )
);

create policy "recipe_categories_select_visible"
on public.recipe_categories
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_categories.recipe_id
      and (r.is_public = true or r.user_id = auth.uid())
  )
);

create policy "recipe_categories_manage_own"
on public.recipe_categories
for all
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_categories.recipe_id
      and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_categories.recipe_id
      and r.user_id = auth.uid()
  )
);

create policy "recipe_cuisines_select_visible"
on public.recipe_cuisines
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_cuisines.recipe_id
      and (r.is_public = true or r.user_id = auth.uid())
  )
);

create policy "recipe_cuisines_manage_own"
on public.recipe_cuisines
for all
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_cuisines.recipe_id
      and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_cuisines.recipe_id
      and r.user_id = auth.uid()
  )
);

create policy "tags_select_all"
on public.tags
for select
using (true);

create policy "tags_manage_authenticated"
on public.tags
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "recipe_tags_select_visible"
on public.recipe_tags
for select
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_tags.recipe_id
      and (r.is_public = true or r.user_id = auth.uid())
  )
);

create policy "recipe_tags_manage_own"
on public.recipe_tags
for all
using (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_tags.recipe_id
      and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.recipes r
    where r.id = recipe_tags.recipe_id
      and r.user_id = auth.uid()
  )
);

create policy "favorites_select_own"
on public.favorites
for select
using (user_id = auth.uid());

create policy "favorites_insert_own"
on public.favorites
for insert
with check (user_id = auth.uid());

create policy "favorites_delete_own"
on public.favorites
for delete
using (user_id = auth.uid());

create policy "favorites_update_own"
on public.favorites
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "storage_recipe_images_select_public"
on storage.objects for select
using (
  bucket_id = 'recipe-images'
  and (coalesce(auth.uid()::text, '') <> '' or true)
);

create policy "storage_recipe_images_insert_auth"
on storage.objects for insert
with check (
  bucket_id = 'recipe-images'
  and auth.role() = 'authenticated'
);

create policy "storage_recipe_images_update_auth"
on storage.objects for update
using (
  bucket_id = 'recipe-images'
  and auth.role() = 'authenticated'
)
with check (
  bucket_id = 'recipe-images'
  and auth.role() = 'authenticated'
);

create policy "storage_recipe_images_delete_auth"
on storage.objects for delete
using (
  bucket_id = 'recipe-images'
  and auth.role() = 'authenticated'
);

create policy "storage_ingredient_images_select_public"
on storage.objects for select
using (bucket_id = 'ingredient-images');

create policy "storage_ingredient_images_manage_auth"
on storage.objects for all
using (bucket_id = 'ingredient-images' and auth.role() = 'authenticated')
with check (bucket_id = 'ingredient-images' and auth.role() = 'authenticated');

create policy "storage_avatars_select_own"
on storage.objects for select
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "storage_avatars_manage_own"
on storage.objects for all
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true),
       ('ingredient-images', 'ingredient-images', true),
       ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into public.categories (name, slug, image_url)
values
  ('صبحانه', 'breakfast', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'),
  ('ناهار', 'lunch', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80'),
  ('شام', 'dinner', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'),
  ('دسر', 'dessert', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'),
  ('کیک', 'cake', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'),
  ('نوشیدنی', 'drink', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'),
  ('میان‌وعده', 'snack', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'),
  ('غذای برنجی', 'rice', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80'),
  ('غذای نونی', 'bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'),
  ('سالاد', 'salad', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80'),
  ('سوپ', 'soup', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80')
on conflict (slug) do nothing;

insert into public.cuisines (name, slug)
values
  ('ایرانی', 'iranian'),
  ('آسیایی', 'asian'),
  ('ایتالیایی', 'italian'),
  ('مکزیکی', 'mexican'),
  ('هندی', 'indian'),
  ('ژاپنی', 'japanese'),
  ('کره‌ای', 'korean'),
  ('فرانسوی', 'french'),
  ('مدیترانه‌ای', 'mediterranean'),
  ('آمریکایی', 'american')
on conflict (slug) do nothing;

insert into public.ingredients (name, image_url, category)
values
  ('مرغ', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80', 'پروتئین'),
  ('گوشت', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80', 'پروتئین'),
  ('تخم مرغ', 'https://images.unsplash.com/photo-1506975094-7f0f06d0c644?auto=format&fit=crop&w=400&q=80', 'پروتئین'),
  ('برنج', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80', 'غلات'),
  ('نان', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', 'غلات'),
  ('سیب‌زمینی', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', 'سبزیجات'),
  ('پیاز', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80', 'سبزیجات'),
  ('گوجه', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80', 'سبزیجات'),
  ('هویج', 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=80', 'سبزیجات'),
  ('پنیر', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80', 'لبنیات'),
  ('شیر', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', 'لبنیات'),
  ('کره', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80', 'لبنیات'),
  ('آرد', 'https://images.unsplash.com/photo-1580983181921-3c1b3f64ec0e?auto=format&fit=crop&w=400&q=80', 'غلات'),
  ('شکر', 'https://images.unsplash.com/photo-1581512163257-7caa20e6d1da?auto=format&fit=crop&w=400&q=80', 'قندی'),
  ('شکلات', 'https://images.unsplash.com/photo-1574182878774-9a1a4193b5c4?auto=format&fit=crop&w=400&q=80', 'قندی')
on conflict (name) do nothing;

insert into public.tags (name, slug)
values
  ('صبحانه', 'breakfast'),
  ('دسر', 'dessert'),
  ('کیک', 'cake'),
  ('برنجی', 'rice-based'),
  ('نونی', 'bread-based'),
  ('سریع', 'quick'),
  ('آسان', 'easy'),
  ('مهمانی', 'party'),
  ('سالم', 'healthy'),
  ('گیاهی', 'vegan')
on conflict (slug) do nothing;
