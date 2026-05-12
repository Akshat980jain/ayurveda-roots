DO $$ BEGIN
  CREATE TYPE public.refund_status AS ENUM ('not_applicable','pending','processing','completed','failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS refund_status public.refund_status NOT NULL DEFAULT 'not_applicable',
  ADD COLUMN IF NOT EXISTS refund_updated_at timestamptz;

CREATE OR REPLACE FUNCTION public.handle_order_refund_status()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.status = 'cancelled' AND (OLD.status IS DISTINCT FROM 'cancelled') THEN
    IF lower(coalesce(NEW.payment_method::text,'cod')) = 'cod' THEN
      NEW.refund_status := 'not_applicable';
    ELSE
      NEW.refund_status := 'pending';
    END IF;
    NEW.refund_updated_at := now();
  ELSIF NEW.refund_status IS DISTINCT FROM OLD.refund_status THEN
    NEW.refund_updated_at := now();
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_order_refund_status ON public.orders;
CREATE TRIGGER trg_order_refund_status
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_refund_status();