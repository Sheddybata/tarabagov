/**
 * Database operations for Birth Registrations
 */

import { createClient } from "./client";
import { generateReferenceId, ReferenceIdPrefixes } from "./utils";

export interface BirthRegistrationInsert {
  child_first_name: string;
  child_middle_name?: string;
  child_last_name: string;
  child_gender: string;
  date_of_birth: string;
  time_of_birth?: string;
  place_of_birth: string;
  hospital_name?: string;
  hospital_address?: string;
  home_address?: string;
  father_first_name: string;
  father_middle_name?: string;
  father_last_name: string;
  father_nationality: string;
  father_occupation?: string;
  mother_first_name: string;
  mother_middle_name?: string;
  mother_last_name: string;
  mother_nationality: string;
  mother_occupation?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_address?: string;
  hospital_notification_url?: string;
  other_documents_urls?: string[];
}

/**
 * Submit a new birth registration
 */
export async function submitBirthRegistration(data: BirthRegistrationInsert) {
  const supabase = createClient();
  const referenceId = generateReferenceId(ReferenceIdPrefixes.BIRTH);

  const { data: registration, error } = await supabase
    .from("birth_registrations")
    .insert({
      reference_id: referenceId,
      ...data,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting birth registration:", error);
    return { data: null, error };
  }

  return { data: registration, error: null };
}

/**
 * Get all birth registrations (admin only)
 */
export async function getAllBirthRegistrations(filters?: {
  status?: string;
  search?: string;
}) {
  const supabase = createClient();

  let query = supabase.from("birth_registrations").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.search) {
    query = query.or(
      `reference_id.ilike.%${filters.search}%,child_first_name.ilike.%${filters.search}%,child_last_name.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  return { data, error };
}

/**
 * Update birth registration status
 */
export async function updateBirthRegistration(
  id: string,
  updates: { status?: string; rejection_reason?: string }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("birth_registrations")
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
 * Add a note to a birth registration
 */
export async function addBirthRegistrationNote(
  registrationId: string,
  note: string,
  adminId?: string
) {
  const supabase = createClient();

  const { data: registration } = await supabase
    .from("birth_registrations")
    .select("status")
    .eq("id", registrationId)
    .single();

  const { data, error } = await supabase
    .from("birth_registration_notes")
    .insert({
      registration_id: registrationId,
      author_admin_id: adminId || null,
      note,
      status_at_time: registration?.status || null,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all notes for a birth registration
 */
export async function getBirthRegistrationNotes(registrationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("birth_registration_notes")
    .select("*")
    .eq("registration_id", registrationId)
    .order("created_at", { ascending: false });

  return { data, error };
}

