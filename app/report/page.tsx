import { ReportIssueForm } from "@/components/forms/report-issue-form";
import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const dynamic = 'force-dynamic';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <ReportIssueForm />
      </main>
      <Footer />
    </div>
  );
}

