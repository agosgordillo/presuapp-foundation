ALTER TABLE public.presupuesto_items
  ADD COLUMN IF NOT EXISTS aplica_impuesto boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS impuesto_porcentaje numeric(5,2) NOT NULL DEFAULT 21;