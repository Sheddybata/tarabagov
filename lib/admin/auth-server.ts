/**
 * Server-side admin authentication helpers
 * Only use these in server components or API routes
 */

import { createClient } from "@/lib/supabase/server";

/**
 * Get the admin email from environment variables
 */
export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
}

/**
 * Check if the current user is an admin (server-side)
 */
export async function isAdminServer(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) {
    return false;
  }
  
  return user.email === getAdminEmail();
}

/**
 * Get the current admin user (server-side)
 */
export async function getAdminUserServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email || user.email !== getAdminEmail()) {
    return null;
  }
  
  return user;
}

