import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { programs } from "@/lib/data/programs"

export function Footer() {
  return (
    <footer className="bg-eiba-blue-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">EBOMI International Bible Academy</h3>
            <p className="text-sm text-gray-300 mb-4">
              Raising a generation of spiritually grounded, intellectually equipped, and purpose-driven leaders who will transform nations through the uncompromised truth of God's Word.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-300 hover:text-white transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="text-gray-300 hover:text-white transition-colors">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              {programs.slice(0, 5).map((program) => (
                <li key={program.id}>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="text-gray-300 hover:text-white transition-colors line-clamp-1"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/programs"
                  className="text-eiba-gold hover:text-eiba-gold-light transition-colors font-medium"
                >
                  View All Programs →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Address information will be added here</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>Phone information will be added here</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>Email information will be added here</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} EBOMI International Bible Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


