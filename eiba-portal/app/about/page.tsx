import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Heart, Shield, Globe, Crown } from "lucide-react"

const values = [
  {
    icon: BookOpen,
    title: "Biblical Foundation",
    description: "Deep understanding of Scripture and sound doctrine",
  },
  {
    icon: Heart,
    title: "Spiritual Growth",
    description: "Walking in the power of the Holy Spirit",
  },
  {
    icon: Shield,
    title: "Faith Defense",
    description: "Wisdom and boldness in defending the faith",
  },
  {
    icon: Globe,
    title: "Kingdom Impact",
    description: "Bringing righteous influence to every sphere of society",
  },
  {
    icon: Crown,
    title: "Purpose-Driven Leadership",
    description: "Equipping leaders who transform nations",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a community of committed believers",
  },
]

export default function AboutPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-eiba-blue-dark mb-6">
            About EBOMI International Bible Academy
          </h1>
        </div>

        {/* Vision Statement */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-eiba-blue-dark mb-6 text-center">
              Our Vision
            </h2>
            <div className="bg-eiba-gray-light rounded-lg p-8">
              <p className="text-lg sm:text-xl text-eiba-gray leading-relaxed text-center font-serif">
                To raise a generation of spiritually grounded, intellectually equipped, and purpose-driven leaders who will transform nations through the uncompromised truth of God's Word. We envision a Bible academy where believers are trained to understand Scripture deeply, walk in the power of the Holy Spirit, defend the faith with wisdom and boldness, and bring righteous influence into every sphere of society.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-eiba-blue-dark mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-eiba-blue/10 rounded-lg">
                        <Icon className="h-8 w-8 text-eiba-blue" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-eiba-gray">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Why Choose EIBA */}
        <section className="bg-eiba-gray-light rounded-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-eiba-blue-dark mb-8 text-center">
            Why Choose EBOMI International Bible Academy?
          </h2>
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4 text-lg text-eiba-gray">
              <li className="flex items-start">
                <span className="text-eiba-gold mr-3 text-2xl">•</span>
                <span><strong className="text-eiba-blue-dark">Comprehensive Curriculum:</strong> Our programs cover everything from biblical foundations to advanced ministry training, ensuring you receive a well-rounded education.</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-3 text-2xl">•</span>
                <span><strong className="text-eiba-blue-dark">Practical Application:</strong> We emphasize hands-on learning and real-world ministry experience, not just theoretical knowledge.</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-3 text-2xl">•</span>
                <span><strong className="text-eiba-blue-dark">Experienced Faculty:</strong> Learn from seasoned ministers and teachers who are passionate about your growth and success.</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-3 text-2xl">•</span>
                <span><strong className="text-eiba-blue-dark">Flexible Learning:</strong> Our programs are designed to accommodate various schedules and learning styles.</span>
              </li>
              <li className="flex items-start">
                <span className="text-eiba-gold mr-3 text-2xl">•</span>
                <span><strong className="text-eiba-blue-dark">Kingdom Focus:</strong> Every program is designed to equip you for kingdom impact and transformation in your sphere of influence.</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}


