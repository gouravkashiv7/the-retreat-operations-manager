-- Migration: Add guestIDCardBack column
-- Date: 2024-04-10

-- Add column to guests table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guests' AND column_name='guestIDCardBack') THEN
        ALTER TABLE public.guests ADD COLUMN "guestIDCardBack" TEXT;
    END IF;
END $$;

-- Update storage policies for 'guest-ids' bucket is not needed as they are path-based and cover all files in the guest folder
