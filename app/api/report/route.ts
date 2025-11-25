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
    console.log("📥 Report API: Request received");
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error: Supabase not configured", details: "Missing environment variables" },
        { status: 500 }
      );
    }
    
    const { payload, formData } = await parseRequest(req);
    console.log("📦 Report API: Payload parsed", { category: payload?.category, hasDescription: !!payload?.description });

    if (!payload?.category || !payload?.description) {
      return NextResponse.json(
        { error: "Category and description are required" },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with service role (bypasses RLS)
    console.log("🔌 Report API: Creating Supabase admin client...");
    const supabase = createAdminClient();
    console.log("✅ Report API: Supabase admin client created");
    const attachmentUrls: string[] = [];

    // Handle file upload
    if (formData) {
      const photoEntry = formData.get("photo");

      if (isFile(photoEntry) && photoEntry.size > 0) {
        try {
          const folder = payload?.lga ? payload.lga.toString().toLowerCase().replace(/\s+/g, '-') : "general";
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 15);
          const extension = photoEntry.name.split(".").pop();
          const filename = `${timestamp}-${random}.${extension}`;
          const path = `${folder}/${filename}`;

          // Convert File to ArrayBuffer for server-side upload
          const arrayBuffer = await photoEntry.arrayBuffer();
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("reports")
            .upload(path, arrayBuffer, {
              contentType: photoEntry.type,
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            console.error("Report photo upload error:", uploadError);
            return NextResponse.json(
              { error: "Failed to upload attachment", details: uploadError.message },
              { status: 500 }
            );
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("reports")
            .getPublicUrl(uploadData.path);

          if (publicUrl) {
            attachmentUrls.push(publicUrl);
          }
        } catch (uploadErr: any) {
          console.error("File upload error:", uploadErr);
          return NextResponse.json(
            { error: "Failed to process file upload", details: uploadErr.message },
            { status: 500 }
          );
        }
      }
    }

    // Submit report to database
    console.log("💾 Report API: Inserting into database...");
    const referenceId = generateReferenceId(ReferenceIdPrefixes.REPORT);
    
    const reportData = {
      reference_id: referenceId,
      category: payload.category,
      description: payload.description,
      lga: payload.lga || null,
      location_address: payload.address || null,
      location_lat: payload.location?.lat || null,
      location_lng: payload.location?.lng || null,
      contact_phone: payload.phone || null,
      contact_email: payload.email || null,
      attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : null,
      status: "pending",
    };
    
    console.log("📝 Report API: Data to insert", { referenceId, category: reportData.category, hasAttachments: attachmentUrls.length > 0 });
    
    const { data, error } = await supabase
      .from("citizen_reports")
      .insert(reportData)
      .select()
      .single();

    if (error) {
      console.error("❌ Report API: Database error", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      
      // Provide helpful error messages
      let errorMessage = "Unable to submit report to database";
      if (error.code === "42P01") {
        errorMessage = "Database table 'citizen_reports' does not exist. Please create it in Supabase.";
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
          hint: "Check Supabase Dashboard > Table Editor > citizen_reports table exists and RLS policies allow INSERT"
        },
        { status: 500 }
      );
    }
    
    if (!data) {
      console.error("❌ Report API: No data returned from insert");
      return NextResponse.json(
        { error: "Report submitted but no data returned", details: "Check Supabase logs" },
        { status: 500 }
      );
    }
    
    console.log("✅ Report API: Successfully inserted", { referenceId: data.reference_id });

    return NextResponse.json(
      {
        success: true,
        referenceId: data.reference_id,
        report: data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Report API: Unexpected error", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { 
        error: "Server error", 
        details: error?.message || "An unexpected error occurred",
        hint: "Check server logs for more details"
      },
      { status: 500 }
    );
  }
}

