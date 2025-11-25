/**
 * Database operations for Social Programs
 */

import { createClient } from "./client";
import { createAdminClient } from "./server-admin";

export interface SocialProgramInsert {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  requirements?: string;
  benefits?: string;
}

export interface SocialProgram extends SocialProgramInsert {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all social programs (client-side or server-side)
 */
export async function getAllSocialPrograms(activeOnly: boolean = false, useAdmin: boolean = false) {
  const supabase = useAdmin ? createAdminClient() : createClient();

  let query = supabase.from("social_programs").select("*").order("name", { ascending: true });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  return { data, error };
}

/**
 * Get a single social program by ID (client-side)
 */
export async function getSocialProgramById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("social_programs")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

/**
 * Create a new social program (server-side, admin only)
 */
export async function createSocialProgram(program: SocialProgramInsert) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("social_programs")
    .insert({
      ...program,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Update a social program (server-side, admin only)
 */
export async function updateSocialProgram(id: string, updates: Partial<SocialProgramInsert>) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("social_programs")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

/**
 * Delete a social program (server-side, admin only)
 */
export async function deleteSocialProgram(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("social_programs").delete().eq("id", id);

  return { error };
}

