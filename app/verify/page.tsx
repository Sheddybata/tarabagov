import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { DocumentVerification } from "@/components/verify/document-verification";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Document Verification
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Verify official documents and certificates issued by the Taraba State Government
            </p>
          </div>
          <DocumentVerification />
        </div>
      </main>
      <Footer />
    </div>
  );
}

