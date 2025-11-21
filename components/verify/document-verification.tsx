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

  const handleVerify = () => {
    if (!documentType || !documentNumber) {
      setVerificationResult({
        valid: false,
        message: "Please fill in all required fields",
      });
      return;
    }

    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      // Mock verification - will be replaced with actual API call
      const isValid = documentNumber.length >= 8;
      setVerificationResult({
        valid: isValid,
        message: isValid
          ? "Document verified successfully"
          : "Document not found or invalid",
        details: isValid
          ? {
              documentType,
              documentNumber,
              issueDate: "2024-01-15",
              expiryDate: "2025-01-15",
              status: "Active",
            }
          : undefined,
      });
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Document</h2>
            <p className="text-gray-600">Enter document details to verify authenticity</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                id="documentType"
                value={documentType}
                onChange={(e) => {
                  setDocumentType(e.target.value);
                  setVerificationResult(null);
                }}
              >
                <option value="">Select document type</option>
                <option value="birth">Birth Certificate</option>
                <option value="land">Land Title/Certificate</option>
                <option value="tax">Tax Clearance Certificate</option>
                <option value="business">Business Registration</option>
                <option value="education">Educational Certificate</option>
                <option value="identity">Identity Card</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="documentNumber">Document Number</Label>
              <Input
                id="documentNumber"
                placeholder="Enter document number"
                value={documentNumber}
                onChange={(e) => {
                  setDocumentNumber(e.target.value);
                  setVerificationResult(null);
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

