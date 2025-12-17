import { programs } from "@/lib/data/programs"
import { ProgramCard } from "@/components/programs/program-card"

export default function ProgramsPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-eiba-blue-dark mb-4">
            Academic Programs
          </h1>
          <p className="text-lg text-eiba-gray max-w-3xl mx-auto">
            Explore our comprehensive range of programs designed to equip you for effective ministry, leadership, and kingdom impact. Each program is carefully crafted to deepen your understanding of Scripture and prepare you for purposeful service.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </div>
  )
}


