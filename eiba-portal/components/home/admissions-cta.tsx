import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function AdmissionsCTA() {
  return (
    <section className="py-16 bg-eiba-gold text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Take the first step towards spiritual growth, intellectual development, and purposeful leadership. Apply now and join a community of believers committed to transforming nations through God's Word.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="default" className="bg-white text-eiba-blue hover:bg-eiba-gray-light">
              <Link href="/admissions">
                Start Your Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/programs">
                Explore Programs First
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


