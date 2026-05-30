ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS cod_amount_received numeric NOT NULL DEFAULT 0;