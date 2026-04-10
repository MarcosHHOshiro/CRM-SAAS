-- Keep this migration safe to run before `init` in the current history order.
-- Structural changes for existing tables were consolidated into `20260408192737_init`.
DO $$
BEGIN
    CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'WON', 'LOST');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
