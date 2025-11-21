"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Lock, Mail, Shield } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// TEMPORARY: Simple credentials - remove when Supabase is set up
const TEMP_ADMIN_EMAIL = "admin@tarabastate.gov.ng";
const TEMP_ADMIN_PASSWORD = "admin123";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== "undefined") {
      const adminSession = localStorage.getItem("admin_session");
      if (adminSession === "authenticated") {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // TEMPORARY: Simple authentication check
      // TODO: Replace with Supabase authentication when backend is connected
      if (data.email === TEMP_ADMIN_EMAIL && data.password === TEMP_ADMIN_PASSWORD) {
        // Set session in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_session", "authenticated");
        }
        
        // Redirect to admin dashboard
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError("Invalid email or password. Use: admin@tarabastate.gov.ng / admin123");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-taraba-green/10 via-gray-50 to-taraba-green/5 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-taraba-green rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Taraba State E-Governance Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@tarabastate.gov.ng"
                defaultValue={TEMP_ADMIN_EMAIL}
                {...register("email")}
                className="w-full"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-gray-500" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                defaultValue={TEMP_ADMIN_PASSWORD}
                {...register("password")}
                className="w-full"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Temporary Login Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-1">Temporary Login (Development Only)</p>
              <p className="text-xs text-blue-800">
                Email: <strong>{TEMP_ADMIN_EMAIL}</strong>
              </p>
              <p className="text-xs text-blue-800">
                Password: <strong>{TEMP_ADMIN_PASSWORD}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-2 italic">
                This is a temporary solution. Replace with Supabase authentication when backend is connected.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-taraba-green hover:bg-taraba-green-dark text-white py-3 text-lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

