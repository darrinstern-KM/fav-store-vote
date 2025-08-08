-- Drop duplicate unique constraint if it exists (keep the column-level UNIQUE -> stores_shop_id_key)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stores_shop_id_unique'
      AND conrelid = 'public.stores'::regclass
  ) THEN
    ALTER TABLE public.stores DROP CONSTRAINT stores_shop_id_unique;
  END IF;
END $$;

-- Drop redundant non-unique index on the same column (covered by the unique index)
DROP INDEX IF EXISTS public.idx_stores_shop_id;

-- Verify there is exactly one unique constraint/index remaining on shop_id
-- (No-op, just for documentation)
-- SELECT indexname, indexdef FROM pg_indexes WHERE schemaname='public' AND tablename='stores';