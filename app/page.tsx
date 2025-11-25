"use client";

import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { VisionMission } from "@/components/landing/vision-mission";
import { GallerySection } from "@/components/landing/gallery-section";
import { NewsletterSection } from "@/components/landing/newsletter-section";
import { Footer } from "@/components/landing/footer";
import { GovernorProfile } from "@/components/about/governor-profile";
import { AboutContent } from "@/components/about/about-content";
import { ServiceCard } from "@/components/services/service-card";
import { NairaIcon } from "@/components/icons/naira-icon";
import { 
  AlertCircle, 
  Baby, 
  GraduationCap, 
  Heart, 
  Building2, 
  FileCheck,
  Users,
  Map,
  ExternalLink,
  Wallet,
  Receipt,
  TrendingUp,
  Handshake,
  Scale,
  Cpu,
  Sprout,
  MapPin,
  ShoppingCart,
  Leaf,
  LucideIcon
} from "lucide-react";
import { mdas } from "@/lib/data/mdas";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Wallet,
  Receipt,
  Map,
  TrendingUp,
  Handshake,
  Scale,
  Cpu,
  Sprout,
  MapPin,
  Building2,
  ShoppingCart,
  Leaf,
};

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <TopHeader />
      <Navbar />
      <HeroSection />
      
      <VisionMission />
      
      {/* About Section - Governor Profile */}
      <section id="about" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <GovernorProfile />
        </div>
      </section>

      {/* About Section - State Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <AboutContent />
        </div>
      </section>
      
      {/* Government Services Section - Full Width */}
      <section 
        id="services" 
        className="py-16 bg-gray-50 scroll-mt-20" 
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Government Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access a wide range of government services online. Fast, secure, and citizen-centric.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <ServiceCard
              title="Report an Issue"
              description="Report infrastructure problems or service issues with location tracking"
              icon={AlertCircle}
              href="/report"
              image="/images/services/report-issue.jpg"
              color="bg-red-50 border-red-100"
              textColor="text-red-600"
            />
            
            <ServiceCard
              title="Birth Registration"
              description="Register your child's birth and obtain official certificates online"
              icon={Baby}
              href="/registry/birth"
              image="/images/services/birth-registration.jpg"
              color="bg-blue-50 border-blue-100"
              textColor="text-blue-600"
            />
            
            <ServiceCard
              title="TAGIS - Land Administration"
              description="Access land services, cadastral mapping, and land registration through Taraba Geographic Information Service"
              icon={Map}
              href="https://www.tarabastategov.cloud/government/tagis"
              image="/images/services/tagis-land.jpg"
              color="bg-green-50 border-green-100"
              textColor="text-green-600"
            />

            <ServiceCard
              title="TSIRS - Tax Services"
              description="Pay taxes, generate invoices, and verify tax clearance certificates through Taraba State Internal Revenue Service"
              icon={NairaIcon}
              href="https://mda.tarababir.gov.ng/"
              image="/images/services/tsirs-tax.jpg"
              color="bg-yellow-50 border-yellow-100"
              textColor="text-yellow-600"
            />

            <ServiceCard
              title="School Records"
              description="Access centralized digital records of schools and educational institutions"
              icon={GraduationCap}
              href="/schools"
              image="/images/services/school-records.jpg"
              color="bg-purple-50 border-purple-100"
              textColor="text-purple-600"
            />

            <ServiceCard
              title="Hospital Records"
              description="View hospital information and access healthcare service records"
              icon={Heart}
              href="/hospitals"
              image="/images/services/hospital-records.jpg"
              color="bg-pink-50 border-pink-100"
              textColor="text-pink-600"
            />

            <ServiceCard
              title="MDA Directory"
              description="Browse ministries, departments, and agencies with contact information"
              icon={Building2}
              href="/departments"
              image="/images/services/mda-directory.jpg"
              color="bg-indigo-50 border-indigo-100"
              textColor="text-indigo-600"
            />

            <ServiceCard
              title="Document Verification"
              description="Verify official documents and certificates issued by the state government"
              icon={FileCheck}
              href="/verify"
              image="/images/services/document-verification.jpg"
              color="bg-teal-50 border-teal-100"
              textColor="text-teal-600"
            />

            <ServiceCard
              title="Social Services"
              description="Social beneficiary program enrollment and utility bill payments (water, waste, etc.)"
              icon={Users}
              href="/social"
              image="/images/services/social-services.jpg"
              color="bg-orange-50 border-orange-100"
              textColor="text-orange-600"
            />
          </div>
        </div>
      </section>

      {/* MDA Directory Section - Full Width */}
      <section 
        id="mdas" 
        className="py-16 bg-white scroll-mt-20" 
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ministries, Departments & Agencies</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore all government ministries, departments, and agencies in Taraba State
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {mdas.map((mda) => {
              const Icon = iconMap[mda.iconName] || Building2;
              return (
                <a
                  key={mda.id}
                  href={mda.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div
                    className="relative rounded-lg overflow-hidden h-full min-h-[280px] transition-all duration-300 hover:shadow-xl"
                    style={{
                      backgroundImage: `url(${mda.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 group-hover:from-black/75 group-hover:via-black/65 group-hover:to-black/85 transition-all duration-300" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-6 z-10">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm border border-white/30">
                        <Icon className="h-7 w-7 text-white" />
                      </div>

                    {/* Category Badge */}
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded">
                        {mda.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-4 text-white line-clamp-3">
                      {mda.name}
                    </h3>

                    {/* CTA */}
                    <div className="mt-auto font-medium flex items-center gap-2 text-white">
                      Visit Website
                      <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
              );
            })}
          </div>
        </div>
      </section>

      <GallerySection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
