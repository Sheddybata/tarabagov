/**
 * Utility functions for Supabase database operations
 */

/**
 * Generate a unique reference ID
 * Format: TS-YYYY-XXXXXX (e.g., TS-2024-001234)
 */
export function generateReferenceId(prefix: string = "TS"): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, "0");
  return `${prefix}-${year}-${random}`;
}

/**
 * Generate reference IDs for different services
 */
export const ReferenceIdPrefixes = {
  REPORT: "TS",
  BIRTH: "BR",
  LAND: "LS",
  SOCIAL: "SS",
  DOCUMENT: "DV",
} as const;

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  supabase: any,
  bucket: string,
  file: File,
  path: string
): Promise<{ data: { path: string } | null; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  return { data, error };
}

/**
 * Get public URL for a file in Supabase Storage
 */
export function getPublicUrl(
  supabase: any,
  bucket: string,
  path: string
): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format datetime for display
 */
export function formatDateTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

