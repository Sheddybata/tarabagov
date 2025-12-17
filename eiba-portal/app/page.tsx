import { HeroSection } from "@/components/home/hero-section"
import { ProgramsPreview } from "@/components/home/programs-preview"
import { AboutPreview } from "@/components/home/about-preview"
import { AdmissionsCTA } from "@/components/home/admissions-cta"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProgramsPreview />
      <AboutPreview />
      <AdmissionsCTA />
    </>
  )
}


