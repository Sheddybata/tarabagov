import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { TAGISLandServices } from "@/components/tagis/land-services";

export default function TAGISPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TAGIS - Land Administration
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access land services, cadastral mapping, and land registration through Taraba Geographic Information Service
            </p>
          </div>
          <TAGISLandServices />
        </div>
      </main>
      <Footer />
    </div>
  );
}

