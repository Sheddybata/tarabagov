/**
 * API Route to seed initial data into Supabase
 * POST /api/seed
 * 
 * This endpoint seeds:
 * - Schools (universities, colleges, polytechnics, secondary schools)
 * - Hospitals (healthcare facilities)
 * - MDAs (Ministries, Departments, Agencies)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminEmail } from "@/lib/admin/auth-server";
import { seedSchools, seedHospitals, seedMDAs, seedSocialPrograms } from "@/lib/seed/data";

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminEmail = getAdminEmail();
    if (!adminEmail || user.email !== adminEmail) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const results = {
      schools: { inserted: 0, errors: [] as string[] },
      hospitals: { inserted: 0, errors: [] as string[] },
      mdas: { inserted: 0, errors: [] as string[] },
      programs: { inserted: 0, errors: [] as string[] },
    };

    // Seed Schools
    console.log(`Seeding ${seedSchools.length} schools...`);
    const supabaseForSeed = await createClient();
    for (const school of seedSchools) {
      try {
        const schoolData = {
          ...school,
          updated_at: new Date().toISOString(),
        };
        
        const { data, error } = await supabaseForSeed
          .from("schools")
          .upsert(schoolData, { onConflict: "name" })
          .select()
          .single();
          
        if (error) {
          results.schools.errors.push(`${school.name}: ${error.message}`);
          console.error(`Error seeding school ${school.name}:`, error);
        } else {
          results.schools.inserted++;
        }
      } catch (err: any) {
        results.schools.errors.push(`${school.name}: ${err.message}`);
        console.error(`Error seeding school ${school.name}:`, err);
      }
    }

    // Seed Hospitals
    console.log(`Seeding ${seedHospitals.length} hospitals...`);
    for (const hospital of seedHospitals) {
      try {
        const hospitalData = {
          ...hospital,
          updated_at: new Date().toISOString(),
        };
        
        const { data, error } = await supabaseForSeed
          .from("hospitals")
          .upsert(hospitalData, { onConflict: "name" })
          .select()
          .single();
          
        if (error) {
          results.hospitals.errors.push(`${hospital.name}: ${error.message}`);
          console.error(`Error seeding hospital ${hospital.name}:`, error);
        } else {
          results.hospitals.inserted++;
        }
      } catch (err: any) {
        results.hospitals.errors.push(`${hospital.name}: ${err.message}`);
        console.error(`Error seeding hospital ${hospital.name}:`, err);
      }
    }

    // Seed MDAs (if mdas table exists)
    console.log(`Seeding ${seedMDAs.length} MDAs...`);
    try {
      for (const mda of seedMDAs) {
        try {
          const { data, error } = await supabaseForSeed
            .from("mdas")
            .upsert(
              {
                id: mda.id,
                name: mda.name,
                link: mda.link,
                image: mda.image,
                category: mda.category,
                icon_name: mda.iconName,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: "id",
              }
            )
            .select();

          if (error) {
            // If table doesn't exist, skip MDAs
            if (error.code === "42P01") {
              console.log("MDAs table does not exist. Skipping MDA seeding.");
              results.mdas.errors.push("MDAs table not found in database");
              break;
            }
            results.mdas.errors.push(`${mda.name}: ${error.message}`);
            console.error(`Error seeding MDA ${mda.name}:`, error);
          } else {
            results.mdas.inserted++;
          }
        } catch (err: any) {
          results.mdas.errors.push(`${mda.name}: ${err.message}`);
          console.error(`Error seeding MDA ${mda.name}:`, err);
        }
      }
    } catch (err: any) {
      console.log("MDAs seeding skipped:", err.message);
    }

    // Seed Social Programs
    console.log(`Seeding ${seedSocialPrograms.length} social programs...`);
    for (const program of seedSocialPrograms) {
      try {
        const programData = {
          ...program,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { data, error } = await supabaseForSeed
          .from("social_programs")
          .upsert(programData, { onConflict: "code" })
          .select()
          .single();
          
        if (error) {
          results.programs.errors.push(`${program.name}: ${error.message}`);
          console.error(`Error seeding program ${program.name}:`, error);
        } else {
          results.programs.inserted++;
        }
      } catch (err: any) {
        results.programs.errors.push(`${program.name}: ${err.message}`);
        console.error(`Error seeding program ${program.name}:`, err);
      }
    }

    const totalInserted =
      results.schools.inserted +
      results.hospitals.inserted +
      results.mdas.inserted +
      results.programs.inserted;

    const totalErrors =
      results.schools.errors.length +
      results.hospitals.errors.length +
      results.mdas.errors.length +
      results.programs.errors.length;

    return NextResponse.json({
      success: true,
      message: `Seeding completed. ${totalInserted} records inserted.`,
      results: {
        schools: {
          total: seedSchools.length,
          inserted: results.schools.inserted,
          errors: results.schools.errors.length,
          errorDetails: results.schools.errors.slice(0, 5), // First 5 errors
        },
        hospitals: {
          total: seedHospitals.length,
          inserted: results.hospitals.inserted,
          errors: results.hospitals.errors.length,
          errorDetails: results.hospitals.errors.slice(0, 5),
        },
        mdas: {
          total: seedMDAs.length,
          inserted: results.mdas.inserted,
          errors: results.mdas.errors.length,
          errorDetails: results.mdas.errors.slice(0, 5),
        },
        programs: {
          total: seedSocialPrograms.length,
          inserted: results.programs.inserted,
          errors: results.programs.errors.length,
          errorDetails: results.programs.errors.slice(0, 5),
        },
      },
      summary: {
        totalInserted,
        totalErrors,
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed database",
      },
      { status: 500 }
    );
  }
}

