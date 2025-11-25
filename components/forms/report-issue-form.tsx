"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Navigation, 
  Droplet, 
  Heart, 
  GraduationCap,
  Zap,
  Trash2,
  Shield,
  Building2,
  X
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const reportSchema = z.object({
  category: z.enum([
    "Roads", 
    "Water", 
    "Health", 
    "Schools", 
    "Electricity", 
    "Sanitation", 
    "Security",
    "Housing"
  ], {
    required_error: "Please select a category",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  phone: z.string()
    .regex(/^0\d{10}$/, "Phone number must be 11 digits starting with 0 (e.g., 08021782214)")
    .optional()
    .or(z.literal("")),
  email: z.union([
    z.string().email("Please enter a valid email address"),
    z.literal(""),
    z.undefined()
  ]).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),
  photo: z.any().optional(),
}).refine(
  (data) => {
    if (data.photo && typeof FileList !== 'undefined' && data.photo instanceof FileList && data.photo.length > 0) {
      const file = data.photo[0];
      return file.size <= MAX_FILE_SIZE;
    }
    return true;
  },
  {
    message: "Photo size must be less than 10MB",
    path: ["photo"],
  }
);

type ReportFormValues = z.infer<typeof reportSchema>;

const categoryIcons = {
  Roads: Navigation,
  Water: Droplet,
  Health: Heart,
  Schools: GraduationCap,
  Electricity: Zap,
  Sanitation: Trash2,
  Security: Shield,
  Housing: Building2,
};

export function ReportIssueForm() {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      location: { lat: 0, lng: 0 },
    },
  });

  const selectedCategory = watch("category");
  const location = watch("location");
  const photo = watch("photo");

  // Handle photo selection with validation
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    setPhotoPreview(null);

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setPhotoError(`File size exceeds 10MB limit. Selected file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        e.target.value = ""; // Clear the input
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setPhotoError("Please select a valid image file (PNG, JPG, GIF)");
        e.target.value = ""; // Clear the input
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("photo", undefined);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Try to get address from coordinates (reverse geocoding)
        let address = "";
        try {
          // You can integrate with a geocoding API here (Google Maps, OpenStreetMap, etc.)
          address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        } catch (error) {
          address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        }

        setValue("location", {
          lat: latitude,
          lng: longitude,
          address,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError("Unable to retrieve your location. Please ensure location services are enabled.");
        setIsGettingLocation(false);
      }
    );
  };

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Validate location
      if (data.location.lat === 0 || data.location.lng === 0) {
        setLocationError("Please capture your location before submitting");
        setIsSubmitting(false);
        return;
      }

      // Create payload
      const payload = {
        category: data.category,
        description: data.description,
        phone: data.phone || null,
        email: data.email || null,
        location: {
          lat: data.location.lat,
          lng: data.location.lng,
        },
        address: data.location.address || null,
        lga: data.location.address ? extractLGA(data.location.address) : null,
      };

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));

      if (data.photo && data.photo.length > 0) {
        formData.append("photo", data.photo[0]);
      }

      // Submit to API
      console.log("🔵 Submitting report to /api/report");
      const response = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });

      console.log("🔵 Response status:", response.status);
      const result = await response.json();
      console.log("🔵 Response data:", result);

      if (!response.ok) {
        console.error("🔴 API Error:", result);
        throw new Error(result.error || result.details || "Failed to submit report");
      }

      setReferenceId(result.referenceId);
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Reset form after 5 seconds without page reload
      setTimeout(() => {
        setSubmitSuccess(false);
        setReferenceId(null);
        setPhotoPreview(null);
        setPhotoError(null);
        setLocationError(null);
        reset({
          category: undefined,
          description: "",
          phone: "",
          email: "",
          location: { lat: 0, lng: 0 },
          photo: undefined,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 5000);
    } catch (error: any) {
      console.error("Error submitting report:", error);
      const errorMessage = error.message || "Failed to submit report. Please try again.";
      setLocationError(errorMessage);
      setIsSubmitting(false);
      setReferenceId(null);
      
      // Show user-friendly error
      alert(`Error: ${errorMessage}\n\nPlease check:\n1. Your internet connection\n2. All required fields are filled\n3. Try again in a moment`);
    }
  };

  // Helper function to extract LGA from address (simple implementation)
  const extractLGA = (address: string): string | null => {
    const lgas = [
      "Jalingo", "Wukari", "Takum", "Sardauna", "Gashaka", "Bali", "Donga",
      "Ibi", "Karim Lamido", "Lau", "Yorro", "Zing", "Ardo Kola", "Gassol",
      "Kurmi", "Ussa", "Wukari", "Gashaka", "Sardauna"
    ];
    const addressUpper = address.toUpperCase();
    for (const lga of lgas) {
      if (addressUpper.includes(lga.toUpperCase())) {
        return lga;
      }
    }
    return null;
  };

  if (submitSuccess && referenceId) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-taraba-green mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
        <p className="text-gray-600 mb-4">
          Your report has been received and will be reviewed by the appropriate department.
        </p>
        <div className="bg-taraba-green/10 border border-taraba-green rounded-lg p-4 inline-block">
          <p className="text-sm font-semibold text-gray-700 mb-1">Reference ID</p>
          <p className="text-lg font-bold text-taraba-green">{referenceId}</p>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Please save this reference ID for tracking your report.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report an Issue</h2>
        <p className="text-gray-600">
          Help us improve services in Taraba State by reporting issues you encounter.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Select */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="category"
              {...register("category")}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent appearance-none bg-white"
            >
              <option value="">Select a category</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Health">Health</option>
              <option value="Schools">Schools</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Security">Security</option>
              <option value="Housing">Housing</option>
            </select>
            {selectedCategory && categoryIcons[selectedCategory as keyof typeof categoryIcons] && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {(() => {
                  const Icon = categoryIcons[selectedCategory as keyof typeof categoryIcons];
                  return <Icon className="h-5 w-5 text-gray-400" />;
                })()}
              </div>
            )}
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={5}
            {...register("description")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
            placeholder="Please provide a detailed description of the issue..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
              placeholder="08021782214"
              maxLength={11}
              pattern="^0\d{10}$"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <Button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full bg-taraba-green hover:bg-taraba-green-light text-white"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isGettingLocation ? "Getting Location..." : "Use My Current Location"}
            </Button>
            {locationError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {locationError}
              </p>
            )}
            {location.lat !== 0 && location.lng !== 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">Location Captured</p>
                <p className="text-xs text-green-600 mt-1">
                  Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                {location.address && (
                  <p className="text-xs text-green-600">{location.address}</p>
                )}
              </div>
            )}
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Please capture your location
            </p>
          )}
        </div>

        {/* Photo Evidence */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
            Photo Evidence (Optional)
          </label>
          {photoPreview ? (
            <div className="relative">
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {photo && photo[0]?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(photo && photo[0] ? (photo[0].size / (1024 * 1024)).toFixed(2) : "0")} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={removePhoto}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="photo"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  id="photo"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  {...register("photo")}
                  onChange={(e) => {
                    handlePhotoChange(e);
                    register("photo").onChange(e);
                  }}
                  ref={(e) => {
                    if (e) {
                      (fileInputRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                      const { ref } = register("photo");
                      if (typeof ref === "function") {
                        ref(e);
                      }
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}
          {photoError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {photoError}
            </p>
          )}
          {errors.photo && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.photo.message as string}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-taraba-green hover:bg-taraba-green-light text-white py-3 text-lg"
          >
            {isSubmitting ? "Submitting Report..." : "Submit Report"}
          </Button>
          <p className="mt-2 text-xs text-gray-500 text-center">
            By submitting this report, you agree that the information provided is accurate.
          </p>
        </div>
      </form>
    </div>
  );
}

