/**
 * Database operations for Document Verifications
 */

import { createClient } from "./client";
import { generateReferenceId, ReferenceIdPrefixes } from "./utils";

export interface DocumentVerificationInsert {
  document_type: string;
  applicant_name: string;
  phone?: string;
  email?: string;
  document_number: string;
  issuing_authority?: string;
  issue_date?: string;
  attachment_urls?: string[];
}

/**
 * Submit a new document verification request
 */
export async function submitDocumentVerification(
  data: DocumentVerificationInsert
) {
  const supabase = createClient();
  const referenceId = generateReferenceId(ReferenceIdPrefixes.DOCUMENT);

  const { data: verification, error } = await supabase
    .from("document_verifications")
    .insert({
      reference_id: referenceId,
      ...data,
      status: "pending",
    })
    .select()
    .single();

  return { data: verification, error };
}

/**
 * Get all document verifications (admin only)
 */
export async function getAllDocumentVerifications(filters?: {
  status?: string;
  document_type?: string;
  search?: string;
}) {
  const supabase = createClient();

  let query = supabase.from("document_verifications").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.document_type) {
    query = query.eq("document_type", filters.document_type);
  }
  if (filters?.search) {
    query = query.or(
      `reference_id.ilike.%${filters.search}%,applicant_name.ilike.%${filters.search}%,document_number.ilike.%${filters.search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  return { data, error };
}

/**
 * Update document verification status
 */
export async function updateDocumentVerification(
  id: string,
  updates: { status?: string; rejection_reason?: string }
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("document_verifications")
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
 * Add a note to a document verification
 */
export async function addDocumentVerificationNote(
  verificationId: string,
  note: string,
  adminId?: string
) {
  const supabase = createClient();

  const { data: verification } = await supabase
    .from("document_verifications")
    .select("status")
    .eq("id", verificationId)
    .single();

  const { data, error } = await supabase
    .from("document_verification_notes")
    .insert({
      verification_id: verificationId,
      author_admin_id: adminId || null,
      note,
      status_at_time: verification?.status || null,
    })
    .select()
    .single();

  return { data, error };
}

/**
 * Get all notes for a document verification
 */
export async function getDocumentVerificationNotes(verificationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("document_verification_notes")
    .select("*")
    .eq("verification_id", verificationId)
    .order("created_at", { ascending: false });

  return { data, error };
}

