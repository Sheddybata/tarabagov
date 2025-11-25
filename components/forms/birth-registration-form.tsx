"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload, CheckCircle2, AlertCircle } from "lucide-react";

// Step 1: Child Details Schema
const childDetailsSchema = z.object({
  childName: z.string().min(2, "Child's name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select gender",
  }),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  birthType: z.enum(["Hospital", "Home"], {
    required_error: "Please select birth type",
  }),
  birthLocation: z.string().min(2, "Birth location is required"),
});

// Step 2: Parent Details Schema
const parentDetailsSchema = z.object({
  fatherName: z.string().min(2, "Father's name is required"),
  motherMaidenName: z.string().min(2, "Mother's maiden name is required"),
  fatherNIN: z.string().regex(/^\d{11}$/, "NIN must be 11 digits"),
  motherNIN: z.string().regex(/^\d{11}$/, "NIN must be 11 digits"),
});

// Step 3: Document Upload Schema
const documentSchema = z.object({
  hospitalNotification: z.any().refine(
    (files) => {
      if (typeof FileList === 'undefined') return true; // Skip validation during SSR
      return files instanceof FileList && files.length > 0;
    },
    "Hospital Notification of Birth is required"
  ),
});

// Combined Schema
const birthRegistrationSchema = childDetailsSchema.merge(parentDetailsSchema).merge(documentSchema);

type BirthRegistrationFormValues = z.infer<typeof birthRegistrationSchema>;

export function BirthRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const {
    register,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = useForm<BirthRegistrationFormValues>({
    resolver: zodResolver(birthRegistrationSchema),
    mode: "onChange",
  });

  const formData = watch();

  const steps = [
    { number: 1, title: "Child Details" },
    { number: 2, title: "Parent Details" },
    { number: 3, title: "Document Upload" },
    { number: 4, title: "Review & Submit" },
  ];

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof BirthRegistrationFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["childName", "dateOfBirth", "gender", "placeOfBirth", "birthType", "birthLocation"];
        break;
      case 2:
        fieldsToValidate = ["fatherName", "motherMaidenName", "fatherNIN", "motherNIN"];
        break;
      case 3:
        fieldsToValidate = ["hospitalNotification"];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      // When moving from step 3 to step 4, ensure document is uploaded
      if (currentStep === 3) {
        const document = watch("hospitalNotification");
        if (!document || document.length === 0) {
          return; // Don't proceed if document is not uploaded
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Helper function to split name into first, middle, last
  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return { first: parts[0], middle: "", last: "" };
    } else if (parts.length === 2) {
      return { first: parts[0], middle: "", last: parts[1] };
    } else {
      return {
        first: parts[0],
        middle: parts.slice(1, -1).join(" "),
        last: parts[parts.length - 1],
      };
    }
  };

  const handleFormSubmit = async () => {
    console.log("handleFormSubmit called, currentStep:", currentStep);
    
    // Only allow submission on step 4
    if (currentStep !== 4) {
      console.log("Not on step 4, aborting submission");
      return;
    }

    // Validate all fields before submitting
    const isValid = await trigger();
    if (!isValid) {
      console.log("Validation failed, aborting submission");
      return;
    }

    console.log("Starting submission process...");
    const data = getValues();
    setIsSubmitting(true);

    try {
      // Split names
      const childName = splitName(data.childName);
      const fatherName = splitName(data.fatherName);
      const motherName = splitName(data.motherMaidenName);

      // Prepare payload
      const payload: any = {
        child_first_name: childName.first,
        child_last_name: childName.last || childName.first,
        child_middle_name: childName.middle || null,
        child_gender: data.gender,
        date_of_birth: data.dateOfBirth,
        place_of_birth: data.placeOfBirth,
        father_first_name: fatherName.first,
        father_last_name: fatherName.last || fatherName.first,
        father_middle_name: fatherName.middle || null,
        father_nationality: "Nigerian", // Default, can be made configurable
        mother_first_name: motherName.first,
        mother_last_name: motherName.last || motherName.first,
        mother_middle_name: motherName.middle || null,
        mother_nationality: "Nigerian", // Default, can be made configurable
      };

      // Handle birth location based on birth type
      if (data.birthType === "Hospital") {
        payload.hospital_name = data.birthLocation;
        payload.hospital_address = data.birthLocation;
      } else {
        payload.home_address = data.birthLocation;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));

      if (data.hospitalNotification && data.hospitalNotification.length > 0) {
        formData.append("hospitalNotification", data.hospitalNotification[0]);
      }

      // Submit to API
      console.log("🔵 Submitting birth registration to /api/birth-registration");
      const response = await fetch("/api/birth-registration", {
        method: "POST",
        body: formData,
      });

      console.log("🔵 Response status:", response.status);
      const result = await response.json();
      console.log("🔵 Response data:", result);

      if (!response.ok) {
        console.error("🔴 API Error:", result);
        throw new Error(result.error || result.details || "Failed to submit birth registration");
      }

      setReferenceId(result.referenceId);
      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      alert(error.message || "Failed to submit registration. Please try again.");
      setIsSubmitting(false);
      setReferenceId(null);
    }
  };

  if (submitSuccess && referenceId) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-taraba-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted Successfully</h2>
        <p className="text-gray-600 mb-4">
          Your birth registration application has been received and is being processed.
        </p>
        <div className="bg-taraba-green/10 border border-taraba-green rounded-lg p-4 inline-block mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-1">Reference Number</p>
          <p className="text-lg font-bold text-taraba-green">{referenceId}</p>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Please save this reference number for tracking your application.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-taraba-green hover:bg-taraba-green-light text-white"
        >
          Submit Another Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.number
                      ? "bg-taraba-green text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <p
                  className={`mt-2 text-xs text-center ${
                    currentStep >= step.number ? "text-taraba-green font-medium" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep > step.number ? "bg-taraba-green" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Form onSubmit prevented - should not auto-submit");
          // Prevent all automatic form submissions
          return false;
        }}
        onKeyDown={(e) => {
          // Prevent form submission on Enter key
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            console.log("Enter key prevented");
          }
        }}
        noValidate
      >
        {/* Step 1: Child Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Child Details</h2>

            <div>
              <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                Child's Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="childName"
                type="text"
                {...register("childName")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
                placeholder="Enter child's full name"
              />
              {errors.childName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.childName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                {...register("gender")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Place of Birth <span className="text-red-500">*</span>
              </label>
              <input
                id="placeOfBirth"
                type="text"
                {...register("placeOfBirth")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
                placeholder="e.g., Jalingo, Taraba State"
              />
              {errors.placeOfBirth && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.placeOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="birthType" className="block text-sm font-medium text-gray-700 mb-2">
                Birth Type <span className="text-red-500">*</span>
              </label>
              <select
                id="birthType"
                {...register("birthType")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
              >
                <option value="">Select birth type</option>
                <option value="Hospital">Hospital</option>
                <option value="Home">Home</option>
              </select>
              {errors.birthType && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.birthType.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="birthLocation" className="block text-sm font-medium text-gray-700 mb-2">
                {watch("birthType") === "Hospital" 
                  ? "Hospital Name/Address" 
                  : watch("birthType") === "Home"
                  ? "Home Address"
                  : "Birth Location"} <span className="text-red-500">*</span>
              </label>
              <input
                id="birthLocation"
                type="text"
                {...register("birthLocation")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
                placeholder={
                  watch("birthType") === "Hospital"
                    ? "e.g., Federal Medical Centre, Jalingo"
                    : watch("birthType") === "Home"
                    ? "e.g., No. 15, Wukari Road, Jalingo"
                    : "Enter birth location"
                }
              />
              {errors.birthLocation && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.birthLocation.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Parent Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Parent Details</h2>

            <div>
              <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                Father's Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fatherName"
                type="text"
                {...register("fatherName")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
                placeholder="Enter father's full name"
              />
              {errors.fatherName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.fatherName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="fatherNIN" className="block text-sm font-medium text-gray-700 mb-2">
                Father's NIN Number <span className="text-red-500">*</span>
              </label>
              <input
                id="fatherNIN"
                type="text"
                {...register("fatherNIN")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
                placeholder="11-digit NIN number"
                maxLength={11}
              />
              {errors.fatherNIN && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.fatherNIN.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="motherMaidenName" className="block text-sm font-medium text-gray-700 mb-2">
                Mother's Maiden Name <span className="text-red-500">*</span>
              </label>
              <input
                id="motherMaidenName"
                type="text"
                {...register("motherMaidenName")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
                placeholder="Enter mother's maiden name"
              />
              {errors.motherMaidenName && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.motherMaidenName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="motherNIN" className="block text-sm font-medium text-gray-700 mb-2">
                Mother's NIN Number <span className="text-red-500">*</span>
              </label>
              <input
                id="motherNIN"
                type="text"
                {...register("motherNIN")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
                placeholder="11-digit NIN number"
                maxLength={11}
              />
              {errors.motherNIN && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.motherNIN.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Document Upload</h2>

            <div>
              <label htmlFor="hospitalNotification" className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Notification of Birth <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="hospitalNotification"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                  </div>
                  <input
                    id="hospitalNotification"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    {...register("hospitalNotification")}
                    className="hidden"
                  />
                </label>
              </div>
              {watch("hospitalNotification") && watch("hospitalNotification")?.length > 0 && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Selected: {watch("hospitalNotification")?.[0]?.name}
                </p>
              )}
              {errors.hospitalNotification && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.hospitalNotification?.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
              <p className="text-gray-600">
                Please review all information carefully before submitting your birth registration application.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-taraba-green rounded-full"></div>
                  Child Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">{formData.childName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Gender</p>
                    <p className="font-medium text-gray-900">{formData.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Place of Birth</p>
                    <p className="font-medium text-gray-900">{formData.placeOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Birth Type</p>
                    <p className="font-medium text-gray-900">{formData.birthType}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 mb-1">
                      {formData.birthType === "Hospital" 
                        ? "Hospital Name/Address" 
                        : formData.birthType === "Home"
                        ? "Home Address"
                        : "Birth Location"}
                    </p>
                    <p className="font-medium text-gray-900">{formData.birthLocation}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-taraba-green rounded-full"></div>
                  Parent Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Father's Name</p>
                    <p className="font-medium text-gray-900">{formData.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Father's NIN</p>
                    <p className="font-medium text-gray-900">{formData.fatherNIN}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Mother's Maiden Name</p>
                    <p className="font-medium text-gray-900">{formData.motherMaidenName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Mother's NIN</p>
                    <p className="font-medium text-gray-900">{formData.motherNIN}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-taraba-green rounded-full"></div>
                  Document
                </h3>
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Hospital Notification of Birth</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {watch("hospitalNotification")?.[0]?.name || "Not uploaded"}
                  </p>
                  {watch("hospitalNotification")?.[0] && (
                    <p className="text-xs text-gray-500 mt-1">
                      File size: {(watch("hospitalNotification")[0].size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Important Notice</p>
                  <p className="text-sm text-blue-800">
                    Please review all information carefully before submitting. Once you click "Submit Registration", 
                    your application will be processed and you will receive a reference number for tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-taraba-green hover:bg-taraba-green-light text-white flex items-center gap-2"
            >
              {currentStep === 3 ? "Review Information" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting || currentStep !== 4}
              className="bg-taraba-green hover:bg-taraba-green-light text-white px-8"
            >
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

