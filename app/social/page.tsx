import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { SocialServices } from "@/components/social/social-services";

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Social Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Social beneficiary program enrollment and utility bill payments
            </p>
          </div>
          <SocialServices />
        </div>
      </main>
      <Footer />
    </div>
  );
}

