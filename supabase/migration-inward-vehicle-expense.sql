-- ============================================================================
-- Inward voucher vehicle expense (record-only): one optional amount on the
-- incoming_goods voucher itself. It is a NOTE on the voucher only — it is
-- never posted to finance, Daybook, cash, or any ledger, and no code path
-- in app/actions/inward.ts writes it anywhere except this column.
--
-- Apply AFTER supabase/schema.sql. Idempotent: the ALTER uses
-- IF NOT EXISTS and the CHECK is added only when absent, so the file
-- can be re-run safely.
--
-- MIGRATION SAFETY: until this file is applied live, creating or
-- posting an inward voucher still succeeds — createInwardDraft
-- (app/actions/inward.ts) retries the insert without this column when
-- the database reports it missing, and surfaces the loss as a warning
-- instead of failing the voucher. Reads use SELECT * so a missing
-- column cannot break the register or print view either.
-- ============================================================================

ALTER TABLE public.incoming_goods
  ADD COLUMN IF NOT EXISTS vehicle_expense_pkr NUMERIC(15,2);

-- Empty means "no expense recorded" (NULL); a recorded expense must
-- never be negative — the dialog and the server action reject negatives
-- before they reach the database, and this CHECK is the backstop.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'incoming_goods_vehicle_expense_pkr_nonneg'
  ) THEN
    ALTER TABLE public.incoming_goods
      ADD CONSTRAINT incoming_goods_vehicle_expense_pkr_nonneg
      CHECK (vehicle_expense_pkr IS NULL OR vehicle_expense_pkr >= 0);
  END IF;
END $$;
