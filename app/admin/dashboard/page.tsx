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
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - will be replaced with actual Supabase queries
const mockStats = {
  totalReports: 1247,
  pendingReports: 43,
  resolvedReports: 1156,
  inProgressReports: 48,
  totalBirthRegistrations: 892,
  pendingBirthRegistrations: 28,
  approvedBirthRegistrations: 812,
  rejectedBirthRegistrations: 52,
  totalLandServices: 456,
  pendingLandServices: 12,
  completedLandServices: 432,
  totalTaxServices: 2341,
  pendingTaxServices: 8,
  totalTaxRevenue: 125000000,
  totalSchoolRecords: 156,
  totalHospitalRecords: 89,
  totalDocumentVerifications: 678,
  pendingDocumentVerifications: 15,
  verifiedDocuments: 645,
  totalSocialServices: 345,
  pendingSocialServices: 7,
  enrolledBeneficiaries: 312,
};

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
  const [stats, setStats] = useState(mockStats);

  // TODO: Fetch real data from Supabase
  useEffect(() => {
    // Fetch statistics from Supabase
    // This will be implemented when we connect to the backend
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
                style={{
                  backgroundImage: `url(${stat.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => router.push(stat.href)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
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
                style={{
                  backgroundImage: `url(${service.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => router.push(service.href)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/85" />
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
