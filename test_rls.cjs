const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
);

async function test() {
  // We simulate a guest role by signing in, or we can just see if the anon key sees it.
  // Wait, the RLS uses auth.jwt()->'user_metadata'->>'role'. If we don't sign in, it's null, so it defaults to 'guest'.
  // Let's just query with the anon key without signing in. This should evaluate to 'guest' -> DENIED.
  const { data, error } = await supabase
    .from("bookings")
    .select("id, guests(fullName, email)")
    .limit(1);

  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
}

test();
