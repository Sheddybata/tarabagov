import { TopHeader } from "@/components/landing/top-header";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { FAQ } from "@/components/contact/faq";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <Navbar />
      <main className="py-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with Taraba State Government. We're here to help and answer any questions you may have.
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-taraba-green rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600 text-sm">
                Government House<br />
                Jalingo, Taraba State<br />
                Nigeria
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-taraba-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 text-sm">
                +234 (0) 123 456 7890<br />
                +234 (0) 123 456 7891
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-taraba-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">
                info@tarabastate.gov.ng<br />
                support@tarabastate.gov.ng
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-taraba-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
              <p className="text-gray-600 text-sm">
                Monday - Friday<br />
                8:00 AM - 6:00 PM
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="h-6 w-6 text-taraba-green" />
                  <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                </div>
                <ContactForm />
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <FAQ />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

