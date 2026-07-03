import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server contexts only (e.g. Stripe webhooks).
 * Bypasses Row Level Security — never expose this client or its key to the browser.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
