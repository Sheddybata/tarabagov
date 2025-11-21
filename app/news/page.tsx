import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { NewsList } from "@/components/news/news-list";
import { Calendar, TrendingUp } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Announcements</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed about the latest news, announcements, and updates from Taraba State Government.
            </p>
          </div>
          <NewsList />
        </div>
      </main>
      <Footer />
    </div>
  );
}

