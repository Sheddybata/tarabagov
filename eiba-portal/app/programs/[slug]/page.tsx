import { notFound } from "next/navigation"
import { getProgramBySlug, programs } from "@/lib/data/programs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Clock, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function generateStaticParams() {
  return programs.map((program) => ({
    slug: program.slug,
  }))
}

export default function ProgramDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const program = getProgramBySlug(params.slug)

  if (!program) {
    notFound()
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/programs"
          className="inline-flex items-center text-eiba-blue hover:text-eiba-blue-light mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Programs
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-eiba-blue-dark mb-4">
              {program.name}
            </h1>
            <p className="text-xl text-eiba-gray">
              {program.shortDescription}
            </p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {program.duration && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-eiba-blue" />
                    <CardTitle className="text-base">Duration</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{program.duration}</p>
                </CardContent>
              </Card>
            )}
            {program.format && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-eiba-blue" />
                    <CardTitle className="text-base">Format</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{program.format}</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-eiba-blue" />
                  <CardTitle className="text-base">Target Audience</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{program.targetAudience}</p>
              </CardContent>
            </Card>
          </div>

          {/* Full Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl font-bold text-eiba-blue-dark mb-4">
              Program Overview
            </h2>
            <p className="text-lg text-eiba-gray leading-relaxed">
              {program.fullDescription}
            </p>
          </div>

          {/* CTA */}
          <div className="bg-eiba-gray-light rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-eiba-blue-dark mb-4">
              Ready to Apply?
            </h3>
            <p className="text-eiba-gray mb-6">
              Take the next step in your journey of spiritual growth and ministry preparation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="accent">
                <Link href="/admissions">
                  Apply to This Program
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


