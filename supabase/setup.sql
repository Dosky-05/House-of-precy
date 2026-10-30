create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('Clothing', 'Bags', 'Shoes')),
  note text not null default '',
  price integer not null check (price > 0),
  image text not null,
  tag text not null default '',
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.products enable row level security;
alter table public.product_admins enable row level security;

create or replace function public.is_product_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.product_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_product_admin() from public, anon;
grant execute on function public.is_product_admin() to authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.product_admins to authenticated;

drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "Product admins can insert products" on public.products;
create policy "Product admins can insert products"
  on public.products for insert
  to authenticated
  with check (public.is_product_admin());

drop policy if exists "Product admins can update products" on public.products;
create policy "Product admins can update products"
  on public.products for update
  to authenticated
  using (public.is_product_admin())
  with check (public.is_product_admin());

drop policy if exists "Product admins can delete products" on public.products;
create policy "Product admins can delete products"
  on public.products for delete
  to authenticated
  using (public.is_product_admin());

drop policy if exists "Admins can view their own admin record" on public.product_admins;
create policy "Admins can view their own admin record"
  on public.product_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

drop policy if exists "Product admins can upload product images" on storage.objects;
create policy "Product admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_product_admin());

drop policy if exists "Product admins can update product images" on storage.objects;
create policy "Product admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_product_admin())
  with check (bucket_id = 'product-images' and public.is_product_admin());

drop policy if exists "Product admins can delete product images" on storage.objects;
create policy "Product admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_product_admin());
