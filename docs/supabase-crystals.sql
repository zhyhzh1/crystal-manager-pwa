create table if not exists public.crystals (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  category text,
  description text,

  price numeric(10, 2) not null default 0,
  stock integer not null default 0,

  image_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint crystals_price_non_negative check (price >= 0),
  constraint crystals_stock_non_negative check (stock >= 0)
);

create index if not exists crystals_name_idx
on public.crystals (name);

create index if not exists crystals_category_idx
on public.crystals (category);

