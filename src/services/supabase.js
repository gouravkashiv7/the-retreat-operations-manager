import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kckngulhvwryekywvutn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtja25ndWxodndyeWVreXd2dXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTI0MjQsImV4cCI6MjA3NTc2ODQyNH0.OFHoYsWTix05-0nNil2FfQi5KhB0f1mqBXz0hobyP8o";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
