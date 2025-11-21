import { BirthRegistrationForm } from "@/components/forms/birth-registration-form";
import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function BirthRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <BirthRegistrationForm />
      </main>
      <Footer />
    </div>
  );
}

