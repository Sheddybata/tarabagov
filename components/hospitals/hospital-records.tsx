"use client";

import { useState } from "react";
import { Search, Heart, MapPin, Phone, Mail, Building2, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function HospitalRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");

  // Mock data - will be replaced with Supabase data later
  const hospitals = [
    {
      id: 1,
      name: "Federal Medical Centre, Jalingo",
      type: "Tertiary",
      lga: "Jalingo",
      address: "Jalingo, Taraba State",
      phone: "0803 123 4567",
      email: "info@fmcjalingo.gov.ng",
      beds: 250,
      specialties: ["General Medicine", "Surgery", "Pediatrics"],
      status: "Active",
    },
    {
      id: 2,
      name: "Taraba State Specialist Hospital",
      type: "Secondary",
      lga: "Jalingo",
      address: "Jalingo, Taraba State",
      phone: "0803 234 5678",
      email: "info@tssh.gov.ng",
      beds: 150,
      specialties: ["Cardiology", "Orthopedics", "Maternity"],
      status: "Active",
    },
    {
      id: 3,
      name: "Wukari General Hospital",
      type: "Secondary",
      lga: "Wukari",
      address: "Wukari, Taraba State",
      phone: "0803 345 6789",
      email: "info@wukarigh.gov.ng",
      beds: 100,
      specialties: ["General Medicine", "Emergency Care"],
      status: "Active",
    },
    {
      id: 4,
      name: "Takum General Hospital",
      type: "Secondary",
      lga: "Takum",
      address: "Takum Town, Takum",
      phone: "0802 178 2214",
      email: "info@takumgh.gov.ng",
      beds: 80,
      specialties: ["General Medicine", "Maternity", "Pediatrics"],
      status: "Active",
    },
    {
      id: 5,
      name: "Gembu Primary Health Centre",
      type: "Primary",
      lga: "Sardauna",
      address: "Gembu Town, Sardauna",
      phone: "0805 112 9988",
      email: "info@gembuphc.gov.ng",
      beds: 30,
      specialties: ["General Medicine", "Maternity"],
      status: "Active",
    },
    {
      id: 6,
      name: "Mutum Biyu Health Centre",
      type: "Primary",
      lga: "Gassol",
      address: "Mutum Biyu, Gassol",
      phone: "0807 334 5566",
      email: "info@mutumbiyuhc.gov.ng",
      beds: 25,
      specialties: ["General Medicine"],
      status: "Active",
    },
  ];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLGA = !selectedLGA || hospital.lga === selectedLGA;
    return matchesSearch && matchesLGA;
  });

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="search">Search Hospitals</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by hospital name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="lga">Local Government Area</Label>
            <Select
              id="lga"
              value={selectedLGA}
              onChange={(e) => setSelectedLGA(e.target.value)}
            >
              <option value="">All LGAs</option>
              <option value="Jalingo">Jalingo</option>
              <option value="Wukari">Wukari</option>
              <option value="Takum">Takum</option>
              <option value="Sardauna">Sardauna</option>
              <option value="Gassol">Gassol</option>
              <option value="Gashaka">Gashaka</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? "s" : ""} Found
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded">
                      {hospital.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{hospital.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{hospital.beds} Beds</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-700">Specialties:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {hospital.specialties.map((specialty, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <span className={`inline-block px-2 py-1 text-xs rounded ${
                  hospital.status === "Active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {hospital.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

