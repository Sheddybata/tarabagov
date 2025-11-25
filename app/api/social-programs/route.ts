import { NextRequest, NextResponse } from "next/server";
import {
  createSocialProgram,
  updateSocialProgram,
  deleteSocialProgram,
  getAllSocialPrograms,
} from "@/lib/supabase/social-programs";

// GET - Get all programs (public, but filtered by active status)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active_only") === "true";
    const useAdmin = searchParams.get("admin") === "true"; // For admin pages

    const { data, error } = await getAllSocialPrograms(activeOnly, useAdmin);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new program (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, description, is_active, requirements, benefits } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and code are required" },
        { status: 400 }
      );
    }

    const { data, error } = await createSocialProgram({
      name,
      code,
      description,
      is_active: is_active ?? true,
      requirements,
      benefits,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a program (admin only)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
    }

    const { data, error } = await updateSocialProgram(id, updates);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a program (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
    }

    const { error } = await deleteSocialProgram(id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

