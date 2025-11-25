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
  console.log("📥 Document verification API: Request received");
  
  // Check for Supabase environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("🔴 Document verification API: Supabase environment variables are missing.");
    return NextResponse.json(
      { error: "Server configuration error: Supabase not configured", details: "Missing environment variables" },
      { status: 500 }
    );
  }
  
  try {
    const { payload, formData } = await parseRequest(req);
    console.log("📦 Document verification API: Payload parsed", { 
      documentType: payload?.document_type, 
      hasApplicantName: !!payload?.applicant_name 
    });

    if (!payload?.document_type || !payload?.document_number || !payload?.applicant_name) {
      console.error("🔴 Document verification API: Missing required fields.");
      return NextResponse.json(
        { error: "Document type, number, and applicant name are required" },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with service role
    const supabase = createAdminClient();
    console.log("✅ Document verification API: Supabase admin client created");
    
    const attachmentUrls: string[] = payload.attachment_urls || [];

    // Handle file uploads server-side
    if (formData) {
      const attachments = formData.getAll("attachments");

      for (const entry of attachments) {
        if (isFile(entry) && entry.size > 0) {
          try {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const extension = entry.name.split(".").pop();
            const filename = `${timestamp}-${random}.${extension}`;
            const path = `verifications/${filename}`;

            // Convert File to ArrayBuffer for server-side upload
            const arrayBuffer = await entry.arrayBuffer();
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("documents")
              .upload(path, arrayBuffer, {
                contentType: entry.type,
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) {
              console.error("Document verification upload error:", uploadError);
              continue; // Skip this file but continue with others
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from("documents")
              .getPublicUrl(uploadData.path);

            if (publicUrl) {
              attachmentUrls.push(publicUrl);
            }
          } catch (uploadErr: any) {
            console.error("Attachment upload processing error:", uploadErr);
            continue; // Skip this file but continue with others
          }
        }
      }
    }

    // Submit document verification to database
    console.log("💾 Document verification API: Inserting into database...");
    const referenceId = generateReferenceId(ReferenceIdPrefixes.DOCUMENT);
    const { data, error } = await supabase
      .from("document_verifications")
      .insert({
        reference_id: referenceId,
        document_type: payload.document_type,
        applicant_name: payload.applicant_name,
        document_number: payload.document_number,
        phone: payload.phone || null,
        email: payload.email || null,
        issuing_authority: payload.issuing_authority || null,
        issue_date: payload.issue_date || null,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : null,
        status: "pending",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("🔴 Document verification API: Database insert error:", error);
      return NextResponse.json(
        { 
          error: "Unable to submit document verification", 
          details: error?.message,
          code: error?.code,
          hint: error?.hint,
        },
        { status: 500 }
      );
    }

    console.log("🎉 Document verification API: Verification submitted successfully with reference ID:", data.reference_id);
    return NextResponse.json(
      {
        success: true,
        referenceId: data.reference_id,
        verification: data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Document verification submission error:", error);
    return NextResponse.json(
      { error: "Server error", details: error?.message },
      { status: 500 }
    );
  }
}

