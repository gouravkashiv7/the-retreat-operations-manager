-- Migration: Drop legacy guest ID URL columns
-- Date: 2024-04-10

ALTER TABLE public.guests 
DROP COLUMN IF EXISTS "idFrontUrl",
DROP COLUMN IF EXISTS "idBackUrl";
