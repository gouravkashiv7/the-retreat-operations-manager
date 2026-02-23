-- Add 'cancelled' to the allowed status values for the orders table
-- The existing CHECK constraint only allows up to 'completed', so we need to drop and recreate it.

-- Step 1: Drop the existing status check constraint (find and remove it)
ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

-- Step 2: Re-add with 'cancelled' included
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('ordered', 'accepted', 'preparing', 'delivered', 'completed', 'cancelled'));
