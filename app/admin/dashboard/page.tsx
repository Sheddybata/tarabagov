"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Baby,
  Map,
  DollarSign,
  GraduationCap,
  Heart,
  FileCheck,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllReports } from "@/lib/supabase/reports";
import { getAllBirthRegistrations } from "@/lib/supabase/birth-registrations";
import { getAllLandServices } from "@/lib/supabase/land-services";
import { getAllDocumentVerifications } from "@/lib/supabase/document-verifications";
import { getAllSocialServices } from "@/lib/supabase/social-services";
import { getAllSchools } from "@/lib/supabase/schools";
import { getAllHospitals } from "@/lib/supabase/hospitals";

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  inProgressReports: number;
  totalBirthRegistrations: number;
  pendingBirthRegistrations: number;
  approvedBirthRegistrations: number;
  rejectedBirthRegistrations: number;
  totalLandServices: number;
  pendingLandServices: number;
  completedLandServices: number;
  totalTaxServices: number;
  pendingTaxServices: number;
  totalTaxRevenue: number;
  totalSchoolRecords: number;
  totalHospitalRecords: number;
  totalDocumentVerifications: number;
  pendingDocumentVerifications: number;
  verifiedDocuments: number;
  totalSocialServices: number;
  pendingSocialServices: number;
  enrolledBeneficiaries: number;
}

const recentActivity = [
  {
    id: 1,
    type: "report",
    title: "Pothole on Wukari Road",
    category: "Roads",
    reference: "TS-892341",
    status: "pending",
    time: "2 minutes ago",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    type: "birth",
    title: "Birth Registration - Aisha Mohammed",
    category: "New Application",
    reference: "BR-87654321",
    status: "pending",
    time: "15 minutes ago",
    icon: Baby,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    type: "document",
    title: "Certificate Verification",
    category: "Birth Certificate",
    reference: "CV-2024-001",
    status: "verified",
    time: "1 hour ago",
    icon: FileCheck,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    id: 4,
    type: "land",
    title: "Land Registration Request",
    category: "New Title",
    reference: "LR-456789",
    status: "pending",
    time: "2 hours ago",
    icon: Map,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 5,
    type: "tax",
    title: "Tax Payment Received",
    category: "Business Tax",
    reference: "TX-987654",
    status: "completed",
    time: "3 hours ago",
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: 6,
    type: "report",
    title: "Water Leakage in Jalingo",
    category: "Water",
    reference: "TS-892340",
    status: "in_progress",
    time: "4 hours ago",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    inProgressReports: 0,
    totalBirthRegistrations: 0,
    pendingBirthRegistrations: 0,
    approvedBirthRegistrations: 0,
    rejectedBirthRegistrations: 0,
    totalLandServices: 0,
    pendingLandServices: 0,
    completedLandServices: 0,
    totalTaxServices: 0,
    pendingTaxServices: 0,
    totalTaxRevenue: 0,
    totalSchoolRecords: 0,
    totalHospitalRecords: 0,
    totalDocumentVerifications: 0,
    pendingDocumentVerifications: 0,
    verifiedDocuments: 0,
    totalSocialServices: 0,
    pendingSocialServices: 0,
    enrolledBeneficiaries: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data from Supabase
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          reportsResult,
          birthRegistrationsResult,
          landServicesResult,
          documentVerificationsResult,
          socialServicesResult,
          schoolsResult,
          hospitalsResult,
        ] = await Promise.all([
          getAllReports(),
          getAllBirthRegistrations(),
          getAllLandServices(),
          getAllDocumentVerifications(),
          getAllSocialServices(),
          getAllSchools(),
          getAllHospitals(),
        ]);

        // Process Reports
        const reports = reportsResult.data || [];
        const totalReports = reports.length;
        const pendingReports = reports.filter((r: any) => r.status === "pending").length;
        const resolvedReports = reports.filter((r: any) => r.status === "resolved" || r.status === "closed").length;
        const inProgressReports = reports.filter((r: any) => r.status === "in_progress").length;

        // Process Birth Registrations
        const birthRegistrations = birthRegistrationsResult.data || [];
        const totalBirthRegistrations = birthRegistrations.length;
        const pendingBirthRegistrations = birthRegistrations.filter(
          (r: any) => r.status === "pending" || r.status === "pending_review"
        ).length;
        const approvedBirthRegistrations = birthRegistrations.filter(
          (r: any) => r.status === "approved" || r.status === "completed"
        ).length;
        const rejectedBirthRegistrations = birthRegistrations.filter((r: any) => r.status === "rejected").length;

        // Process Land Services
        const landServices = landServicesResult.data || [];
        const totalLandServices = landServices.length;
        const pendingLandServices = landServices.filter((r: any) => r.status === "pending").length;
        const completedLandServices = landServices.filter(
          (r: any) => r.status === "completed" || r.status === "approved"
        ).length;

        // Process Document Verifications
        const documentVerifications = documentVerificationsResult.data || [];
        const totalDocumentVerifications = documentVerifications.length;
        const pendingDocumentVerifications = documentVerifications.filter((r: any) => r.status === "pending").length;
        const verifiedDocuments = documentVerifications.filter(
          (r: any) => r.status === "verified" || r.status === "approved"
        ).length;

        // Process Social Services
        const socialServices = socialServicesResult.data || [];
        const totalSocialServices = socialServices.length;
        const pendingSocialServices = socialServices.filter((r: any) => r.status === "pending").length;
        const enrolledBeneficiaries = socialServices.filter(
          (r: any) => r.status === "active" || r.status === "approved"
        ).length;

        // Process Schools
        const schools = schoolsResult.data || [];
        const totalSchoolRecords = schools.length;

        // Process Hospitals
        const hospitals = hospitalsResult.data || [];
        const totalHospitalRecords = hospitals.length;

        // Tax Services - placeholder (no tax services table yet)
        const totalTaxServices = 0;
        const pendingTaxServices = 0;
        const totalTaxRevenue = 0;

        setStats({
          totalReports,
          pendingReports,
          resolvedReports,
          inProgressReports,
          totalBirthRegistrations,
          pendingBirthRegistrations,
          approvedBirthRegistrations,
          rejectedBirthRegistrations,
          totalLandServices,
          pendingLandServices,
          completedLandServices,
          totalTaxServices,
          pendingTaxServices,
          totalTaxRevenue,
          totalSchoolRecords,
          totalHospitalRecords,
          totalDocumentVerifications,
          pendingDocumentVerifications,
          verifiedDocuments,
          totalSocialServices,
          pendingSocialServices,
          enrolledBeneficiaries,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const overviewStats = [
    {
      title: "Citizen Reports",
      value: stats.totalReports,
      pending: stats.pendingReports,
      resolved: stats.resolvedReports,
      icon: AlertCircle,
      color: "text-red-600",
      href: "/admin/reports",
      image: "/images/services/report-issue.jpg",
    },
    {
      title: "Birth Registrations",
      value: stats.totalBirthRegistrations,
      pending: stats.pendingBirthRegistrations,
      approved: stats.approvedBirthRegistrations,
      icon: Baby,
      color: "text-blue-600",
      href: "/admin/birth-registrations",
      image: "/images/services/birth-registration.jpg",
    },
    {
      title: "Tax Services",
      value: stats.totalTaxServices,
      pending: stats.pendingTaxServices,
      revenue: stats.totalTaxRevenue,
      icon: DollarSign,
      color: "text-yellow-600",
      href: "/admin/tax-services",
      image: "/images/services/tsirs-tax.jpg",
    },
    {
      title: "Document Verification",
      value: stats.totalDocumentVerifications,
      pending: stats.pendingDocumentVerifications,
      verified: stats.verifiedDocuments,
      icon: FileCheck,
      color: "text-teal-600",
      href: "/admin/documents",
      image: "/images/services/document-verification.jpg",
    },
  ];

  const secondaryServices = [
    {
      title: "Land Services",
      value: stats.totalLandServices,
      meta: `${stats.pendingLandServices} pending`,
      icon: Map,
      href: "/admin/land-services",
      image: "/images/services/tagis-land.jpg",
    },
    {
      title: "School Records",
      value: stats.totalSchoolRecords,
      meta: "Registered schools",
      icon: GraduationCap,
      href: "/admin/schools",
      image: "/images/services/school-records.jpg",
    },
    {
      title: "Hospital Records",
      value: stats.totalHospitalRecords,
      meta: "Registered hospitals",
      icon: Heart,
      href: "/admin/hospitals",
      image: "/images/services/hospital-records.jpg",
    },
    {
      title: "Social Services",
      value: stats.totalSocialServices,
      meta: `${stats.enrolledBeneficiaries} enrolled`,
      icon: Users,
      href: "/admin/social-services",
      image: "/images/services/social-services.jpg",
    },
  ];

  const quickActions = [
    {
      title: "Handle Reports",
      description: "Resolve citizen complaints and field issues.",
      href: "/admin/reports",
      icon: AlertCircle,
      stat: `${stats.pendingReports} pending`,
    },
    {
      title: "Review Birth Records",
      description: "Validate new birth registrations for approval.",
      href: "/admin/birth-registrations",
      icon: Baby,
      stat: `${stats.pendingBirthRegistrations} awaiting review`,
    },
    {
      title: "Land & Documents",
      description: "Manage land titles and document verification.",
      href: "/admin/documents",
      icon: FileCheck,
      stat: `${stats.pendingDocumentVerifications} documents`,
    },
    {
      title: "Revenue & Taxes",
      description: "Monitor TSIRS submissions and revenue inflow.",
      href: "/admin/tax-services",
      icon: DollarSign,
      stat: `₦${(stats.totalTaxRevenue / 1000000).toFixed(1)}M collected`,
    },
  ];

  const recentUpdates = recentActivity.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-taraba-green mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-taraba-green font-semibold">
              Admin Control Center
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Good day, Administrator</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Track citizen services, approve submissions, and keep Taraba State services running smoothly from a single view.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => router.push("/admin/reports")} className="flex-1">
              Open Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
              View Public Portal
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Service overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="relative overflow-hidden border-0 shadow-lg cursor-pointer"
                onClick={() => router.push(stat.href)}
              >
                {stat.image && (
                  <>
                    <Image
                      src={stat.image}
                      alt={stat.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
                  </>
                )}
                <div className="relative z-10">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between text-white">
                    <CardTitle className="text-base font-semibold">{stat.title}</CardTitle>
                    <div className="rounded-lg border border-white/40 bg-white/20 p-2">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="text-white">
                    <p className="text-3xl font-bold">
                      {stat.value.toLocaleString()}
                    </p>
                    <div className="mt-3 text-sm space-y-2">
                      {stat.pending !== undefined && (
                        <div className="flex items-center gap-2 text-white/80">
                          <Clock className="h-4 w-4" />
                          <span>{stat.pending} pending</span>
                        </div>
                      )}
                      {stat.resolved !== undefined && (
                        <div className="flex items-center gap-2 text-white/80">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{stat.resolved} resolved</span>
                        </div>
                      )}
                      {stat.approved !== undefined && (
                        <div className="flex items-center gap-2 text-white/80">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{stat.approved} approved</span>
                        </div>
                      )}
                      {stat.verified !== undefined && (
                        <div className="flex items-center gap-2 text-white/80">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{stat.verified} verified</span>
                        </div>
                      )}
                      {stat.revenue !== undefined && (
                        <div className="flex items-center gap-2 text-white/80">
                          <DollarSign className="h-4 w-4" />
                          <span>₦{(stat.revenue / 1000000).toFixed(1)}M</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Other services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryServices.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="relative overflow-hidden border-0 shadow-lg cursor-pointer"
                onClick={() => router.push(service.href)}
              >
                {service.image && (
                  <>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                      quality={80}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/85" />
                  </>
                )}
                <CardContent className="relative z-10 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-white/70">{service.title}</p>
                      <p className="text-3xl font-bold">{service.value.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-white/40 bg-white/20 p-2">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-white/85">{service.meta}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump into the most common workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-taraba-green"
                  onClick={() => router.push(action.href)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-taraba-green" />
                        <p className="text-base font-semibold text-gray-900">{action.title}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-800">{action.stat}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent updates</CardTitle>
            <CardDescription>Latest submissions across services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUpdates.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 p-4"
                >
                  <div className="rounded-full bg-gray-100 p-3">
                    <Icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {activity.category} • {activity.reference}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/reports")}>
              View full timeline
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
