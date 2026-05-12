# Backend

Mirror of all backend code used by the app.

- `migrations/` — SQL migration files (schema, RLS policies, functions, triggers)
- `server-functions/` — TanStack Start server functions and server-only Supabase client (this app uses TanStack server functions instead of Supabase Edge Functions)
- `config.toml` — Supabase project config

Source of truth still lives at `supabase/migrations/` and `src/**/*.functions.ts` / `*.server.ts`.
