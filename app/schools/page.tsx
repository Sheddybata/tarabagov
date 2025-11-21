import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { SchoolRecords } from "@/components/schools/school-records";

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              School Records
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access centralized digital records of schools and educational institutions in Taraba State
            </p>
          </div>
          <SchoolRecords />
        </div>
      </main>
      <Footer />
    </div>
  );
}

