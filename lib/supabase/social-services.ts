/**
 * Database operations for Social Services
 */

import { createClient } from "./client";
import { generateReferenceId, ReferenceIdPrefixes } from "./utils";

export interface SocialServiceInsert {
  program_type: string;
  applicant_name: string;
  applicant_phone?: string;
  applicant_email?: string;
  nin?: string;
  lga?: string;
  address?: string;
  date_of_birth?: string;
  dependents?: any[];
  documents_urls?: string[];
  reason?: string;
}

/**
 * Submit a new social service enrollment
 */
export async function submitSocialService(data: SocialServiceInsert) {
  const supabase = createClient();
  const referenceId = generateReferenceId(ReferenceIdPrefixes.SOCIAL);

  const { data: enrollment, error } = await supabase
    .from("social_services")
    .insert({
      reference_id: referenceId,
      ...data,
      status: "pending",
    })
    .select()
    .single();

  return { data: enrollment, error };
}

/**
 * Get all social service enrollments (admin only)
 */
export async function getAllSocialServices(filters?: {
  status?: string;
  program_type?: string;
  search?: string;
}) {
  const supabase = createClient();

  let query = supabase.from("social_services").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.program_type) {
    query = query.eq("program_type", filters.program_type);
  }
  if (filters?.search) {
    query = query.or(
      `reference_id.ilike.%${filters.search}%,applicant_name.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  return { data, error };
}

/**
 * Update social service enrollment
 */
export async function updateSocialService(
  id: string,
  updates: { status?: string; notes?: string }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("social_services")
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
 * Add a note to a social service enrollment
 */
export async function addSocialServiceNote(
  enrollmentId: string,
  note: string,
  adminId?: string
) {
  const supabase = createClient();

  const { data: enrollment } = await supabase
    .from("social_services")
    .select("status")
    .eq("id", enrollmentId)
    .single();

  const { data, error } = await supabase
    .from("social_service_notes")
    .insert({
      enrollment_id: enrollmentId,
      author_admin_id: adminId || null,
      note,
      status_at_time: enrollment?.status || null,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all notes for a social service enrollment
 */
export async function getSocialServiceNotes(enrollmentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("social_service_notes")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .order("created_at", { ascending: false });

  return { data, error };
}

