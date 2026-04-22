// Supabase client — hardcoded per user request (Option B).
// URL + publishable anon key — safe to ship in client bundle.
import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://ewqftjamhmfspbvmsezk.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_dpgSiKBU2hSLbpu73lMMBA_zZIx4_lV";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
