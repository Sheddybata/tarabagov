import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Program } from "@/lib/data/programs"
import { 
  BookOpen, 
  Users, 
  Crown, 
  Heart, 
  Shield, 
  Globe, 
  Video, 
  Sparkles, 
  Sword, 
  Lightbulb 
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "book-open": BookOpen,
  "users": Users,
  "crown": Crown,
  "heart": Heart,
  "shield": Shield,
  "globe": Globe,
  "video": Video,
  "sparkles": Sparkles,
  "sword": Sword,
  "lightbulb": Lightbulb,
}

interface ProgramCardProps {
  program: Program
}

export function ProgramCard({ program }: ProgramCardProps) {
  const Icon = iconMap[program.icon] || BookOpen

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-eiba-blue/10 rounded-lg">
            <Icon className="h-6 w-6 text-eiba-blue" />
          </div>
        </div>
        <CardTitle className="text-xl">{program.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-base mb-4 line-clamp-3">
          {program.shortDescription}
        </CardDescription>
        {program.duration && (
          <div className="text-sm text-eiba-gray mb-4">
            <span className="font-medium">Duration:</span> {program.duration}
          </div>
        )}
        <div className="mt-auto">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/programs/${program.slug}`}>
              Learn More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


