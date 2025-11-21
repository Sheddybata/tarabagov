"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type ProgramType =
  | "Welfare Support"
  | "Utility Assistance"
  | "Vulnerable Persons Support"
  | "Elderly Care"
  | "Disability Support"
  | "Youth Empowerment"
  | "Women's Program";

type EnrollmentStatus = "active" | "pending" | "suspended";

interface Beneficiary {
  id: string;
  reference: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  lga: string;
  address?: string;
  programType: ProgramType;
  status: EnrollmentStatus;
  enrolledAt: string;
  lastReview?: string;
  nextReview?: string;
  notes: string[];
  documents?: string[];
}

const programTypeOptions: ProgramType[] = [
  "Welfare Support",
  "Utility Assistance",
  "Vulnerable Persons Support",
  "Elderly Care",
  "Disability Support",
  "Youth Empowerment",
  "Women's Program",
];

const statusMeta: Record<
  EnrollmentStatus,
  { label: string; className: string; next?: EnrollmentStatus }
> = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800",
  },
  pending: {
    label: "Pending",
    className: "bg-orange-100 text-orange-800",
    next: "active",
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-100 text-red-800",
  },
};

const initialBeneficiaries: Beneficiary[] = [
  {
    id: "1",
    reference: "SS-2024-001",
    fullName: "Amina Mohammed",
    phoneNumber: "0803 456 7890",
    email: "amina.mohammed@example.com",
    lga: "Jalingo",
    address: "No. 15, Wukari Road, Jalingo",
    programType: "Welfare Support",
    status: "active",
    enrolledAt: "2024-01-15T10:00:00Z",
    lastReview: "2024-10-15T10:00:00Z",
    nextReview: "2025-01-15T10:00:00Z",
    notes: ["Regular beneficiary. Monthly support ongoing."],
  },
  {
    id: "2",
    reference: "SS-2024-002",
    fullName: "John Tersoo",
    phoneNumber: "0802 178 2214",
    email: "john.tersoo@example.com",
    lga: "Takum",
    address: "Takum New Market Area",
    programType: "Utility Assistance",
    status: "active",
    enrolledAt: "2024-03-20T14:30:00Z",
    lastReview: "2024-09-20T14:30:00Z",
    nextReview: "2024-12-20T14:30:00Z",
    notes: ["Receiving water bill assistance."],
  },
  {
    id: "3",
    reference: "SS-2024-003",
    fullName: "Fatima Usman",
    phoneNumber: "0805 112 9988",
    email: "fatima.usman@example.com",
    lga: "Wukari",
    address: "Wukari Central",
    programType: "Elderly Care",
    status: "pending",
    enrolledAt: "2024-11-05T09:15:00Z",
    notes: ["Application under review. Awaiting medical assessment."],
  },
  {
    id: "4",
    reference: "SS-2024-004",
    fullName: "Ibrahim Sadiq",
    phoneNumber: "0807 334 5566",
    email: "ibrahim.sadiq@example.com",
    lga: "Sardauna",
    address: "Gembu Town",
    programType: "Disability Support",
    status: "active",
    enrolledAt: "2024-02-10T11:00:00Z",
    lastReview: "2024-08-10T11:00:00Z",
    nextReview: "2025-02-10T11:00:00Z",
    notes: ["Receiving monthly disability allowance."],
  },
  {
    id: "5",
    reference: "SS-2024-005",
    fullName: "Ruth Terkuma",
    phoneNumber: "0809 887 6655",
    email: "ruth.terkuma@example.com",
    lga: "Gassol",
    address: "Mutum Biyu",
    programType: "Women's Program",
    status: "suspended",
    enrolledAt: "2023-06-15T10:30:00Z",
    lastReview: "2024-09-15T10:30:00Z",
    notes: ["Suspended due to non-compliance with program requirements."],
  },
  {
    id: "6",
    reference: "SS-2024-006",
    fullName: "Musa Danjuma",
    phoneNumber: "0804 223 4455",
    email: "musa.danjuma@example.com",
    lga: "Karim Lamido",
    address: "Karim Lamido Town",
    programType: "Youth Empowerment",
    status: "active",
    enrolledAt: "2024-05-12T13:20:00Z",
    lastReview: "2024-11-01T13:20:00Z",
    nextReview: "2025-02-01T13:20:00Z",
    notes: ["Participating in skills training program."],
  },
];

export default function AdminSocialServicesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState<ProgramType | "">("");
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeBeneficiary, setActiveBeneficiary] = useState<Beneficiary | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<Beneficiary>>({
    programType: "Welfare Support",
    status: "pending",
  });

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((beneficiary) => {
      const matchesSearch =
        beneficiary.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = !programFilter || beneficiary.programType === programFilter;
      const matchesStatus = !statusFilter || beneficiary.status === statusFilter;
      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [beneficiaries, searchTerm, programFilter, statusFilter]);

  const sortedBeneficiaries = useMemo(() => {
    return [...filteredBeneficiaries].sort(
      (a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
    );
  }, [filteredBeneficiaries]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selected.length === sortedBeneficiaries.length) {
      setSelected([]);
    } else {
      setSelected(sortedBeneficiaries.map((b) => b.id));
    }
  };

  const handleStatusChange = (ids: string[], newStatus: EnrollmentStatus) => {
    setBeneficiaries((prev) =>
      prev.map((b) =>
        ids.includes(b.id)
          ? {
              ...b,
              status: newStatus,
              lastReview: newStatus === "active" ? new Date().toISOString() : b.lastReview,
            }
          : b
      )
    );
    setSelected([]);
  };

  const handleAddNote = (ids: string[]) => {
    const note = window.prompt("Enter note:");
    if (note) {
      setBeneficiaries((prev) =>
        prev.map((b) => (ids.includes(b.id) ? { ...b, notes: [...b.notes, note] } : b))
      );
    }
    setSelected([]);
  };

  const handleExport = () => {
    const headers = [
      "Reference",
      "Full Name",
      "Phone",
      "Email",
      "LGA",
      "Program Type",
      "Status",
      "Enrolled At",
      "Last Review",
    ];
    const rows = sortedBeneficiaries.map((b) => [
      b.reference,
      b.fullName,
      b.phoneNumber || "",
      b.email || "",
      b.lga,
      b.programType,
      b.status,
      new Date(b.enrolledAt).toLocaleDateString(),
      b.lastReview ? new Date(b.lastReview).toLocaleDateString() : "",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "social-services-beneficiaries.csv");
    link.click();
  };

  const openAddDrawer = (beneficiary?: Beneficiary) => {
    if (beneficiary) {
      setFormState(beneficiary);
      setIsEditing(true);
    } else {
      setFormState({
        programType: "Welfare Support",
        status: "pending",
      });
      setIsEditing(false);
    }
    setIsAddDrawerOpen(true);
  };

  const closeAddDrawer = () => {
    setIsAddDrawerOpen(false);
    setIsEditing(false);
  };

  const handleFormChange = (field: keyof Beneficiary, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveBeneficiary = () => {
    if (!formState.fullName || !formState.lga || !formState.programType) {
      window.alert("Please fill in required fields.");
      return;
    }

    if (isEditing && formState.id) {
      setBeneficiaries((prev) =>
        prev.map((b) => (b.id === formState.id ? (formState as Beneficiary) : b))
      );
    } else {
      const newBeneficiary: Beneficiary = {
        id: `beneficiary-${Date.now()}`,
        reference: `SS-2024-${String(beneficiaries.length + 1).padStart(3, "0")}`,
        fullName: formState.fullName,
        phoneNumber: formState.phoneNumber,
        email: formState.email,
        lga: formState.lga,
        address: formState.address,
        programType: (formState.programType as ProgramType) || "Welfare Support",
        status: (formState.status as EnrollmentStatus) || "pending",
        enrolledAt: new Date().toISOString(),
        lastReview: formState.lastReview,
        nextReview: formState.nextReview,
        notes: formState.notes || [],
        documents: formState.documents,
      };
      setBeneficiaries((prev) => [newBeneficiary, ...prev]);
    }

    closeAddDrawer();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Services</h1>
            <p className="text-gray-600">
              Manage beneficiary enrollment and social welfare programs.
            </p>
          </div>
          <Button onClick={() => openAddDrawer()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Enroll beneficiary
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by reference, name, or phone number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value as ProgramType | "")}
              placeholder="Filter by program"
            >
              <option value="">All programs</option>
              {programTypeOptions.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EnrollmentStatus | "")}
              placeholder="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleStatusChange(selected, "active")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve enrollment
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleStatusChange(selected, "suspended")}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Suspend
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleAddNote(selected)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Add note
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selected.length > 0 && selected.length === sortedBeneficiaries.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Beneficiary</th>
                  <th className="px-6 py-3">Program</th>
                  <th className="px-6 py-3">LGA</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Enrolled</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {sortedBeneficiaries.map((beneficiary) => {
                  const status = statusMeta[beneficiary.status];
                  return (
                    <tr
                      key={beneficiary.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setActiveBeneficiary(beneficiary)}
                    >
                      <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selected.includes(beneficiary.id)}
                          onChange={() => toggleSelect(beneficiary.id)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-mono font-medium text-gray-900">
                          {beneficiary.reference}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {beneficiary.fullName}
                          </div>
                          {beneficiary.phoneNumber && (
                            <div className="text-xs text-gray-500">{beneficiary.phoneNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-gray-900">{beneficiary.programType}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{beneficiary.lga}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Badge className={status.className}>{status.label}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{formatDateTime(beneficiary.enrolledAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAddDrawer(beneficiary)}
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedBeneficiaries.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No beneficiaries found for the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {activeBeneficiary && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setActiveBeneficiary(null)} />
          <div className="w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Beneficiary Details</h2>
                <p className="text-sm text-gray-500">{activeBeneficiary.reference}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveBeneficiary(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {activeBeneficiary.fullName}
                    </p>
                  </div>
                  {activeBeneficiary.phoneNumber && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {activeBeneficiary.phoneNumber}
                    </p>
                  )}
                  {activeBeneficiary.email && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {activeBeneficiary.email}
                    </p>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">LGA</p>
                    <p className="text-base text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {activeBeneficiary.lga}
                    </p>
                  </div>
                  {activeBeneficiary.address && (
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-base text-gray-900">{activeBeneficiary.address}</p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Program Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Program Type</p>
                    <p className="text-base font-semibold text-gray-900">
                      {activeBeneficiary.programType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge className={statusMeta[activeBeneficiary.status].className}>
                      {statusMeta[activeBeneficiary.status].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Enrolled</p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(activeBeneficiary.enrolledAt)}
                    </p>
                  </div>
                  {activeBeneficiary.lastReview && (
                    <div>
                      <p className="text-xs text-gray-500">Last Review</p>
                      <p className="text-sm text-gray-900">
                        {formatDateTime(activeBeneficiary.lastReview)}
                      </p>
                    </div>
                  )}
                  {activeBeneficiary.nextReview && (
                    <div>
                      <p className="text-xs text-gray-500">Next Review</p>
                      <p className="text-sm text-gray-900">
                        {formatDateTime(activeBeneficiary.nextReview)}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {activeBeneficiary.notes.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Notes</h3>
                  <div className="space-y-2">
                    {activeBeneficiary.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                        {note}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {activeBeneficiary.status !== "active" && (
                  <Button
                    onClick={() => {
                      handleStatusChange([activeBeneficiary.id], "active");
                      setActiveBeneficiary(null);
                    }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve enrollment
                  </Button>
                )}
                {activeBeneficiary.status !== "suspended" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange([activeBeneficiary.id], "suspended");
                      setActiveBeneficiary(null);
                    }}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Suspend
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    openAddDrawer(activeBeneficiary);
                    setActiveBeneficiary(null);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit beneficiary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const note = window.prompt("Enter note:");
                    if (note) {
                      setBeneficiaries((prev) =>
                        prev.map((b) =>
                          b.id === activeBeneficiary.id
                            ? { ...b, notes: [...b.notes, note] }
                            : b
                        )
                      );
                      setActiveBeneficiary({
                        ...activeBeneficiary,
                        notes: [...activeBeneficiary.notes, note],
                      });
                    }
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Add note
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closeAddDrawer} />
          <div className="w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Beneficiary" : "Enroll Beneficiary"}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeAddDrawer}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Full Name *</label>
                <Input
                  value={formState.fullName || ""}
                  onChange={(e) => handleFormChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    value={formState.phoneNumber || ""}
                    onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                    placeholder="0802 178 2214"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    value={formState.email || ""}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="beneficiary@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">LGA *</label>
                  <Input
                    value={formState.lga || ""}
                    onChange={(e) => handleFormChange("lga", e.target.value)}
                    placeholder="e.g., Jalingo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Program Type *</label>
                  <Select
                    value={formState.programType || ""}
                    onChange={(e) => handleFormChange("programType", e.target.value)}
                  >
                    {programTypeOptions.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <Input
                  value={formState.address || ""}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select
                    value={formState.status || "pending"}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Review</label>
                  <Input
                    type="date"
                    value={
                      formState.lastReview
                        ? new Date(formState.lastReview).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleFormChange("lastReview", e.target.value ? new Date(e.target.value).toISOString() : undefined)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Next Review</label>
                <Input
                  type="date"
                  value={
                    formState.nextReview
                      ? new Date(formState.nextReview).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleFormChange("nextReview", e.target.value ? new Date(e.target.value).toISOString() : undefined)
                  }
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSaveBeneficiary} className="flex-1">
                  {isEditing ? "Update" : "Enroll"} Beneficiary
                </Button>
                <Button variant="outline" onClick={closeAddDrawer}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
