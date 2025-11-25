/**
 * Database operations for Hospitals
 */

import { createClient } from "./client";

export interface HospitalInsert {
  name: string;
  level: string;
  ownership: string;
  lga?: string;
  address?: string;
  phone?: string;
  email?: string;
  bed_capacity?: number;
  icu_beds?: number;
  ambulance_count?: number;
  specialties?: string[];
  status?: string;
  accreditation_status?: string;
  notes?: string;
  last_inspection_date?: string;
  next_inspection_date?: string;
}

/**
 * Get all hospitals (public read, admin manage)
 */
export async function getAllHospitals(filters?: {
  level?: string;
  ownership?: string;
  lga?: string;
  search?: string;
}) {
  const supabase = createClient();

  let query = supabase.from("hospitals").select("*");

  if (filters?.level) {
    query = query.eq("level", filters.level);
  }
  if (filters?.ownership) {
    query = query.eq("ownership", filters.ownership);
  }
  if (filters?.lga) {
    query = query.eq("lga", filters.lga);
  }
  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
    );
  }

  query = query.order("name", { ascending: true });

  const { data, error } = await query;

  return { data, error };
}

/**
 * Create or update a hospital (admin only)
 */
export async function upsertHospital(
  hospital: HospitalInsert & { id?: string }
) {
  const supabase = createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("❌ Not authenticated:", authError);
    return { data: null, error: new Error("Not authenticated. Please log in as admin.") };
  }
  
  console.log("✅ Authenticated user:", user.email);

  const hospitalData = {
    ...hospital,
    updated_at: new Date().toISOString(),
  };

  if (hospital.id) {
    // Update existing
    const { data, error } = await supabase
      .from("hospitals")
      .update(hospitalData)
      .eq("id", hospital.id)
      .select()
      .single();

    return { data, error };
  } else {
    // Insert new
    const { data, error } = await supabase
      .from("hospitals")
      .insert(hospitalData)
      .select()
      .single();

    return { data, error };
  }
}

/**
 * Delete a hospital (admin only)
 */
export async function deleteHospital(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("hospitals").delete().eq("id", id);

  return { error };
}

