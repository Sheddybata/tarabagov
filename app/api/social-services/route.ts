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
  console.log("📥 Social services API: Request received");
  
  // Check for Supabase environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("🔴 Social services API: Supabase environment variables are missing.");
    return NextResponse.json(
      { error: "Server configuration error: Supabase not configured", details: "Missing environment variables" },
      { status: 500 }
    );
  }
  
  try {
    const { payload, formData } = await parseRequest(req);
    console.log("📦 Social services API: Payload parsed", { 
      programType: payload?.program_type, 
      hasApplicantName: !!payload?.applicant_name 
    });

    if (!payload?.program_type || !payload?.applicant_name) {
      console.error("🔴 Social services API: Missing required fields.");
      return NextResponse.json(
        { error: "Program type and applicant name are required" },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with service role
    const supabase = createAdminClient();
    console.log("✅ Social services API: Supabase admin client created");
    
    const documentsUrls: string[] = payload.documents_urls || [];

    // Handle file uploads server-side
    if (formData) {
      const documents = formData.getAll("documents");
      console.log(`📎 Social services API: Processing ${documents.length} document(s)`);

      for (const entry of documents) {
        if (isFile(entry) && entry.size > 0) {
          try {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const extension = entry.name.split(".").pop();
            const filename = `${timestamp}-${random}.${extension}`;
            const path = `documents/${filename}`;

            console.log(`📤 Social services API: Uploading file ${filename} to storage...`);

            // Convert File to ArrayBuffer for server-side upload
            const arrayBuffer = await entry.arrayBuffer();
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("social-services")
              .upload(path, arrayBuffer, {
                contentType: entry.type,
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) {
              console.error("🔴 Social services API: Document upload error:", uploadError);
              // Check if bucket doesn't exist
              if (uploadError.message?.includes("does not exist")) {
                return NextResponse.json(
                  { 
                    error: "Storage bucket 'social-services' does not exist. Please create it in Supabase Storage.",
                    details: uploadError.message
                  },
                  { status: 500 }
                );
              }
              continue; // Skip this file but continue with others
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from("social-services")
              .getPublicUrl(uploadData.path);

            if (publicUrl) {
              documentsUrls.push(publicUrl);
              console.log(`✅ Social services API: File uploaded successfully: ${publicUrl}`);
            }
          } catch (uploadErr: any) {
            console.error("🔴 Social services API: Document upload processing error:", uploadErr);
            continue; // Skip this file but continue with others
          }
        }
      }
    }

    // Submit social service enrollment to database
    console.log("💾 Social services API: Inserting into database...");
    const referenceId = generateReferenceId(ReferenceIdPrefixes.SOCIAL);
    const { data, error } = await supabase
      .from("social_services")
      .insert({
        reference_id: referenceId,
        program_type: payload.program_type,
        applicant_name: payload.applicant_name,
        applicant_phone: payload.phone || payload.applicant_phone || null,
        applicant_email: payload.email || payload.applicant_email || null,
        nin: payload.nin || null,
        lga: payload.lga || null,
        address: payload.address || null,
        date_of_birth: payload.date_of_birth || null,
        dependents: payload.dependents || null,
        reason: payload.reason || null,
        documents_urls: documentsUrls.length > 0 ? documentsUrls : null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("🔴 Social services API: Database insert error:", error);
      
      let errorMessage = "Unable to submit social service enrollment";
      if (error.code === "42P01") {
        errorMessage = "Database table 'social_services' does not exist. Please create it in Supabase.";
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
          hint: "Check Supabase Dashboard > Table Editor > social_services table exists and RLS policies allow INSERT"
        },
        { status: 500 }
      );
    }
    
    if (!data) {
      console.error("🔴 Social services API: No data returned from insert");
      return NextResponse.json(
        { error: "Enrollment submitted but no data returned", details: "Check Supabase logs" },
        { status: 500 }
      );
    }
    
    console.log("✅ Social services API: Submission successful!", { referenceId: data.reference_id });

    return NextResponse.json(
      {
        success: true,
        referenceId: data.reference_id,
        enrollment: data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔴 Social services API: Submission error:", error);
    return NextResponse.json(
      { error: "Server error", details: error?.message },
      { status: 500 }
    );
  }
}

