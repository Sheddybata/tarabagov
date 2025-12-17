import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-eiba-blue-dark via-eiba-blue to-eiba-blue-light text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            EBOMI International Bible Academy
          </h1>
          <div className="text-lg sm:text-xl lg:text-2xl mb-8 font-serif leading-relaxed text-gray-100">
            <p className="mb-4">
              To raise a generation of spiritually grounded, intellectually equipped, and purpose-driven leaders who will transform nations through the uncompromised truth of God's Word.
            </p>
            <p className="text-base sm:text-lg lg:text-xl">
              We envision a Bible academy where believers are trained to understand Scripture deeply, walk in the power of the Holy Spirit, defend the faith with wisdom and boldness, and bring righteous influence into every sphere of society.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="accent" className="text-base">
              <Link href="/programs">
                Explore Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link href="/admissions">
                Apply Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


