/**
 * Supabase Storage operations for file uploads
 */

import { createClient } from "./client";

const BUCKETS = {
  REPORTS: "reports",
  BIRTH_REGISTRATIONS: "birth-registrations",
  DOCUMENTS: "documents",
  SOCIAL_SERVICES: "social-services",
  LAND_SERVICES: "land-services",
} as const;

/**
 * Upload a file to Supabase Storage
 */
export async function uploadToStorage(
  bucket: keyof typeof BUCKETS,
  file: File,
  folder?: string
): Promise<{ url: string | null; error: any }> {
  const supabase = createClient();
  const bucketName = BUCKETS[bucket];

  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split(".").pop();
  const filename = `${timestamp}-${random}.${extension}`;
  const path = folder ? `${folder}/${filename}` : filename;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    return { url: null, error };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(data.path);

  return { url: publicUrl, error: null };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromStorage(
  bucket: keyof typeof BUCKETS,
  path: string
): Promise<{ error: any }> {
  const supabase = createClient();
  const bucketName = BUCKETS[bucket];

  const { error } = await supabase.storage
    .from(bucketName)
    .remove([path]);

  return { error };
}

