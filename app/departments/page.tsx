import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { MDADirectory } from "@/components/departments/mda-directory";

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ministries, Departments & Agencies
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find contact information, services, and locations for all government ministries, departments, and agencies in Taraba State.
            </p>
          </div>
          <MDADirectory />
        </div>
      </main>
      <Footer />
    </div>
  );
}

