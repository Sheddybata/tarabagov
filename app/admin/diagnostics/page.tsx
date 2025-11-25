"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Diagnostic page to test all functionalities
 * 
 * NOTE: This is a development/testing page. Remove or restrict access in production.
 */
export default function DiagnosticsPage() {
  const [results, setResults] = useState<Record<string, any>>({});

  const testSupabaseConnection = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      setResults(prev => ({
        ...prev,
        supabase: { success: !error, data, error: error?.message }
      }));
    } catch (err: any) {
      setResults(prev => ({
        ...prev,
        supabase: { success: false, error: err.message }
      }));
    }
  };

  const testReportAPI = async () => {
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "Roads",
          description: "Test report",
          location_lat: 8.9,
          location_lng: 11.3,
        }),
      });
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        reportAPI: { success: response.ok, data, status: response.status }
      }));
    } catch (err: any) {
      setResults(prev => ({
        ...prev,
        reportAPI: { success: false, error: err.message }
      }));
    }
  };

  const testBirthAPI = async () => {
    try {
      const response = await fetch("/api/birth-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          child_first_name: "Test",
          child_last_name: "Child",
          date_of_birth: "2024-01-01",
          child_gender: "Male",
        }),
      });
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        birthAPI: { success: response.ok, data, status: response.status }
      }));
    } catch (err: any) {
      setResults(prev => ({
        ...prev,
        birthAPI: { success: false, error: err.message }
      }));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">System Diagnostics</h1>
      
      <div className="space-y-4">
        <button
          onClick={testSupabaseConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Supabase Connection
        </button>
        {results.supabase && (
          <div className={`p-4 rounded ${results.supabase.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <pre>{JSON.stringify(results.supabase, null, 2)}</pre>
          </div>
        )}

        <button
          onClick={testReportAPI}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Report API
        </button>
        {results.reportAPI && (
          <div className={`p-4 rounded ${results.reportAPI.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <pre>{JSON.stringify(results.reportAPI, null, 2)}</pre>
          </div>
        )}

        <button
          onClick={testBirthAPI}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Birth Registration API
        </button>
        {results.birthAPI && (
          <div className={`p-4 rounded ${results.birthAPI.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <pre>{JSON.stringify(results.birthAPI, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

