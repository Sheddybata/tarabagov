"use client";

import { useState } from "react";
import { FileText, Search, Download, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function TAGISLandServices() {
  const [activeTab, setActiveTab] = useState("search");

  const services = [
    {
      id: "search",
      name: "Land Search",
      icon: Search,
      description: "Search for land records and ownership information",
    },
    {
      id: "registration",
      name: "Land Registration",
      icon: FileText,
      description: "Register new land titles and update existing records",
    },
    {
      id: "documents",
      name: "Document Requests",
      icon: Download,
      description: "Request land documents and certificates",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Service Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  activeTab === service.id
                    ? "border-taraba-green bg-taraba-green/5"
                    : "border-gray-200 hover:border-taraba-green/50"
                }`}
              >
                <Icon className={`h-6 w-6 mb-2 ${
                  activeTab === service.id ? "text-taraba-green" : "text-gray-400"
                }`} />
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {activeTab === "search" && <LandSearchForm />}
        {activeTab === "registration" && <LandRegistrationForm />}
        {activeTab === "documents" && <DocumentRequests />}
      </div>
    </div>
  );
}

function LandSearchForm() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Land Search</h2>
        <p className="text-gray-600">Search for land records using plot number, location, or owner name</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="searchType">Search Type</Label>
          <Select id="searchType" placeholder="Select search type">
            <option value="plot">Plot Number</option>
            <option value="location">Location/Address</option>
            <option value="owner">Owner Name</option>
            <option value="certificate">Certificate Number</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="searchValue">Search Value</Label>
          <Input id="searchValue" placeholder="Enter search term" />
        </div>
      </div>

      <Button className="w-full md:w-auto bg-taraba-green hover:bg-taraba-green-dark">
        <Search className="h-4 w-4 mr-2" />
        Search Land Records
      </Button>
    </div>
  );
}

function LandRegistrationForm() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Land Registration</h2>
        <p className="text-gray-600">Register new land titles or update existing land records</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="registrationType">Registration Type</Label>
          <Select id="registrationType" placeholder="Select type">
            <option value="new">New Land Title</option>
            <option value="transfer">Transfer of Ownership</option>
            <option value="update">Update Existing Record</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="plotNumber">Plot Number</Label>
          <Input id="plotNumber" placeholder="Enter plot number" />
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Enter location/address" />
        </div>
        
        <div>
          <Label htmlFor="area">Area (Square Meters)</Label>
          <Input id="area" type="number" placeholder="Enter area" />
        </div>
        
        <div>
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" placeholder="Enter owner name" />
        </div>
        
        <div>
          <Label htmlFor="ownerNIN">Owner NIN</Label>
          <Input id="ownerNIN" placeholder="Enter National Identification Number" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Additional details about the land" rows={4} />
      </div>
      
      <div>
        <Label htmlFor="documents">Upload Documents</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
        </div>
      </div>

      <Button className="w-full md:w-auto bg-taraba-green hover:bg-taraba-green-dark">
        <FileText className="h-4 w-4 mr-2" />
        Submit Registration
      </Button>
    </div>
  );
}

function DocumentRequests() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Requests</h2>
        <p className="text-gray-600">Request land documents and certificates</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="documentType">Document Type</Label>
          <Select id="documentType" placeholder="Select document type">
            <option value="certificate">Certificate of Occupancy</option>
            <option value="title">Land Title Deed</option>
            <option value="survey">Survey Plan</option>
            <option value="search">Land Search Report</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="plotNumberDoc">Plot Number</Label>
          <Input id="plotNumberDoc" placeholder="Enter plot number" />
        </div>
        
        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <Input id="purpose" placeholder="Purpose of request" />
        </div>
        
        <div>
          <Label htmlFor="deliveryMethod">Delivery Method</Label>
          <Select id="deliveryMethod" placeholder="Select delivery method">
            <option value="pickup">Pick Up at Office</option>
            <option value="email">Email</option>
            <option value="postal">Postal Service</option>
          </Select>
        </div>
      </div>

      <Button className="w-full md:w-auto bg-taraba-green hover:bg-taraba-green-dark">
        <Download className="h-4 w-4 mr-2" />
        Request Document
      </Button>
    </div>
  );
}

