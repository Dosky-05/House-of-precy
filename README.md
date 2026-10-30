# House of Precy storefront

## Run locally

```sh
npm install
npm run dev
```

The storefront can run from its bundled catalog before Supabase is configured. Product management and saved product changes require a Supabase project.

## Set up product management

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase/setup.sql`, then run `supabase/seed.sql` once to load the existing products.
3. In Supabase Authentication, create the owner's email/password account. Copy that user's UUID from the Users page, then run this in the SQL Editor, replacing the placeholder:

   ```sql
   insert into public.product_admins (user_id)
   values ('OWNER_AUTH_USER_UUID');
   ```

   Only user IDs added to `product_admins` can add, edit, or delete products. There is no public sign-up form.
4. Copy the project URL and the public anon/publishable key from Supabase into a new `.env.local` file:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
   ```

   `.env.local` is ignored by Git. Never put a Supabase service-role key in the website or in a `VITE_` variable.
5. Restart the dev server and open `http://localhost:5173/#admin`. The owner can sign in, add products and photos, change product details and prices, toggle stock status, or delete products.

The SQL setup enables row-level security: visitors can read the catalog and its public product photos, but only authorized product admins can change products or upload photos. Products marked out of stock stay visible but cannot be added to the bag; checkout is blocked if a saved cart contains an item that is no longer available.

## Deploy

Build with `npm run build`. The deployed storefront also needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` present in the environment that runs the build. For GitHub Actions, configure them as repository Actions variables and expose them to the build step. Only the public anon/publishable key belongs in the client; database row-level security protects write access.
