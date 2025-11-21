"use client";

import { Target, Eye } from "lucide-react";

export function VisionMission() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Vision Card */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Eye className="h-10 w-10 text-taraba-green" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">VISION</h2>
            <p className="text-gray-700 leading-relaxed">
              To build a prosperous, united, and secure Taraba State that is a model for growth, 
              economic diversification, and sustainable development in Nigeria.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Target className="h-10 w-10 text-taraba-green" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">MISSION</h2>
            <p className="text-gray-700 leading-relaxed">
              To harness our rich resources and human capital to create a peaceful and thriving 
              state through transparent governance, infrastructure development, and social inclusion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

