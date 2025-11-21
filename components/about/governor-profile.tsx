"use client";

import Image from "next/image";
import { Award, Calendar, GraduationCap, Heart, Building2, Smartphone, Sprout, Users } from "lucide-react";

export function GovernorProfile() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden">
      <div className="relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative grid lg:grid-cols-[280px_1fr] gap-6 p-6 md:p-8">
          {/* Profile Photo Section - Compact */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative w-56 h-56 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-taraba-gold to-taraba-gold-dark rounded-full p-1">
                <div className="w-full h-full bg-gray-800 rounded-full p-1.5">
                  <div className="relative w-full h-full bg-gray-700 rounded-full overflow-hidden border-2 border-taraba-green">
                    <Image
                      src="/images/governor/governor-photo.jpg"
                      alt="Dr. Agbu Kefas, Governor of Taraba State"
                      width={220}
                      height={220}
                      className="object-cover rounded-full w-full h-full"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Official Badge - Compact */}
            <div className="bg-taraba-green/20 backdrop-blur-sm border border-taraba-gold/30 rounded-lg px-4 py-3 text-center w-full">
              <p className="text-taraba-gold text-sm font-semibold">His Excellency</p>
              <p className="text-white text-xs">Governor of Taraba State</p>
            </div>

            {/* Key Info Cards - Compact */}
            <div className="w-full mt-4 space-y-3">
              <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
                <Calendar className="h-5 w-5 text-taraba-gold flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">In Office</p>
                  <p className="text-white text-sm font-semibold truncate">May 29, 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3">
                <div className="relative h-12 w-12 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/governor/pdplogo(Nigeria).png"
                    alt="PDP Logo"
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Party</p>
                  <p className="text-white text-sm font-semibold truncate">PDP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information - Compact */}
          <div className="text-white flex flex-col">
            {/* Header - Compact */}
            <div className="mb-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dr. Agbu Kefas
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-2">Executive Governor of Taraba State</p>
              <div className="h-0.5 w-20 bg-gradient-to-r from-taraba-gold to-taraba-gold-dark rounded-full"></div>
            </div>

            {/* Biography - Compact */}
            <div className="mb-4 flex-1">
              <h3 className="text-lg font-semibold text-taraba-gold mb-2">
                About
              </h3>
              <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                <p>
                  Dr. Agbu Kefas is the Executive Governor of Taraba State, Nigeria. A dedicated public servant and 
                  visionary leader, he has committed his administration to transforming Taraba State through transparent 
                  governance, infrastructure development, and citizen-centered policies.
                </p>
                <p>
                  Under his leadership, the state has witnessed significant progress in education, healthcare, agriculture, 
                  and infrastructure. His administration's focus on digital transformation led to the creation of the 
                  Unified Citizen Portal, bringing government services closer to the people.
                </p>
                <p>
                  Dr. Kefas is known for his commitment to accountability, transparency, and inclusive governance. He 
                  continues to work tirelessly to improve the quality of life for all citizens of Taraba State and 
                  position the state as a model for sustainable development in Nigeria.
                </p>
              </div>
            </div>

            {/* Key Priorities - Compact Grid */}
            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-base font-semibold text-taraba-gold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Key Priorities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5 bg-gray-800/30 rounded-md px-2 py-1.5">
                  <GraduationCap className="h-4 w-4 text-taraba-gold flex-shrink-0" />
                  <span className="text-gray-300 text-xs">Education Reform</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/30 rounded-md px-2 py-1.5">
                  <Heart className="h-4 w-4 text-taraba-gold flex-shrink-0" />
                  <span className="text-gray-300 text-xs">Healthcare</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/30 rounded-md px-2 py-1.5">
                  <Building2 className="h-4 w-4 text-taraba-gold flex-shrink-0" />
                  <span className="text-gray-300 text-xs">Infrastructure</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/30 rounded-md px-2 py-1.5">
                  <Smartphone className="h-4 w-4 text-taraba-gold flex-shrink-0" />
                  <span className="text-gray-300 text-xs">Digital Transformation</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/30 rounded-md px-2 py-1.5">
                  <Sprout className="h-4 w-4 text-taraba-gold flex-shrink-0" />
                  <span className="text-gray-300 text-xs">Agriculture</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-800/30 rounded-md px-2 py-1.5">
                  <Users className="h-4 w-4 text-taraba-gold flex-shrink-0" />
                  <span className="text-gray-300 text-xs">Youth Empowerment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

