/**
 * Database operations for Land Services
 */

import { createClient } from "./client";
import { generateReferenceId, ReferenceIdPrefixes } from "./utils";

export interface LandServiceInsert {
  request_type: string;
  applicant_name: string;
  applicant_email?: string;
  applicant_phone?: string;
  lga?: string;
  plot_number?: string;
  location_description?: string;
  documents_urls?: string[];
  notes?: string;
}

/**
 * Submit a new land service request
 */
export async function submitLandService(data: LandServiceInsert) {
  const supabase = createClient();
  const referenceId = generateReferenceId(ReferenceIdPrefixes.LAND);

  const { data: request, error } = await supabase
    .from("land_services")
    .insert({
      reference_id: referenceId,
      ...data,
      status: "pending",
    })
    .select()
    .single();

  return { data: request, error };
}

/**
 * Get all land service requests (admin only)
 */
export async function getAllLandServices(filters?: {
  status?: string;
  request_type?: string;
  search?: string;
}) {
  const supabase = createClient();

  let query = supabase.from("land_services").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.request_type) {
    query = query.eq("request_type", filters.request_type);
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
 * Update land service request
 */
export async function updateLandService(
  id: string,
  updates: { status?: string; notes?: string; due_date?: string }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("land_services")
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
 * Add a note to a land service request
 */
export async function addLandServiceNote(
  serviceId: string,
  note: string,
  adminId?: string
) {
  const supabase = createClient();

  const { data: service } = await supabase
    .from("land_services")
    .select("status")
    .eq("id", serviceId)
    .single();

  const { data, error } = await supabase
    .from("land_service_notes")
    .insert({
      land_service_id: serviceId,
      author_admin_id: adminId || null,
      note,
      status_at_time: service?.status || null,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all notes for a land service request
 */
export async function getLandServiceNotes(serviceId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("land_service_notes")
    .select("*")
    .eq("land_service_id", serviceId)
    .order("created_at", { ascending: false });

  return { data, error };
}

