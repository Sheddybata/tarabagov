"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // TODO: Replace with actual API call to Supabase
      console.log("Contact form submission:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      setIsSubmitting(false);
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-green-800 text-sm">
            Thank you! Your message has been sent successfully. We'll get back to you soon.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          type="text"
          {...register("subject")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
          placeholder="What is this regarding?"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-taraba-green focus:border-transparent"
          placeholder="Enter your message..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-taraba-green hover:bg-taraba-green-light text-white py-3"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

