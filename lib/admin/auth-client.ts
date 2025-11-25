/**
 * Client-side admin authentication helpers
 * Only use these in client components
 */

import { createClient } from "@/lib/supabase/client";

/**
 * Get the admin email from environment variables
 */
export function getAdminEmail(): string {
  return process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
}

/**
 * Check if the current user is an admin (client-side)
 */
export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) {
    return false;
  }
  
  return user.email === getAdminEmail();
}

/**
 * Get the current admin user (client-side)
 */
export async function getAdminUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email || user.email !== getAdminEmail()) {
    return null;
  }
  
  return user;
}

