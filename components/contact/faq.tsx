"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "How do I register for government services?",
    answer: "You can register for government services by creating an account on the portal. Click on the 'Login' button and select 'Register' to create your account. You'll need to provide your NIN (National Identification Number) and other required information.",
  },
  {
    id: 2,
    question: "How long does it take to process birth registration?",
    answer: "Birth registration applications are typically processed within 5-7 business days. You'll receive a notification via email or SMS once your application has been reviewed and approved. You can track your application status in your dashboard.",
  },
  {
    id: 3,
    question: "How can I track my application status?",
    answer: "You can track your application status by logging into your account and visiting the 'My Applications' section in your dashboard. You'll also receive email and SMS notifications when your application status changes.",
  },
  {
    id: 4,
    question: "What payment methods are accepted?",
    answer: "We accept various payment methods including bank transfers, debit cards, credit cards, and mobile money. All payments are processed securely through our payment gateway partners.",
  },
  {
    id: 5,
    question: "How do I report an issue or complaint?",
    answer: "You can report issues or complaints by clicking on 'Report an Issue' in the services section. Fill out the form with details about the issue, including location (using the geolocation feature), and upload any relevant photos. Your report will be forwarded to the appropriate department.",
  },
  {
    id: 6,
    question: "Can I access services without creating an account?",
    answer: "Some services like browsing the MDA directory, viewing news, and accessing public information can be accessed without an account. However, to submit applications, track status, or access personalized services, you'll need to create an account.",
  },
  {
    id: 7,
    question: "How do I verify a document?",
    answer: "You can verify documents by visiting the 'Document Verification' section. Enter the document reference number or scan the QR code on the document. The system will confirm if the document is valid and issued by Taraba State Government.",
  },
  {
    id: 8,
    question: "What should I do if I forget my password?",
    answer: "Click on 'Login' and then select 'Forgot Password'. Enter your registered email address, and you'll receive a password reset link. Follow the instructions in the email to reset your password.",
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleFAQ(faq.id)}
            className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
            {openId === faq.id ? (
              <ChevronUp className="h-5 w-5 text-taraba-green flex-shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
            )}
          </button>
          {openId === faq.id && (
            <div className="px-4 pb-4 text-gray-600 text-sm">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

