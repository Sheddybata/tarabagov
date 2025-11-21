"use client";

import { useState } from "react";
import { Search, GraduationCap, MapPin, Users, BookOpen, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function SchoolRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");

  // Mock data - will be replaced with Supabase data later
  const schools = [
    {
      id: 1,
      name: "Government Secondary School, Jalingo",
      type: "Secondary",
      lga: "Jalingo",
      address: "No. 15, Wukari Road, Jalingo",
      students: 1250,
      teachers: 45,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 2,
      name: "St. Mary's Primary School, Wukari",
      type: "Primary",
      lga: "Wukari",
      address: "Wukari Central, Wukari",
      students: 850,
      teachers: 28,
      status: "Active",
      ownership: "Mission",
    },
    {
      id: 3,
      name: "Taraba State University, Jalingo",
      type: "Tertiary",
      lga: "Jalingo",
      address: "Taraba State University Main Campus, Jalingo",
      students: 5200,
      teachers: 210,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 4,
      name: "Federal University, Wukari",
      type: "Tertiary",
      lga: "Wukari",
      address: "Katsina-Ala Road, Wukari",
      students: 7800,
      teachers: 320,
      status: "Active",
      ownership: "Federal",
    },
    {
      id: 5,
      name: "Kwararafa University, Wukari",
      type: "Tertiary",
      lga: "Wukari",
      address: "Km 7, Jalingo Road, Wukari",
      students: 2300,
      teachers: 120,
      status: "Active",
      ownership: "Private",
    },
    {
      id: 6,
      name: "Takum Model Primary School",
      type: "Primary",
      lga: "Takum",
      address: "Takum Town, Takum",
      students: 620,
      teachers: 22,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 7,
      name: "Gembu Secondary School",
      type: "Secondary",
      lga: "Sardauna",
      address: "Gembu Town, Sardauna",
      students: 980,
      teachers: 38,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 8,
      name: "Federal Government College, Wukari",
      type: "Secondary",
      lga: "Wukari",
      address: "Wukari, Taraba State",
      students: 1500,
      teachers: 55,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 9,
      name: "College of Education, Zing",
      type: "College",
      lga: "Zing",
      address: "College Road, Zing",
      students: 3100,
      teachers: 160,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 10,
      name: "Taraba State College of Agriculture, Jalingo",
      type: "College",
      lga: "Jalingo",
      address: "Mile Six, Jalingo",
      students: 2400,
      teachers: 110,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 11,
      name: "Taraba State College of Health Technology, Takum",
      type: "College",
      lga: "Takum",
      address: "Hospital Road, Takum",
      students: 1800,
      teachers: 95,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 12,
      name: "Taraba State College of Nursing and Midwifery",
      type: "College",
      lga: "Jalingo",
      address: "Opp. Specialist Hospital, Jalingo",
      students: 950,
      teachers: 60,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 13,
      name: "Peacock College of Education, Jalingo",
      type: "College",
      lga: "Jalingo",
      address: "Along Wukari Road, Jalingo",
      students: 750,
      teachers: 48,
      status: "Active",
      ownership: "Private",
    },
    {
      id: 14,
      name: "Muwanshat College of Health Science and Technology",
      type: "College",
      lga: "Jalingo",
      address: "Mayodasa Layout, Jalingo",
      students: 620,
      teachers: 40,
      status: "Active",
      ownership: "Private",
    },
    {
      id: 15,
      name: "College of Health Sciences and Technology, Mutum Biyu",
      type: "College",
      lga: "Gassol",
      address: "Mutum Biyu, Gassol",
      students: 680,
      teachers: 42,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 16,
      name: "De-Champions College of Health Science and Technology, Lau",
      type: "College",
      lga: "Lau",
      address: "Lau Town, Lau",
      students: 540,
      teachers: 36,
      status: "Active",
      ownership: "Private",
    },
    {
      id: 17,
      name: "Federal Polytechnic, Bali",
      type: "Polytechnic",
      lga: "Bali",
      address: "Km 1, Bali-Jalingo Road, Bali",
      students: 4200,
      teachers: 185,
      status: "Active",
      ownership: "Federal",
    },
    {
      id: 18,
      name: "Taraba State Polytechnic, Suntai",
      type: "Polytechnic",
      lga: "Donga",
      address: "Suntai Campus, Donga",
      students: 3600,
      teachers: 150,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 19,
      name: "Government Day Senior Secondary School, Garba Chede",
      type: "Secondary",
      lga: "Bali",
      address: "Garba Chede Town, Bali",
      students: 920,
      teachers: 46,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 20,
      name: "Government Day Senior Secondary School, Jen",
      type: "Secondary",
      lga: "Karim Lamido",
      address: "Jen Community, Karim Lamido",
      students: 780,
      teachers: 38,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 21,
      name: "Government Day Technical Secondary School, Lankaviri",
      type: "Technical",
      lga: "Lau",
      address: "Lankaviri, Lau",
      students: 650,
      teachers: 34,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 22,
      name: "Government College Senior Secondary School, Jalingo",
      type: "Secondary",
      lga: "Jalingo",
      address: "Hamaruna Way, Jalingo",
      students: 1100,
      teachers: 52,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 23,
      name: "Government Secondary School (Senior), Karim Lamido",
      type: "Secondary",
      lga: "Karim Lamido",
      address: "Angwan Ahmadu, Karim Lamido",
      students: 870,
      teachers: 43,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 24,
      name: "Government Senior School of Arabic & Islamic Studies, Jalingo",
      type: "Secondary",
      lga: "Jalingo",
      address: "Central Jalingo",
      students: 640,
      teachers: 41,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 25,
      name: "Government Day Secondary School, Bantaje",
      type: "Secondary",
      lga: "Wukari",
      address: "Bantaje Community, Wukari",
      students: 720,
      teachers: 35,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 26,
      name: "Government Day Secondary School, War War",
      type: "Secondary",
      lga: "Takum",
      address: "War War Village, Takum",
      students: 600,
      teachers: 32,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 27,
      name: "Government Day Secondary School, Gembu",
      type: "Secondary",
      lga: "Sardauna",
      address: "Ahmadu Bello Way, Gembu",
      students: 840,
      teachers: 39,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 28,
      name: "Government Day Senior Secondary School, Kente",
      type: "Secondary",
      lga: "Wukari",
      address: "Kente Village, Wukari",
      students: 580,
      teachers: 30,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 29,
      name: "Federal Government Girls College, Jalingo",
      type: "Secondary",
      lga: "Jalingo",
      address: "FGGC Road, Jalingo",
      students: 1900,
      teachers: 85,
      status: "Active",
      ownership: "Federal",
    },
    {
      id: 30,
      name: "Government Science Senior Secondary School, Nyabu Kaka",
      type: "Secondary",
      lga: "Jalingo",
      address: "Nyabu Kaka, Jalingo",
      students: 760,
      teachers: 37,
      status: "Active",
      ownership: "Public",
    },
    {
      id: 31,
      name: "Government Senior Secondary School, Zing",
      type: "Secondary",
      lga: "Zing",
      address: "Government Lodge Street, Zing",
      students: 810,
      teachers: 36,
      status: "Active",
      ownership: "Public",
    },
  ];

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLGA = !selectedLGA || school.lga === selectedLGA;
    return matchesSearch && matchesLGA;
  });

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="search">Search Schools</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by school name or address..."
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
              <option value="Gashaka">Gashaka</option>
              <option value="Gassol">Gassol</option>
              <option value="Karim Lamido">Karim Lamido</option>
              <option value="Zing">Zing</option>
              <option value="Lau">Lau</option>
              <option value="Bali">Bali</option>
              <option value="Donga">Donga</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredSchools.length} School{filteredSchools.length !== 1 ? "s" : ""} Found
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <div key={school.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{school.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      {school.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{school.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{school.students.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span>{school.teachers} Teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>{school.lga} LGA</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <span className={`inline-block px-2 py-1 text-xs rounded ${
                  school.status === "Active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {school.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

