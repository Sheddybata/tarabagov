"use client";

import { useState } from "react";
import { FileCheck, Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function DocumentVerification() {
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [applicantName, setApplicantName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!documentType || !documentNumber || !applicantName) {
      setVerificationResult({
        valid: false,
        message: "Please fill in all required fields",
      });
      setError("Document type, number, and applicant name are required");
      return;
    }

    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);

    try {
      const payload = {
        document_type: documentType,
        document_number: documentNumber,
        applicant_name: applicantName,
        phone: phone || null,
        email: email || null,
      };

      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));

      const response = await fetch("/api/document-verifications", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit verification request");
      }

      setReferenceId(result.referenceId);
      setSubmitSuccess(true);
      setVerificationResult({
        valid: true,
        message: "Verification request submitted successfully. Your request is being processed.",
        details: {
          documentType,
          documentNumber,
          referenceId: result.referenceId,
          status: "Pending Review",
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit verification request");
      setVerificationResult({
        valid: false,
        message: err.message || "Failed to submit verification request",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Document</h2>
            <p className="text-gray-600">Enter document details to verify authenticity</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="documentType">Document Type <span className="text-red-500">*</span></Label>
              <Select
                id="documentType"
                value={documentType}
                onChange={(e) => {
                  setDocumentType(e.target.value);
                  setVerificationResult(null);
                  setError(null);
                }}
                required
              >
                <option value="">Select document type</option>
                <option value="birth_certificate">Birth Certificate</option>
                <option value="land_title">Land Title/Certificate</option>
                <option value="tax_clearance">Tax Clearance Certificate</option>
                <option value="business_registration">Business Registration</option>
                <option value="educational_certificate">Educational Certificate</option>
                <option value="identity_card">Identity Card</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="documentNumber">Document Number <span className="text-red-500">*</span></Label>
              <Input
                id="documentNumber"
                placeholder="Enter document number"
                value={documentNumber}
                onChange={(e) => {
                  setDocumentNumber(e.target.value);
                  setVerificationResult(null);
                  setError(null);
                }}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="applicantName">Applicant Name <span className="text-red-500">*</span></Label>
              <Input
                id="applicantName"
                placeholder="Enter your full name"
                value={applicantName}
                onChange={(e) => {
                  setApplicantName(e.target.value);
                  setVerificationResult(null);
                  setError(null);
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="08021782214"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setVerificationResult(null);
                  setError(null);
                }}
                maxLength={11}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setVerificationResult(null);
                  setError(null);
                }}
              />
            </div>
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isVerifying ? (
              <>Verifying...</>
            ) : (
              <>
                <FileCheck className="h-4 w-4 mr-2" />
                Verify Document
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div
          className={`rounded-lg shadow-md p-6 ${
            verificationResult.valid
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start gap-4">
            {verificationResult.valid ? (
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3
                className={`font-semibold mb-2 ${
                  verificationResult.valid ? "text-green-900" : "text-red-900"
                }`}
              >
                {verificationResult.message}
              </h3>
              {verificationResult.details && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Document Type:</span>
                      <p className="text-gray-600 capitalize">{verificationResult.details.documentType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Document Number:</span>
                      <p className="text-gray-600">{verificationResult.details.documentNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Issue Date:</span>
                      <p className="text-gray-600">{verificationResult.details.issueDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expiry Date:</span>
                      <p className="text-gray-600">{verificationResult.details.expiryDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-600">{verificationResult.details.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">About Document Verification</p>
            <p className="text-sm text-blue-700">
              This service allows you to verify the authenticity of official documents issued by the Taraba State Government. 
              Enter the document type and number to check if the document is valid and active in our records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

