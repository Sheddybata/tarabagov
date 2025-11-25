"use client";

import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import {
  AlertCircle,
  Baby,
  Building2,
  GraduationCap,
  Heart,
  FileCheck,
  Users,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import { NairaIcon } from "@/components/icons/naira-icon";

const services = [
  {
    id: 1,
    title: "Report an Issue",
    description: "Report infrastructure issues, service problems, or concerns with geolocation tracking.",
    icon: AlertCircle,
    href: "/report",
    image: "/images/services/report-issue.jpg",
    color: "bg-red-50 border-red-100",
    textColor: "text-red-600",
  },
  {
    id: 2,
    title: "Birth Registration",
    description: "Register your child's birth and obtain official birth certificates online.",
    icon: Baby,
    href: "/registry/birth",
    image: "/images/services/birth-registration.jpg",
    color: "bg-blue-50 border-blue-100",
    textColor: "text-blue-600",
  },
  {
    id: 3,
    title: "TAGIS - Land Administration",
    description: "Access land services, cadastral mapping, and land registration through Taraba Geographic Information Service.",
    icon: Map,
    href: "https://www.tarabastategov.cloud/government/tagis",
    image: "/images/services/tagis-land.jpg",
    color: "bg-green-50 border-green-100",
    textColor: "text-green-600",
  },
  {
    id: 4,
    title: "TSIRS - Tax Services",
    description: "Pay taxes, generate invoices, and verify tax clearance certificates through Taraba State Internal Revenue Service.",
    icon: NairaIcon,
    href: "https://mda.tarababir.gov.ng/",
    image: "/images/services/tsirs-tax.jpg",
    color: "bg-yellow-50 border-yellow-100",
    textColor: "text-yellow-600",
  },
  {
    id: 5,
    title: "School Records",
    description: "Access centralized digital records of schools and educational institutions.",
    icon: GraduationCap,
    href: "/schools",
    image: "/images/services/school-records.jpg",
    color: "bg-purple-50 border-purple-100",
    textColor: "text-purple-600",
  },
  {
    id: 6,
    title: "Hospital Records",
    description: "View hospital information and access healthcare service records.",
    icon: Heart,
    href: "/hospitals",
    image: "/images/services/hospital-records.jpg",
    color: "bg-pink-50 border-pink-100",
    textColor: "text-pink-600",
  },
  {
    id: 7,
    title: "MDA Directory",
    description: "Browse ministries, departments, and agencies with contact information.",
    icon: Building2,
    href: "/departments",
    image: "/images/services/mda-directory.jpg",
    color: "bg-indigo-50 border-indigo-100",
    textColor: "text-indigo-600",
  },
  {
    id: 8,
    title: "Document Verification",
    description: "Verify official documents and certificates issued by the state government.",
    icon: FileCheck,
    href: "/verify",
    image: "/images/services/document-verification.jpg",
    color: "bg-teal-50 border-teal-100",
    textColor: "text-teal-600",
  },
  {
    id: 9,
    title: "Social Services",
    description: "Social beneficiary program enrollment and utility bill payments (water, waste, etc.).",
    icon: Users,
    href: "/social",
    image: "/images/services/social-services.jpg",
    color: "bg-orange-50 border-orange-100",
    textColor: "text-orange-600",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Government Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access a wide range of government services online. Fast, secure, and citizen-centric.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                href={service.href}
                image={service.image}
                color={service.color}
                textColor={service.textColor}
              />
            ))}
          </div>

          <div className="bg-taraba-green rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="mb-6 text-lg">
              Our support team is here to assist you with any questions or issues.
            </p>
            <Button
              variant="outline"
              className="bg-white text-taraba-green hover:bg-gray-100"
              asChild
            >
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

