/**
 * Database operations for Schools
 */

import { createClient } from "./client";

export interface SchoolInsert {
  name: string;
  level: string;
  ownership: string;
  lga?: string;
  address?: string;
  student_population?: number;
  teacher_count?: number;
  contact_phone?: string;
  contact_email?: string;
  status?: string;
  accreditation_status?: string;
  notes?: string;
  enrollment_male?: number;
  enrollment_female?: number;
  boarding?: boolean;
}

/**
 * Get all schools (public read, admin manage)
 */
export async function getAllSchools(filters?: {
  level?: string;
  ownership?: string;
  lga?: string;
  search?: string;
}) {
  const supabase = createClient();

  let query = supabase.from("schools").select("*");

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
 * Create or update a school (admin only)
 */
export async function upsertSchool(school: SchoolInsert & { id?: string }) {
  const supabase = createClient();

  if (school.id) {
    // Update existing - only send fields that are provided
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    // Only include fields that are actually provided
    if (school.name !== undefined) updateData.name = school.name;
    if (school.level !== undefined) updateData.level = school.level;
    if (school.ownership !== undefined) updateData.ownership = school.ownership;
    if (school.lga !== undefined) updateData.lga = school.lga;
    if (school.address !== undefined) updateData.address = school.address;
    if (school.student_population !== undefined) updateData.student_population = school.student_population;
    if (school.teacher_count !== undefined) updateData.teacher_count = school.teacher_count;
    if (school.contact_phone !== undefined) updateData.contact_phone = school.contact_phone;
    if (school.contact_email !== undefined) updateData.contact_email = school.contact_email;
    if (school.status !== undefined) updateData.status = school.status;
    if (school.accreditation_status !== undefined) updateData.accreditation_status = school.accreditation_status;
    if (school.notes !== undefined) updateData.notes = school.notes;
    if (school.enrollment_male !== undefined) updateData.enrollment_male = school.enrollment_male;
    if (school.enrollment_female !== undefined) updateData.enrollment_female = school.enrollment_female;
    if (school.boarding !== undefined) updateData.boarding = school.boarding;

    const { data, error } = await supabase
      .from("schools")
      .update(updateData)
      .eq("id", school.id)
      .select()
      .single();

    return { data, error };
  } else {
    // Insert new - all required fields must be present
    const schoolData = {
      ...school,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("schools")
      .insert(schoolData)
      .select()
      .single();

    return { data, error };
  }
}

/**
 * Delete a school (admin only)
 */
export async function deleteSchool(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("schools").delete().eq("id", id);

  return { error };
}

