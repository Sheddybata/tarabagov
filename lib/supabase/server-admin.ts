/**
 * Server-side Supabase client for API routes
 * Uses service role key to bypass RLS for public form submissions
 * 
 * ⚠️ SECURITY NOTE: Service role key bypasses RLS.
 * Only use in server-side API routes, never expose to client!
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be set");
  }

  if (!serviceRoleKey) {
    // Fallback to anon key if service role not set (for development)
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY not set. Using anon key (may have RLS issues).");
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anonKey) {
      throw new Error("Either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
    }
    return createSupabaseClient(supabaseUrl, anonKey);
  }

  // Use service role key (bypasses RLS)
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

