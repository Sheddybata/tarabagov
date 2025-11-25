"use client";

import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function SocialServices() {

  // Removed utility bills - only enrollment is needed

  return (
    <div className="space-y-8">
      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <BeneficiaryPrograms />
      </div>
    </div>
  );
}

function BeneficiaryPrograms() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const response = await fetch("/api/social-programs?active_only=true");
        const result = await response.json();
        if (result.data) {
          setPrograms(result.data);
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoadingPrograms(false);
      }
    }
    fetchPrograms();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const programType = formData.get("programType") as string;
    const fullName = formData.get("fullName") as string;
    const nin = formData.get("nin") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const lga = formData.get("lga") as string;
    const address = formData.get("address") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const reason = formData.get("reason") as string;

    if (!programType || !fullName) {
      setError("Program type and full name are required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Find the program name from the code
      const selectedProgram = programs.find((p) => p.code === programType);
      const programName = selectedProgram ? selectedProgram.name : programType;

      const payload = {
        program_type: programName, // Store the program name in the database
        program_code: programType, // Also store the code for reference
        applicant_name: fullName,
        nin: nin || null,
        applicant_phone: phone || null,
        applicant_email: email || null,
        lga: lga || null,
        address: address || null,
        date_of_birth: dateOfBirth || null,
        reason: reason || null,
      };

      const submitFormData = new FormData();
      submitFormData.append("payload", JSON.stringify(payload));

      const documents = formData.getAll("documents") as File[];
      documents.forEach((doc) => {
        if (doc.size > 0) {
          submitFormData.append("documents", doc);
        }
      });

      const response = await fetch("/api/social-services", {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setReferenceId(result.referenceId);
      setSubmitSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess && referenceId) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted Successfully</h3>
        <p className="text-gray-600 mb-4">Your beneficiary program application has been received.</p>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 inline-block">
          <p className="text-sm font-semibold text-gray-700 mb-1">Reference ID</p>
          <p className="text-lg font-bold text-orange-600">{referenceId}</p>
        </div>
        <Button
          onClick={() => {
            setSubmitSuccess(false);
            setReferenceId(null);
          }}
          className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
        >
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Beneficiary Program Enrollment</h2>
        <p className="text-gray-600">Apply for social welfare and beneficiary programs</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="programType">Program Type <span className="text-red-500">*</span></Label>
          <Select id="programType" name="programType" required disabled={loadingPrograms}>
            <option value="">{loadingPrograms ? "Loading programs..." : "Select program"}</option>
            {programs.map((program) => (
              <option key={program.id} value={program.code}>
                {program.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
          <Input id="fullName" name="fullName" placeholder="Enter full name" required />
        </div>

        <div>
          <Label htmlFor="nin">National Identification Number (NIN)</Label>
          <Input id="nin" name="nin" placeholder="Enter NIN" maxLength={11} />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="08021782214" maxLength={11} />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="Enter email address" />
        </div>

        <div>
          <Label htmlFor="lga">Local Government Area</Label>
          <Select id="lga" name="lga">
            <option value="">Select LGA</option>
            <option value="jalingo">Jalingo</option>
            <option value="wukari">Wukari</option>
            <option value="takum">Takum</option>
            <option value="sardauna">Sardauna</option>
            <option value="gashaka">Gashaka</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" placeholder="Enter residential address" />
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" />
        </div>
      </div>

      <div>
        <Label htmlFor="reason">Reason for Application</Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Explain why you are applying for this program..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="documents">Supporting Documents</Label>
        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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
        className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white"
      >
        {isSubmitting ? "Submitting..." : (
          <>
            <Users className="h-4 w-4 mr-2" />
            Submit Application
          </>
        )}
      </Button>
    </form>
  );
}


