"use client";

import { useState } from "react";
import { Receipt, FileCheck, Search, CreditCard, Download, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function TSIRSTaxServices() {
  const [activeTab, setActiveTab] = useState("pay");

  const services = [
    {
      id: "pay",
      name: "Pay Taxes",
      icon: CreditCard,
      description: "Make tax payments online",
    },
    {
      id: "invoice",
      name: "Generate Invoice",
      icon: Receipt,
      description: "Generate and download tax invoices",
    },
    {
      id: "verify",
      name: "Verify Tax Clearance",
      icon: FileCheck,
      description: "Verify tax clearance certificates",
    },
    {
      id: "search",
      name: "Tax Records",
      icon: Search,
      description: "Search tax records and history",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Service Tabs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  activeTab === service.id
                    ? "border-taraba-gold bg-taraba-gold/5"
                    : "border-gray-200 hover:border-taraba-gold/50"
                }`}
              >
                <Icon className={`h-6 w-6 mb-2 ${
                  activeTab === service.id ? "text-taraba-gold" : "text-gray-400"
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
        {activeTab === "pay" && <PayTaxesForm />}
        {activeTab === "invoice" && <GenerateInvoiceForm />}
        {activeTab === "verify" && <VerifyTaxClearance />}
        {activeTab === "search" && <TaxRecordsSearch />}
      </div>
    </div>
  );
}

function PayTaxesForm() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pay Taxes</h2>
        <p className="text-gray-600">Make secure online tax payments</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="taxType">Tax Type</Label>
          <Select id="taxType" placeholder="Select tax type">
            <option value="personal">Personal Income Tax</option>
            <option value="business">Business Tax</option>
            <option value="property">Property Tax</option>
            <option value="vehicle">Vehicle Tax</option>
            <option value="land">Land Use Charge</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="taxpayerId">Taxpayer ID / TIN</Label>
          <Input id="taxpayerId" placeholder="Enter Taxpayer ID or TIN" />
        </div>
        
        <div>
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input id="amount" type="number" placeholder="Enter amount" />
        </div>
        
        <div>
          <Label htmlFor="period">Tax Period</Label>
          <Select id="period" placeholder="Select period">
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Payment Information</p>
            <p className="text-sm text-blue-700">You will be redirected to a secure payment gateway to complete your transaction.</p>
          </div>
        </div>
      </div>

      <Button className="w-full md:w-auto bg-taraba-gold hover:bg-taraba-gold-dark text-white">
        <CreditCard className="h-4 w-4 mr-2" />
        Proceed to Payment
      </Button>
    </div>
  );
}

function GenerateInvoiceForm() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Invoice</h2>
        <p className="text-gray-600">Generate and download tax invoices</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="invoiceTaxType">Tax Type</Label>
          <Select id="invoiceTaxType" placeholder="Select tax type">
            <option value="personal">Personal Income Tax</option>
            <option value="business">Business Tax</option>
            <option value="property">Property Tax</option>
            <option value="vehicle">Vehicle Tax</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="invoiceTaxpayerId">Taxpayer ID / TIN</Label>
          <Input id="invoiceTaxpayerId" placeholder="Enter Taxpayer ID or TIN" />
        </div>
        
        <div>
          <Label htmlFor="invoicePeriod">Tax Period</Label>
          <Select id="invoicePeriod" placeholder="Select period">
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="invoiceNumber">Invoice Number (Optional)</Label>
          <Input id="invoiceNumber" placeholder="Enter invoice number if known" />
        </div>
      </div>

      <Button className="w-full md:w-auto bg-taraba-gold hover:bg-taraba-gold-dark text-white">
        <Download className="h-4 w-4 mr-2" />
        Generate Invoice
      </Button>
    </div>
  );
}

function VerifyTaxClearance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Tax Clearance Certificate</h2>
        <p className="text-gray-600">Verify the authenticity of tax clearance certificates</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="certificateNumber">Certificate Number</Label>
          <Input id="certificateNumber" placeholder="Enter certificate number" />
        </div>
        
        <div>
          <Label htmlFor="taxpayerName">Taxpayer Name</Label>
          <Input id="taxpayerName" placeholder="Enter taxpayer name" />
        </div>
        
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input id="issueDate" type="date" />
        </div>
        
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" type="date" />
        </div>
      </div>

      <Button className="w-full md:w-auto bg-taraba-gold hover:bg-taraba-gold-dark text-white">
        <FileCheck className="h-4 w-4 mr-2" />
        Verify Certificate
      </Button>
    </div>
  );
}

function TaxRecordsSearch() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tax Records Search</h2>
        <p className="text-gray-600">Search for tax records and payment history</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="searchType">Search By</Label>
          <Select id="searchType" placeholder="Select search type">
            <option value="tin">Taxpayer ID / TIN</option>
            <option value="name">Taxpayer Name</option>
            <option value="invoice">Invoice Number</option>
            <option value="receipt">Receipt Number</option>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="searchValue">Search Value</Label>
          <Input id="searchValue" placeholder="Enter search term" />
        </div>
      </div>

      <Button className="w-full md:w-auto bg-taraba-gold hover:bg-taraba-gold-dark text-white">
        <Search className="h-4 w-4 mr-2" />
        Search Records
      </Button>
    </div>
  );
}

