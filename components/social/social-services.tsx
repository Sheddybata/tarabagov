"use client";

import { useState } from "react";
import { Users, CreditCard, Droplet, Trash2, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function SocialServices() {
  const [activeTab, setActiveTab] = useState("beneficiary");

  const services = [
    {
      id: "beneficiary",
      name: "Beneficiary Programs",
      icon: Users,
      description: "Enroll in social welfare programs",
    },
    {
      id: "utilities",
      name: "Utility Bills",
      icon: CreditCard,
      description: "Pay water, waste, and other utility bills",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Service Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  activeTab === service.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <Icon className={`h-8 w-8 mb-3 ${
                  activeTab === service.id ? "text-orange-600" : "text-gray-400"
                }`} />
                <h3 className="font-semibold text-gray-900 mb-1 text-lg">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {activeTab === "beneficiary" && <BeneficiaryPrograms />}
        {activeTab === "utilities" && <UtilityBills />}
      </div>
    </div>
  );
}

function BeneficiaryPrograms() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Beneficiary Program Enrollment</h2>
        <p className="text-gray-600">Apply for social welfare and beneficiary programs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="programType">Program Type</Label>
          <Select id="programType" placeholder="Select program">
            <option value="pension">Pension Scheme</option>
            <option value="disability">Disability Support</option>
            <option value="widow">Widow Support Program</option>
            <option value="youth">Youth Empowerment</option>
            <option value="elderly">Elderly Care Program</option>
            <option value="unemployment">Unemployment Benefits</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Enter full name" />
        </div>

        <div>
          <Label htmlFor="nin">National Identification Number (NIN)</Label>
          <Input id="nin" placeholder="Enter NIN" />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" placeholder="Enter phone number" />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="Enter email address" />
        </div>

        <div>
          <Label htmlFor="lga">Local Government Area</Label>
          <Select id="lga" placeholder="Select LGA">
            <option value="jalingo">Jalingo</option>
            <option value="wukari">Wukari</option>
            <option value="takum">Takum</option>
            <option value="sardauna">Sardauna</option>
            <option value="gashaka">Gashaka</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="Enter residential address" />
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" />
        </div>
      </div>

      <div>
        <Label htmlFor="reason">Reason for Application</Label>
        <Textarea
          id="reason"
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
        </div>
      </div>

      <Button className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white">
        <Users className="h-4 w-4 mr-2" />
        Submit Application
      </Button>
    </div>
  );
}

function UtilityBills() {
  const [billType, setBillType] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Utility Bill Payments</h2>
        <p className="text-gray-600">Pay your water, waste, and other utility bills online</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="billType">Bill Type</Label>
          <Select
            id="billType"
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
          >
            <option value="">Select bill type</option>
            <option value="water">Water Bill</option>
            <option value="waste">Waste Management</option>
            <option value="electricity">Electricity</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input id="accountNumber" placeholder="Enter account number" />
        </div>

        {billType && (
          <>
            <div>
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input id="amount" type="number" placeholder="Enter amount" />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select id="paymentMethod" placeholder="Select payment method">
                <option value="card">Debit/Credit Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="ussd">USSD</option>
              </Select>
            </div>
          </>
        )}
      </div>

      {billType && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Payment Information</p>
              <p className="text-sm text-blue-700">
                You will be redirected to a secure payment gateway to complete your transaction.
              </p>
            </div>
          </div>
        </div>
      )}

      <Button
        disabled={!billType}
        className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Proceed to Payment
      </Button>
    </div>
  );
}

