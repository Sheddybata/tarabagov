import { programs } from "@/lib/data/programs"
import { ProgramCard } from "@/components/programs/program-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ProgramsPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-eiba-blue-dark mb-4">
            Our Academic Programs
          </h2>
          <p className="text-lg text-eiba-gray max-w-2xl mx-auto">
            Discover our comprehensive range of programs designed to equip you for effective ministry and kingdom impact.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {programs.slice(0, 6).map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="default" size="lg">
            <Link href="/programs">
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}


