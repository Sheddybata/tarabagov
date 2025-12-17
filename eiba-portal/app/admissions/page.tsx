"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, FileText, Calendar, HelpCircle } from "lucide-react"

const processSteps = [
  {
    step: 1,
    title: "Review Programs",
    description: "Explore our programs and find the one that aligns with your calling and goals.",
  },
  {
    step: 2,
    title: "Check Requirements",
    description: "Review the admission requirements to ensure you meet the criteria for your chosen program.",
  },
  {
    step: 3,
    title: "Submit Application",
    description: "Complete and submit your application form along with required documents.",
  },
  {
    step: 4,
    title: "Application Review",
    description: "Our admissions team will review your application and may contact you for additional information.",
  },
  {
    step: 5,
    title: "Acceptance & Enrollment",
    description: "Upon acceptance, you'll receive enrollment instructions and can begin your journey with us.",
  },
]

const requirements = [
  "Completed application form",
  "Personal statement of faith and calling",
  "Academic transcripts (if applicable)",
  "Two reference letters (pastor, mentor, or church leader)",
  "Recent passport photograph",
  "Application fee (if applicable)",
]

const faqs = [
  {
    question: "What are the admission requirements?",
    answer: "Admission requirements vary by program. Generally, we require a completed application, personal statement, references, and a commitment to biblical principles. Specific requirements are listed above.",
  },
  {
    question: "How long does the application process take?",
    answer: "The application review process typically takes 2-4 weeks. You'll be notified via email once a decision has been made.",
  },
  {
    question: "Are there any prerequisites for the programs?",
    answer: "Most programs are open to all believers regardless of educational background. Some advanced programs may have specific prerequisites, which will be listed in the program details.",
  },
  {
    question: "Can I apply to multiple programs?",
    answer: "Yes, you can apply to multiple programs, but we recommend focusing on one program at a time to ensure you can fully commit to the coursework and requirements.",
  },
  {
    question: "Is financial aid available?",
    answer: "Please contact our admissions office for information about financial aid, scholarships, and payment plans that may be available.",
  },
  {
    question: "When do programs start?",
    answer: "Program start dates vary by program. Please check the specific program page for start dates, or contact us for the most current information.",
  },
]

export default function AdmissionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-eiba-blue-dark mb-6">
            Begin Your Journey
          </h1>
          <p className="text-lg text-eiba-gray max-w-3xl mx-auto">
            Take the first step towards spiritual growth, intellectual development, and purposeful leadership. Our admissions process is designed to help you find the right program and begin your transformation journey.
          </p>
        </div>

        {/* Application Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-eiba-blue-dark mb-8 text-center">
            Application Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step) => (
              <Card key={step.step} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-full bg-eiba-blue text-white flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-eiba-gray">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-eiba-blue-dark mb-8 text-center">
              Admission Requirements
            </h2>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-eiba-blue" />
                  <CardTitle>Required Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-eiba-gold mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-eiba-gray">{req}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-eiba-gray italic">
                  * Additional requirements may apply for specific programs. Please check the program details page for more information.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Important Dates */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-eiba-blue-dark mb-8 text-center">
              Important Dates
            </h2>
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-eiba-blue" />
                  <CardTitle>Application Deadlines</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-eiba-gray mb-4">
                  Application deadlines vary by program. Please check the specific program page for detailed information about application deadlines and program start dates.
                </p>
                <p className="text-eiba-gray">
                  For the most current information, please contact our admissions office or check back regularly as we update our calendar.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Apply */}
        <section className="mb-16">
          <div className="bg-eiba-gold rounded-lg p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Apply?
            </h2>
            <p className="text-lg mb-6 text-white/90">
              Start your application process today. If you have questions, our admissions team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default" className="bg-white text-eiba-blue hover:bg-eiba-gray-light">
                <Link href="/contact">
                  Contact Admissions
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/programs">
                  Explore Programs
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-eiba-blue-dark mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5 text-eiba-blue" />
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </div>
                    <span className="text-eiba-blue">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>
                </CardHeader>
                {openFaq === index && (
                  <CardContent>
                    <p className="text-eiba-gray">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}


