import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function AboutPreview() {
  return (
    <section className="py-16 bg-eiba-gray-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-eiba-blue-dark mb-6">
              About EBOMI International Bible Academy
            </h2>
            <p className="text-lg text-eiba-gray mb-4">
              We are committed to providing comprehensive biblical education that equips believers for effective ministry and kingdom impact.
            </p>
            <p className="text-lg text-eiba-gray mb-6">
              Our programs are designed to deepen your understanding of Scripture, strengthen your walk with God, and prepare you to make a lasting difference in your community and beyond.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-eiba-blue-dark mb-4">
              Our Core Values
            </h3>
            <ul className="space-y-3 text-eiba-gray">
              <li className="flex items-start">
                <span className="text-eiba-gold mr-2">•</span>
                <span>Spiritual grounding in biblical truth</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-2">•</span>
                <span>Intellectual excellence and growth</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-2">•</span>
                <span>Purpose-driven leadership development</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-2">•</span>
                <span>Practical ministry application</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-2">•</span>
                <span>Kingdom impact and transformation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}


