import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { TSIRSTaxServices } from "@/components/tsirs/tax-services";

export default function TSIRSPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TSIRS - Tax Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pay taxes, generate invoices, and verify tax clearance certificates through Taraba State Internal Revenue Service
            </p>
          </div>
          <TSIRSTaxServices />
        </div>
      </main>
      <Footer />
    </div>
  );
}

