"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  X,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type DocumentType =
  | "Birth Certificate"
  | "Educational Certificate"
  | "Marriage Certificate"
  | "Death Certificate"
  | "Business Registration"
  | "Land Title"
  | "Tax Clearance"
  | "Identity Document";

type VerificationStatus = "pending" | "in_review" | "verified" | "rejected";

interface DocumentVerification {
  id: string;
  reference: string;
  documentType: DocumentType;
  applicantName: string;
  phoneNumber?: string;
  email?: string;
  documentNumber?: string;
  issuingAuthority?: string;
  issueDate?: string;
  status: VerificationStatus;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  uploadedDocumentUrl?: string;
  notes: string[];
}

const documentTypeOptions: DocumentType[] = [
  "Birth Certificate",
  "Educational Certificate",
  "Marriage Certificate",
  "Death Certificate",
  "Business Registration",
  "Land Title",
  "Tax Clearance",
  "Identity Document",
];

const statusMeta: Record<
  VerificationStatus,
  { label: string; className: string; next?: VerificationStatus }
> = {
  pending: {
    label: "Pending",
    className: "bg-orange-100 text-orange-800",
    next: "in_review",
  },
  in_review: {
    label: "In Review",
    className: "bg-blue-100 text-blue-800",
    next: "verified",
  },
  verified: {
    label: "Verified",
    className: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
  },
};

const initialVerifications: DocumentVerification[] = [
  {
    id: "1",
    reference: "DV-2024-001",
    documentType: "Birth Certificate",
    applicantName: "Amina Mohammed",
    phoneNumber: "0803 456 7890",
    email: "amina.mohammed@example.com",
    documentNumber: "BC/TS/2024/12345",
    issuingAuthority: "National Population Commission",
    issueDate: "2024-01-15",
    status: "pending",
    submittedAt: "2024-11-10T09:00:00Z",
    notes: [],
  },
  {
    id: "2",
    reference: "DV-2024-002",
    documentType: "Educational Certificate",
    applicantName: "John Tersoo",
    phoneNumber: "0802 178 2214",
    email: "john.tersoo@example.com",
    documentNumber: "WAEC/2020/567890",
    issuingAuthority: "West African Examinations Council",
    issueDate: "2020-08-20",
    status: "in_review",
    submittedAt: "2024-11-09T14:30:00Z",
    notes: ["Document appears authentic. Cross-checking with WAEC database."],
  },
  {
    id: "3",
    reference: "DV-2024-003",
    documentType: "Business Registration",
    applicantName: "Fatima Usman",
    phoneNumber: "0805 112 9988",
    email: "fatima.usman@example.com",
    documentNumber: "RC/TS/2023/789",
    issuingAuthority: "Corporate Affairs Commission",
    issueDate: "2023-06-10",
    status: "verified",
    submittedAt: "2024-11-08T10:15:00Z",
    verifiedAt: "2024-11-09T16:20:00Z",
    verifiedBy: "Admin User",
    notes: ["Verified against CAC database. Document is authentic."],
  },
  {
    id: "4",
    reference: "DV-2024-004",
    documentType: "Land Title",
    applicantName: "Ibrahim Sadiq",
    phoneNumber: "0807 334 5566",
    email: "ibrahim.sadiq@example.com",
    documentNumber: "LT/TS/2022/456",
    issuingAuthority: "TAGIS - Taraba Geographic Information Service",
    issueDate: "2022-03-15",
    status: "rejected",
    submittedAt: "2024-11-07T11:00:00Z",
    rejectionReason: "Document number does not match records in TAGIS database.",
    notes: ["Cross-referenced with TAGIS. Document number invalid."],
  },
  {
    id: "5",
    reference: "DV-2024-005",
    documentType: "Marriage Certificate",
    applicantName: "Ruth Terkuma",
    phoneNumber: "0809 887 6655",
    email: "ruth.terkuma@example.com",
    documentNumber: "MC/TS/2019/234",
    issuingAuthority: "Taraba State Ministry of Justice",
    issueDate: "2019-12-05",
    status: "pending",
    submittedAt: "2024-11-10T08:45:00Z",
    notes: [],
  },
  {
    id: "6",
    reference: "DV-2024-006",
    documentType: "Tax Clearance",
    applicantName: "Musa Danjuma",
    phoneNumber: "0804 223 4455",
    email: "musa.danjuma@example.com",
    documentNumber: "TC/TS/2024/890",
    issuingAuthority: "TSIRS - Taraba State Internal Revenue Service",
    issueDate: "2024-09-30",
    status: "in_review",
    submittedAt: "2024-11-09T15:20:00Z",
    notes: ["Verifying with TSIRS records."],
  },
];

export default function AdminDocumentsPage() {
  const [verifications, setVerifications] = useState<DocumentVerification[]>(initialVerifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "">("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeVerification, setActiveVerification] = useState<DocumentVerification | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<DocumentVerification>>({
    documentType: "Birth Certificate",
    status: "pending",
  });

  const filteredVerifications = useMemo(() => {
    return verifications.filter((verification) => {
      const matchesSearch =
        verification.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verification.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !typeFilter || verification.documentType === typeFilter;
      const matchesStatus = !statusFilter || verification.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [verifications, searchTerm, typeFilter, statusFilter]);

  const sortedVerifications = useMemo(() => {
    return [...filteredVerifications].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, [filteredVerifications]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selected.length === sortedVerifications.length) {
      setSelected([]);
    } else {
      setSelected(sortedVerifications.map((v) => v.id));
    }
  };

  const handleStatusChange = (ids: string[], newStatus: VerificationStatus) => {
    setVerifications((prev) =>
      prev.map((v) =>
        ids.includes(v.id)
          ? {
              ...v,
              status: newStatus,
              verifiedAt: newStatus === "verified" ? new Date().toISOString() : v.verifiedAt,
              verifiedBy: newStatus === "verified" ? "Admin User" : v.verifiedBy,
            }
          : v
      )
    );
    setSelected([]);
  };

  const handleAddNote = (ids: string[]) => {
    const note = window.prompt("Enter note:");
    if (note) {
      setVerifications((prev) =>
        prev.map((v) => (ids.includes(v.id) ? { ...v, notes: [...v.notes, note] } : v))
      );
    }
    setSelected([]);
  };

  const handleExport = () => {
    const headers = [
      "Reference",
      "Document Type",
      "Applicant Name",
      "Phone",
      "Email",
      "Document Number",
      "Issuing Authority",
      "Status",
      "Submitted At",
    ];
    const rows = sortedVerifications.map((v) => [
      v.reference,
      v.documentType,
      v.applicantName,
      v.phoneNumber || "",
      v.email || "",
      v.documentNumber || "",
      v.issuingAuthority || "",
      v.status,
      new Date(v.submittedAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "document-verifications.csv");
    link.click();
  };

  const openAddDrawer = (verification?: DocumentVerification) => {
    if (verification) {
      setFormState(verification);
      setIsEditing(true);
    } else {
      setFormState({
        documentType: "Birth Certificate",
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

  const handleFormChange = (field: keyof DocumentVerification, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveVerification = () => {
    if (!formState.applicantName || !formState.documentType) {
      window.alert("Please fill in required fields.");
      return;
    }

    if (isEditing && formState.id) {
      setVerifications((prev) =>
        prev.map((v) => (v.id === formState.id ? (formState as DocumentVerification) : v))
      );
    } else {
      const newVerification: DocumentVerification = {
        id: `verification-${Date.now()}`,
        reference: `DV-2024-${String(verifications.length + 1).padStart(3, "0")}`,
        documentType: (formState.documentType as DocumentType) || "Birth Certificate",
        applicantName: formState.applicantName,
        phoneNumber: formState.phoneNumber,
        email: formState.email,
        documentNumber: formState.documentNumber,
        issuingAuthority: formState.issuingAuthority,
        issueDate: formState.issueDate,
        status: (formState.status as VerificationStatus) || "pending",
        submittedAt: new Date().toISOString(),
        notes: formState.notes || [],
      };
      setVerifications((prev) => [newVerification, ...prev]);
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
            <h1 className="text-3xl font-bold text-gray-900">Document Verification</h1>
            <p className="text-gray-600">
              Review and verify official documents submitted by citizens.
            </p>
          </div>
          <Button onClick={() => openAddDrawer()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add verification
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by reference, applicant, or document number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocumentType | "")}
              placeholder="Filter by document type"
            >
              <option value="">All types</option>
              {documentTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VerificationStatus | "")}
              placeholder="Filter by status"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleStatusChange(selected, "verified")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark verified
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleStatusChange(selected, "rejected")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
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
                      checked={selected.length > 0 && selected.length === sortedVerifications.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Document Type</th>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Document Number</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {sortedVerifications.map((verification) => {
                  const status = statusMeta[verification.status];
                  return (
                    <tr
                      key={verification.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setActiveVerification(verification)}
                    >
                      <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selected.includes(verification.id)}
                          onChange={() => toggleSelect(verification.id)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-mono font-medium text-gray-900">
                          {verification.reference}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {verification.documentType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {verification.applicantName}
                          </div>
                          {verification.email && (
                            <div className="text-xs text-gray-500">{verification.email}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-gray-600">
                          {verification.documentNumber || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <Badge className={status.className}>{status.label}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{formatDateTime(verification.submittedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange([verification.id], "verified")}
                            disabled={verification.status === "verified"}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Verify
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedVerifications.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No verification requests found for the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {activeVerification && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setActiveVerification(null)} />
          <div className="w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Verification Details</h2>
                <p className="text-sm text-gray-500">{activeVerification.reference}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setActiveVerification(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Document Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Document Type</p>
                    <p className="text-base font-semibold text-gray-900">
                      {activeVerification.documentType}
                    </p>
                  </div>
                  {activeVerification.documentNumber && (
                    <div>
                      <p className="text-xs text-gray-500">Document Number</p>
                      <p className="text-base font-mono text-gray-900">
                        {activeVerification.documentNumber}
                      </p>
                    </div>
                  )}
                  {activeVerification.issuingAuthority && (
                    <div>
                      <p className="text-xs text-gray-500">Issuing Authority</p>
                      <p className="text-base text-gray-900">
                        {activeVerification.issuingAuthority}
                      </p>
                    </div>
                  )}
                  {activeVerification.issueDate && (
                    <div>
                      <p className="text-xs text-gray-500">Issue Date</p>
                      <p className="text-base text-gray-900">
                        {formatDate(activeVerification.issueDate)}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Applicant Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {activeVerification.applicantName}
                    </p>
                  </div>
                  {activeVerification.phoneNumber && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {activeVerification.phoneNumber}
                    </p>
                  )}
                  {activeVerification.email && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {activeVerification.email}
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Status</h3>
                <div className="space-y-3">
                  <Badge className={statusMeta[activeVerification.status].className}>
                    {statusMeta[activeVerification.status].label}
                  </Badge>
                  <div>
                    <p className="text-xs text-gray-500">Submitted</p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(activeVerification.submittedAt)}
                    </p>
                  </div>
                  {activeVerification.verifiedAt && (
                    <div>
                      <p className="text-xs text-gray-500">Verified</p>
                      <p className="text-sm text-gray-900">
                        {formatDateTime(activeVerification.verifiedAt)}
                      </p>
                      {activeVerification.verifiedBy && (
                        <p className="text-xs text-gray-500">by {activeVerification.verifiedBy}</p>
                      )}
                    </div>
                  )}
                  {activeVerification.rejectionReason && (
                    <div>
                      <p className="text-xs text-gray-500">Rejection Reason</p>
                      <p className="text-sm text-red-600">{activeVerification.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </section>

              {activeVerification.notes.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Notes</h3>
                  <div className="space-y-2">
                    {activeVerification.notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                        {note}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {activeVerification.status !== "verified" && (
                  <Button
                    onClick={() => {
                      handleStatusChange([activeVerification.id], "verified");
                      setActiveVerification(null);
                    }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark verified
                  </Button>
                )}
                {activeVerification.status !== "rejected" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const reason = window.prompt("Enter rejection reason:");
                      if (reason) {
                        setVerifications((prev) =>
                          prev.map((v) =>
                            v.id === activeVerification.id
                              ? { ...v, status: "rejected", rejectionReason: reason }
                              : v
                          )
                        );
                        setActiveVerification(null);
                      }
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    const note = window.prompt("Enter note:");
                    if (note) {
                      setVerifications((prev) =>
                        prev.map((v) =>
                          v.id === activeVerification.id
                            ? { ...v, notes: [...v.notes, note] }
                            : v
                        )
                      );
                      setActiveVerification({
                        ...activeVerification,
                        notes: [...activeVerification.notes, note],
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
                {isEditing ? "Edit Verification" : "Add Verification"}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeAddDrawer}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Document Type *</label>
                <Select
                  value={formState.documentType || ""}
                  onChange={(e) => handleFormChange("documentType", e.target.value)}
                >
                  {documentTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Applicant Name *</label>
                <Input
                  value={formState.applicantName || ""}
                  onChange={(e) => handleFormChange("applicantName", e.target.value)}
                  placeholder="Enter applicant name"
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
                    placeholder="applicant@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Document Number</label>
                <Input
                  value={formState.documentNumber || ""}
                  onChange={(e) => handleFormChange("documentNumber", e.target.value)}
                  placeholder="Enter document number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Issuing Authority</label>
                <Input
                  value={formState.issuingAuthority || ""}
                  onChange={(e) => handleFormChange("issuingAuthority", e.target.value)}
                  placeholder="e.g., National Population Commission"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Issue Date</label>
                  <Input
                    type="date"
                    value={formState.issueDate || ""}
                    onChange={(e) => handleFormChange("issueDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select
                    value={formState.status || "pending"}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSaveVerification} className="flex-1">
                  {isEditing ? "Update" : "Add"} Verification
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
