import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { generateReferenceId, ReferenceIdPrefixes } from "@/lib/supabase/utils";

type ParsedRequest = {
  payload: Record<string, any>;
  formData: FormData | null;
};

async function parseRequest(req: NextRequest): Promise<ParsedRequest> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const payloadRaw = formData.get("payload");
    let payload: Record<string, any> = {};

    if (typeof payloadRaw === "string") {
      payload = JSON.parse(payloadRaw || "{}");
    }

    return { payload, formData };
  }

  const payload = await req.json();
  return { payload, formData: null };
}

function isFile(entry: FormDataEntryValue | null): entry is File {
  return entry instanceof File;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, formData } = await parseRequest(req);

    if (!payload?.child_first_name || !payload?.child_last_name || !payload?.date_of_birth) {
      return NextResponse.json(
        { error: "Child name and date of birth are required" },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with service role
    console.log("🔌 Creating Supabase admin client for birth registration...");
    const supabase = createAdminClient();
    console.log("✅ Supabase admin client created");
    
    // Verify service role key is set
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log("🔑 Service role key configured:", hasServiceRole ? "Yes" : "No (using anon key)");
    
    // List all buckets to verify birth-registrations exists
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error("❌ Error listing buckets:", bucketsError);
      } else {
        console.log("📦 Available buckets:", buckets?.map(b => b.name) || []);
        const birthBucket = buckets?.find(b => b.name === "birth-registrations");
        console.log("🔍 birth-registrations bucket found:", birthBucket ? "Yes" : "No");
        if (!birthBucket) {
          console.error("❌ Bucket 'birth-registrations' not found in bucket list!");
        }
      }
    } catch (listErr) {
      console.error("❌ Error checking buckets:", listErr);
    }
    
    let hospitalNotificationUrl = payload.hospital_notification_url || null;
    const otherDocumentsUrls: string[] = payload.other_documents_urls || [];

    // Handle file uploads server-side
    if (formData) {
      // Upload hospital notification
      const notificationEntry = formData.get("hospitalNotification");

      if (isFile(notificationEntry) && notificationEntry.size > 0) {
        try {
          console.log("📤 Uploading hospital notification to birth-registrations bucket...");
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 15);
          const extension = notificationEntry.name.split(".").pop();
          const filename = `${timestamp}-${random}.${extension}`;
          const path = `notifications/${filename}`;

          console.log("📁 File details:", {
            name: notificationEntry.name,
            size: notificationEntry.size,
            type: notificationEntry.type,
            path: path,
            bucket: "birth-registrations"
          });

          const arrayBuffer = await notificationEntry.arrayBuffer();
          console.log("📦 ArrayBuffer created, size:", arrayBuffer.byteLength);
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("birth-registrations")
            .upload(path, arrayBuffer, {
              contentType: notificationEntry.type,
              cacheControl: "3600",
              upsert: false,
            });
          
          console.log("📤 Upload result:", { 
            data: uploadData ? "Success" : "No data", 
            error: uploadError ? uploadError.message : "None" 
          });

          if (uploadError) {
            console.error("❌ Birth notification upload error:", {
              message: uploadError.message,
              error: uploadError,
            });
            
            // Provide helpful error messages
            let errorMessage = "Failed to upload hospital notification";
            if (uploadError.message?.includes("Bucket not found")) {
              errorMessage = "Storage bucket 'birth-registrations' does not exist. Please create it in Supabase Storage.";
            } else if (uploadError.message?.includes("new row violates row-level security")) {
              errorMessage = "Storage RLS policy is blocking upload. Please check storage bucket policies.";
            } else if (uploadError.message) {
              errorMessage = uploadError.message;
            }
            
            return NextResponse.json(
              { 
                error: errorMessage, 
                details: uploadError.message,
                hint: "Check Supabase Dashboard > Storage > birth-registrations bucket exists and RLS policies allow INSERT"
              },
              { status: 500 }
            );
          }

          const { data: { publicUrl } } = supabase.storage
            .from("birth-registrations")
            .getPublicUrl(uploadData.path);

          hospitalNotificationUrl = publicUrl || hospitalNotificationUrl;
        } catch (uploadErr: any) {
          console.error("File upload error:", uploadErr);
          return NextResponse.json(
            { error: "Failed to process hospital notification file", details: uploadErr.message },
            { status: 500 }
          );
        }
      }

      // Upload other documents
      const otherDocsEntries = formData.getAll("otherDocuments");

      for (const entry of otherDocsEntries) {
        if (isFile(entry) && entry.size > 0) {
          try {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const extension = entry.name.split(".").pop();
            const filename = `${timestamp}-${random}.${extension}`;
            const path = `documents/${filename}`;

            const arrayBuffer = await entry.arrayBuffer();
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("birth-registrations")
              .upload(path, arrayBuffer, {
                contentType: entry.type,
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) {
              console.error("Birth document upload error:", uploadError);
              continue; // Skip this file but continue with others
            }

            const { data: { publicUrl } } = supabase.storage
              .from("birth-registrations")
              .getPublicUrl(uploadData.path);

            if (publicUrl) {
              otherDocumentsUrls.push(publicUrl);
            }
          } catch (uploadErr: any) {
            console.error("Document upload error:", uploadErr);
            continue; // Skip this file but continue with others
          }
        }
      }
    }

    // Submit birth registration to database
    const referenceId = generateReferenceId(ReferenceIdPrefixes.BIRTH);
    const { data, error } = await supabase
      .from("birth_registrations")
      .insert({
        reference_id: referenceId,
        child_first_name: payload.child_first_name,
        child_middle_name: payload.child_middle_name || null,
        child_last_name: payload.child_last_name,
        child_gender: payload.child_gender,
        date_of_birth: payload.date_of_birth,
        time_of_birth: payload.time_of_birth || null,
        place_of_birth: payload.place_of_birth,
        hospital_name: payload.hospital_name || null,
        hospital_address: payload.hospital_address || null,
        home_address: payload.home_address || null,
        father_first_name: payload.father_first_name,
        father_middle_name: payload.father_middle_name || null,
        father_last_name: payload.father_last_name,
        father_nationality: payload.father_nationality,
        father_occupation: payload.father_occupation || null,
        mother_first_name: payload.mother_first_name,
        mother_middle_name: payload.mother_middle_name || null,
        mother_last_name: payload.mother_last_name,
        mother_nationality: payload.mother_nationality,
        mother_occupation: payload.mother_occupation || null,
        contact_phone: payload.contact_phone || null,
        contact_email: payload.contact_email || null,
        hospital_notification_url: hospitalNotificationUrl || null,
        other_documents_urls: otherDocumentsUrls.length > 0 ? otherDocumentsUrls : null,
        status: "pending_review",
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Birth registration database error:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      
      let errorMessage = "Unable to submit birth registration to database";
      if (error.code === "42P01") {
        errorMessage = "Database table 'birth_registrations' does not exist. Please create it in Supabase.";
      } else if (error.code === "42501") {
        errorMessage = "Permission denied. Please check RLS policies in Supabase.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          details: error.message,
          code: error.code,
          hint: "Check Supabase Dashboard > Table Editor > birth_registrations table exists and RLS policies allow INSERT"
        },
        { status: 500 }
      );
    }
    
    if (!data) {
      console.error("❌ Birth registration: No data returned from insert");
      return NextResponse.json(
        { error: "Registration submitted but no data returned", details: "Check Supabase logs" },
        { status: 500 }
      );
    }
    
    console.log("✅ Birth registration successfully inserted:", data.reference_id);

    return NextResponse.json(
      {
        success: true,
        referenceId: data.reference_id,
        registration: data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Birth registration submission error:", error);
    return NextResponse.json(
      { error: "Server error", details: error?.message },
      { status: 500 }
    );
  }
}

