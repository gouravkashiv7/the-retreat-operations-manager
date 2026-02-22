-- Add icalUrl column to rooms table
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS icalUrl TEXT;

-- Add icalUrl column to cabins table
ALTER TABLE cabins ADD COLUMN IF NOT EXISTS icalUrl TEXT;
