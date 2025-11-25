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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const registrationType = formData.get("registrationType") as string;
    const plotNumber = formData.get("plotNumber") as string;
    const location = formData.get("location") as string;
    const ownerName = formData.get("ownerName") as string;
    const description = formData.get("description") as string;

    if (!registrationType || !ownerName) {
      setError("Registration type and owner name are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        request_type: registrationType,
        applicant_name: ownerName,
        plot_number: plotNumber || null,
        location_description: location || null,
        notes: description || null,
      };

      const submitFormData = new FormData();
      submitFormData.append("payload", JSON.stringify(payload));

      const documents = formData.getAll("documents") as File[];
      documents.forEach((doc) => {
        if (doc.size > 0) {
          submitFormData.append("documents", doc);
        }
      });

      const response = await fetch("/api/land-services", {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit registration");
      }

      setReferenceId(result.referenceId);
      setSubmitSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess && referenceId) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-taraba-green mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Submitted Successfully</h3>
        <p className="text-gray-600 mb-4">Your land registration request has been received.</p>
        <div className="bg-taraba-green/10 border border-taraba-green rounded-lg p-4 inline-block">
          <p className="text-sm font-semibold text-gray-700 mb-1">Reference ID</p>
          <p className="text-lg font-bold text-taraba-green">{referenceId}</p>
        </div>
        <Button
          onClick={() => {
            setSubmitSuccess(false);
            setReferenceId(null);
          }}
          className="mt-4 bg-taraba-green hover:bg-taraba-green-dark"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Land Registration</h2>
        <p className="text-gray-600">Register new land titles or update existing land records</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="registrationType">Registration Type <span className="text-red-500">*</span></Label>
          <Select id="registrationType" name="registrationType" required>
            <option value="">Select type</option>
            <option value="new">New Land Title</option>
            <option value="transfer">Transfer of Ownership</option>
            <option value="update">Update Existing Record</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="plotNumber">Plot Number</Label>
          <Input id="plotNumber" name="plotNumber" placeholder="Enter plot number" />
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Enter location/address" />
        </div>
        
        <div>
          <Label htmlFor="ownerName">Owner Name <span className="text-red-500">*</span></Label>
          <Input id="ownerName" name="ownerName" placeholder="Enter owner name" required />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Additional details about the land" rows={4} />
      </div>
      
      <div>
        <Label htmlFor="documents">Upload Documents</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB per file)</p>
          <input
            type="file"
            id="documents"
            name="documents"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-4 mx-auto"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto bg-taraba-green hover:bg-taraba-green-dark"
      >
        {isSubmitting ? "Submitting..." : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Submit Registration
          </>
        )}
      </Button>
    </form>
  );
}

function DocumentRequests() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const documentType = formData.get("documentType") as string;
    const applicantName = formData.get("applicantName") as string;
    const plotNumber = formData.get("plotNumberDoc") as string;
    const purpose = formData.get("purpose") as string;

    if (!documentType || !applicantName) {
      setError("Document type and applicant name are required");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        request_type: `document_request_${documentType}`,
        applicant_name: applicantName,
        plot_number: plotNumber || null,
        notes: purpose || null,
      };

      const submitFormData = new FormData();
      submitFormData.append("payload", JSON.stringify(payload));

      const documents = formData.getAll("documents") as File[];
      documents.forEach((doc) => {
        if (doc.size > 0) {
          submitFormData.append("documents", doc);
        }
      });

      const response = await fetch("/api/land-services", {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit document request");
      }

      setReferenceId(result.referenceId);
      setSubmitSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit document request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess && referenceId) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-taraba-green mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted Successfully</h3>
        <p className="text-gray-600 mb-4">Your document request has been received.</p>
        <div className="bg-taraba-green/10 border border-taraba-green rounded-lg p-4 inline-block">
          <p className="text-sm font-semibold text-gray-700 mb-1">Reference ID</p>
          <p className="text-lg font-bold text-taraba-green">{referenceId}</p>
        </div>
        <Button
          onClick={() => {
            setSubmitSuccess(false);
            setReferenceId(null);
          }}
          className="mt-4 bg-taraba-green hover:bg-taraba-green-dark"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Requests</h2>
        <p className="text-gray-600">Request land documents and certificates</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="documentType">Document Type <span className="text-red-500">*</span></Label>
          <Select id="documentType" name="documentType" required>
            <option value="">Select document type</option>
            <option value="certificate">Certificate of Occupancy</option>
            <option value="title">Land Title Deed</option>
            <option value="survey">Survey Plan</option>
            <option value="search">Land Search Report</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="applicantName">Applicant Name <span className="text-red-500">*</span></Label>
          <Input id="applicantName" name="applicantName" placeholder="Enter your full name" required />
        </div>
        
        <div>
          <Label htmlFor="plotNumberDoc">Plot Number</Label>
          <Input id="plotNumberDoc" name="plotNumberDoc" placeholder="Enter plot number" />
        </div>
        
        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <Input id="purpose" name="purpose" placeholder="Purpose of request" />
        </div>
      </div>

      <div>
        <Label htmlFor="documents">Supporting Documents (Optional)</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB per file)</p>
          <input
            type="file"
            id="documents"
            name="documents"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-4 mx-auto"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto bg-taraba-green hover:bg-taraba-green-dark"
      >
        {isSubmitting ? "Submitting..." : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Request Document
          </>
        )}
      </Button>
    </form>
  );
}

