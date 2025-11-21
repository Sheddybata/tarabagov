import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { HospitalRecords } from "@/components/hospitals/hospital-records";

export default function HospitalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hospital Records
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              View hospital information and access healthcare service records in Taraba State
            </p>
          </div>
          <HospitalRecords />
        </div>
      </main>
      <Footer />
    </div>
  );
}

