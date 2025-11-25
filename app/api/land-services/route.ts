import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { submitLandService } from "@/lib/supabase/land-services";

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

    if (!payload?.request_type || !payload?.applicant_name) {
      return NextResponse.json(
        { error: "Request type and applicant name are required" },
        { status: 400 }
      );
    }

    // Create server-side Supabase client with service role
    const supabase = createAdminClient();
    
    const documentsUrls: string[] = payload.documents_urls || [];

    // Handle file uploads server-side
    if (formData) {
      const documents = formData.getAll("documents");

      for (const entry of documents) {
        if (isFile(entry) && entry.size > 0) {
          try {
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const extension = entry.name.split(".").pop();
            const filename = `${timestamp}-${random}.${extension}`;
            const path = `documents/${filename}`;

            // Convert File to ArrayBuffer for server-side upload
            const arrayBuffer = await entry.arrayBuffer();
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("land-services")
              .upload(path, arrayBuffer, {
                contentType: entry.type,
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) {
              console.error("Land service document upload error:", uploadError);
              continue; // Skip this file but continue with others
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from("land-services")
              .getPublicUrl(uploadData.path);

            if (publicUrl) {
              documentsUrls.push(publicUrl);
            }
          } catch (uploadErr: any) {
            console.error("Document upload processing error:", uploadErr);
            continue; // Skip this file but continue with others
          }
        }
      }
    }

    const { data, error } = await submitLandService({
      request_type: payload.request_type,
      applicant_name: payload.applicant_name,
      applicant_phone: payload.phone || payload.applicant_phone,
      applicant_email: payload.email || payload.applicant_email,
      lga: payload.lga,
      plot_number: payload.plot_number,
      location_description: payload.location_description,
      documents_urls: documentsUrls,
    });

    if (error || !data) {
      return NextResponse.json(
        { error: "Unable to submit land service request", details: error?.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        referenceId: data.reference_id,
        request: data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Land service submission error:", error);
    return NextResponse.json(
      { error: "Server error", details: error?.message },
      { status: 500 }
    );
  }
}

