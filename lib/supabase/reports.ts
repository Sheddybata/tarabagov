/**
 * Database operations for Citizen Reports
 */

import { createClient } from "./client";
import { generateReferenceId, ReferenceIdPrefixes } from "./utils";

export interface ReportInsert {
  category: string;
  lga?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  description: string;
  contact_phone?: string;
  contact_email?: string;
  attachment_urls?: string[];
}

export interface ReportUpdate {
  status?: string;
  due_date?: string;
  is_escalated?: boolean;
  updated_at?: string;
}

/**
 * Submit a new citizen report
 */
export async function submitReport(data: ReportInsert) {
  const supabase = createClient();
  const referenceId = generateReferenceId(ReferenceIdPrefixes.REPORT);

  const { data: report, error } = await supabase
    .from("citizen_reports")
    .insert({
      reference_id: referenceId,
      ...data,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting report:", error);
    return { data: null, error };
  }

  return { data: report, error: null };
}

/**
 * Get all reports (admin only)
 */
export async function getAllReports(filters?: {
  status?: string;
  category?: string;
  lga?: string;
  search?: string;
}) {
  const supabase = createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("❌ Not authenticated:", authError);
    return { data: null, error: new Error("Not authenticated. Please log in as admin.") };
  }
  
  console.log("✅ Authenticated user:", user.email);

  let query = supabase.from("citizen_reports").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.lga) {
    query = query.eq("lga", filters.lga);
  }
  if (filters?.search) {
    query = query.or(
      `reference_id.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  return { data, error };
}

/**
 * Get a single report by ID
 */
export async function getReportById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("citizen_reports")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

/**
 * Update report status/workflow
 */
export async function updateReport(id: string, updates: ReportUpdate) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("citizen_reports")
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
 * Add a note to a report
 */
export async function addReportNote(
  reportId: string,
  note: string,
  adminId?: string
) {
  const supabase = createClient();

  // Get current status
  const { data: report } = await getReportById(reportId);

  const { data, error } = await supabase
    .from("report_notes")
    .insert({
      report_id: reportId,
      author_admin_id: adminId || null,
      note,
      status_at_time: report?.status || null,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all notes for a report
 */
export async function getReportNotes(reportId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("report_notes")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: false });

  return { data, error };
}

