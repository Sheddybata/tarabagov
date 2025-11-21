"use client";

import { useState } from "react";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Award, 
  TrendingUp, 
  BookOpen,
  Landmark,
  Mountain,
  Droplet,
  Sprout,
  Building2,
  Scale,
  UsersRound
} from "lucide-react";
import Image from "next/image";

const sections = [
  {
    id: "history",
    title: "History",
    icon: BookOpen,
    color: "text-taraba-green",
    bgColor: "bg-taraba-green/10",
    borderColor: "border-taraba-green",
  },
  {
    id: "geography",
    title: "Geography",
    icon: Mountain,
    color: "text-taraba-green",
    bgColor: "bg-taraba-green/10",
    borderColor: "border-taraba-green",
  },
  {
    id: "demographics",
    title: "Demographics",
    icon: Users,
    color: "text-taraba-green",
    bgColor: "bg-taraba-green/10",
    borderColor: "border-taraba-green",
  },
  {
    id: "economy",
    title: "Economy",
    icon: TrendingUp,
    color: "text-taraba-green",
    bgColor: "bg-taraba-green/10",
    borderColor: "border-taraba-green",
  },
  {
    id: "culture",
    title: "Culture & Heritage",
    icon: Award,
    color: "text-taraba-green",
    bgColor: "bg-taraba-green/10",
    borderColor: "border-taraba-green",
  },
  {
    id: "government",
    title: "Government",
    icon: Landmark,
    color: "text-taraba-green",
    bgColor: "bg-taraba-green/10",
    borderColor: "border-taraba-green",
  },
];

export function AboutContent() {
  const [activeTab, setActiveTab] = useState("history");

  const renderContent = () => {
    switch (activeTab) {
      case "history":
        return (
          <div className="relative rounded-xl overflow-hidden min-h-[500px]">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/abouttarabastate/History/backgroundimage.jpg')"
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/90 via-taraba-green/80 to-taraba-green/90"></div>
            </div>
            {/* Content */}
            <div className="relative z-10 p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">State Creation</h3>
                  <p className="text-white/95">
                    Taraba State was created on <span className="font-semibold">August 27, 1991</span>, during the military administration of General Ibrahim Babangida. 
                    The state was carved out of the former Gongola State, along with Adamawa State. The name "Taraba" is derived 
                    from the Taraba River, which flows through the state.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Capital City</h3>
                  <p className="text-white/95">
                    Jalingo, the state capital, was established as the administrative center and has since grown into a vibrant 
                    city that serves as the hub of government activities, commerce, and culture in the state.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Cultural Diversity</h3>
                  <p className="text-white/95">
                    Taraba State is known for its rich cultural heritage, diverse ethnic groups, and abundant natural resources. 
                    The state is home to <span className="font-semibold">over 80 ethnic groups</span>, each with its unique traditions, languages, and customs, making 
                    it one of the most culturally diverse states in Nigeria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "geography":
        return (
          <div className="space-y-6">
            {/* Background Image Section */}
            <div className="relative rounded-xl overflow-hidden min-h-[200px]">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/abouttarabastate/Geography/geography.png')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/60 to-taraba-green/40"></div>
              </div>
              <div className="relative z-10 p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Geographic Overview</h3>
                <p className="text-white/95 max-w-2xl mx-auto">
                  Taraba State's diverse landscape includes plateaus, rivers, and fertile plains that support agriculture and natural resources.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden backdrop-blur-md bg-white/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-taraba-green/20 rounded-lg">
                    <MapPin className="h-6 w-6 text-taraba-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Location & Size</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Taraba State is located in the northeastern part of Nigeria and covers an area of approximately 
                  <span className="font-semibold"> 54,473 square kilometers</span>.
                </p>
                <div className="mt-4 pt-4 border-t border-taraba-green/30">
                  <p className="text-sm font-medium text-gray-700 mb-2">Borders:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Plateau State (West)</li>
                    <li>• Bauchi & Gombe States (North)</li>
                    <li>• Adamawa State (East)</li>
                    <li>• Cross River & Benue States (South)</li>
                  </ul>
                </div>
              </div>
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden backdrop-blur-md bg-white/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-taraba-green/20 rounded-lg">
                    <Mountain className="h-6 w-6 text-taraba-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  The state is blessed with diverse geographical features, including the <span className="font-semibold">Mambilla Plateau</span>, 
                  which is one of the highest points in Nigeria, rising to over <span className="font-semibold">1,800 meters</span> above sea level.
                </p>
                <div className="mt-4 pt-4 border-t border-taraba-green/30">
                  <p className="text-sm font-medium text-gray-700 mb-2">Major Rivers:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Benue River</li>
                    <li>• Taraba River</li>
                    <li>• Donga River</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "demographics":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-8 bg-gradient-to-br from-taraba-green/10 to-taraba-green/5 rounded-xl border-2 border-taraba-green/30">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-taraba-green/20 rounded-full">
                    <Users className="h-12 w-12 text-taraba-green" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-taraba-green mb-2">3.2M+</div>
                <div className="text-gray-700 font-medium">Population</div>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-taraba-green/10 to-taraba-green/5 rounded-xl border-2 border-taraba-green/30">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-taraba-green/20 rounded-full">
                    <Building2 className="h-12 w-12 text-taraba-green" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-taraba-green mb-2">16</div>
                <div className="text-gray-700 font-medium">Local Government Areas</div>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-taraba-green/10 to-taraba-green/5 rounded-xl border-2 border-taraba-green/30">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-taraba-green/20 rounded-full">
                    <UsersRound className="h-12 w-12 text-taraba-green" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-taraba-green mb-2">80+</div>
                <div className="text-gray-700 font-medium">Ethnic Groups</div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-taraba-green/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Population Overview</h3>
              <p className="text-gray-700 mb-4">
                Taraba State has a population of over <span className="font-semibold">3.2 million people</span>, according to the latest census data. 
                The state is divided into <span className="font-semibold">16 Local Government Areas (LGAs)</span>, each with its unique characteristics 
                and administrative structure.
              </p>
              <div className="mt-4 pt-4 border-t border-taraba-green/30">
                <p className="text-sm font-medium text-gray-700 mb-2">Major Ethnic Groups:</p>
                <div className="flex flex-wrap gap-2">
                  {["Jukun", "Tiv", "Kuteb", "Chamba", "Mambilla", "Wurkum"].map((group) => (
                    <span key={group} className="px-3 py-1 bg-taraba-green/10 text-taraba-green rounded-full text-sm font-medium border border-taraba-green/30">
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "economy":
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden min-h-[300px]">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/abouttarabastate/Economy/agriculture.png')"
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/85 via-taraba-green/75 to-taraba-green/85"></div>
                </div>
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Sprout className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Agriculture</h3>
                  </div>
                  <p className="text-white/95 mb-3 flex-1">
                    Taraba State's economy is primarily based on agriculture, with the majority of the population engaged in 
                    farming activities.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <p className="text-sm font-medium text-white mb-2">Key Crops:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Rice", "Maize", "Yam", "Cassava", "Groundnuts"].map((crop) => (
                        <span key={crop} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden min-h-[300px]">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/abouttarabastate/Economy/Natural Resources.png')"
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/85 via-taraba-green/75 to-taraba-green/85"></div>
                </div>
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Mountain className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Natural Resources</h3>
                  </div>
                  <p className="text-white/95 mb-3 flex-1">
                    The state has significant mineral resources, including limestone, kaolin, and other industrial minerals. 
                    The Mambilla Plateau is known for its potential for hydroelectric power generation and tourism development.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <p className="text-sm font-medium text-white mb-2">Minerals:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Limestone", "Kaolin", "Hydroelectric Power"].map((resource) => (
                        <span key={resource} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-taraba-green/30">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-taraba-green" />
                <h3 className="text-lg font-semibold text-gray-900">Economic Diversification</h3>
              </div>
              <p className="text-gray-700">
                In recent years, the state government has been working to diversify the economy by promoting tourism, 
                developing infrastructure, and attracting investments in various sectors.
              </p>
            </div>
          </div>
        );

      case "culture":
        return (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-taraba-green/10 to-taraba-green/5 rounded-xl border border-taraba-green/30">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-taraba-green" />
                <h3 className="text-lg font-semibold text-gray-900">Cultural Heritage</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Taraba State is renowned for its rich cultural heritage and diversity. The state hosts numerous cultural 
                festivals throughout the year, celebrating the traditions and customs of its various ethnic groups.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden min-h-[320px]">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/abouttarabastate/Cultureandheritage/NotableFestivals.jpg')"
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/85 via-taraba-green/75 to-taraba-green/85"></div>
                </div>
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-4">Notable Festivals</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg mt-0.5">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-base">Nwonyo Fishing Festival</p>
                        <p className="text-sm text-white/90">Celebrating traditional fishing practices</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg mt-0.5">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-base">Mambilla Cultural Festival</p>
                        <p className="text-sm text-white/90">Showcasing Mambilla traditions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg mt-0.5">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white text-base">Harvest Festivals</p>
                        <p className="text-sm text-white/90">Community celebrations across the state</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden min-h-[320px]">
                {/* Background Video */}
                <video
                  src="/images/abouttarabastate/Cultureandheritage/TraditionalCrafts.mp4"
                  autoPlay
                  loop
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/85 via-taraba-green/75 to-taraba-green/85"></div>
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-white mb-4">Traditional Crafts</h3>
                  <p className="text-white/95 mb-4 text-base">
                    The state is also home to several historical sites and monuments that reflect its rich history and cultural 
                    significance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Pottery", "Weaving", "Blacksmithing", "Wood Carving"].map((craft) => (
                      <span key={craft} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                        {craft}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "government":
        return (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-taraba-green/10 to-taraba-green/5 rounded-xl border border-taraba-green/30">
              <div className="flex items-center gap-3 mb-4">
                <Landmark className="h-6 w-6 text-taraba-green" />
                <h3 className="text-lg font-semibold text-gray-900">Government Structure</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Taraba State operates under a democratic system of government with three arms: the Executive, led by the 
                Governor; the Legislative, represented by the State House of Assembly; and the Judiciary, headed by the 
                Chief Judge.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden min-h-[300px] text-center">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/abouttarabastate/Government/executive.png')"
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/85 via-taraba-green/75 to-taraba-green/85"></div>
                </div>
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg w-fit mb-4">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Executive</h3>
                  <p className="text-sm text-white/90">Led by the Governor</p>
                </div>
              </div>
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden min-h-[300px] text-center">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/abouttarabastate/Government/legislative.png')"
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/85 via-taraba-green/75 to-taraba-green/85"></div>
                </div>
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg w-fit mb-4">
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Legislative</h3>
                  <p className="text-sm text-white/90">State House of Assembly</p>
                </div>
              </div>
              <div className="relative p-6 rounded-xl border border-taraba-green/30 overflow-hidden min-h-[300px] text-center">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/images/abouttarabastate/Government/judiciary.png')"
                  }}
                >
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-taraba-green/85 via-taraba-green/75 to-taraba-green/85"></div>
                </div>
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg w-fit mb-4">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Judiciary</h3>
                  <p className="text-sm text-white/90">Headed by the Chief Judge</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-taraba-green/30">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Governance Principles</h3>
              <p className="text-gray-700 mb-4">
                The state government is committed to promoting transparency, accountability, and citizen participation in 
                governance. The Unified Citizen Portal is one of the initiatives aimed at bringing government services 
                closer to the people and improving service delivery.
              </p>
              <div className="mt-4 pt-4 border-t border-taraba-green/30">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Focus Areas:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {["Infrastructure Development", "Education", "Healthcare", "Agriculture", "Economic Diversification"].map((area) => (
                    <div key={area} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-taraba-green rounded-full"></div>
                      <span className="text-sm text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">About Taraba State</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the rich history, diverse culture, and vibrant economy of Taraba State
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
                  ${isActive 
                    ? `${section.bgColor} ${section.borderColor} border-2 ${section.color} shadow-md` 
                    : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? section.color : 'text-gray-400'}`} />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
}
