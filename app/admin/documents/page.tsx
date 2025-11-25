"use client";

import { useMemo, useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  getAllDocumentVerifications,
  updateDocumentVerification,
  addDocumentVerificationNote,
  getDocumentVerificationNotes,
} from "@/lib/supabase/document-verifications";

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

// Helper function to map Supabase data to DocumentVerification interface
function mapSupabaseToDocumentVerification(supabaseData: any, notes: any[] = []): DocumentVerification {
  // Map document_type to DocumentType
  const docTypeMap: Record<string, DocumentType> = {
    birth_certificate: "Birth Certificate",
    educational_certificate: "Educational Certificate",
    marriage_certificate: "Marriage Certificate",
    death_certificate: "Death Certificate",
    business_registration: "Business Registration",
    land_title: "Land Title",
    tax_clearance: "Tax Clearance",
    identity_card: "Identity Document",
  };
  const documentType = docTypeMap[supabaseData.document_type] || "Birth Certificate";

  // Map status
  let status: VerificationStatus = "pending";
  const dbStatus = supabaseData.status || "pending";
  if (dbStatus === "pending") status = "pending";
  else if (dbStatus === "in_review" || dbStatus === "in-review") status = "in_review";
  else if (dbStatus === "verified") status = "verified";
  else if (dbStatus === "rejected") status = "rejected";

  return {
    id: supabaseData.id,
    reference: supabaseData.reference_id || "",
    documentType,
    applicantName: supabaseData.applicant_name || "",
    phoneNumber: supabaseData.phone || undefined,
    email: supabaseData.email || undefined,
    documentNumber: supabaseData.document_number || undefined,
    issuingAuthority: supabaseData.issuing_authority || undefined,
    issueDate: supabaseData.issue_date || undefined,
    status,
    submittedAt: supabaseData.created_at || new Date().toISOString(),
    verifiedAt: supabaseData.verified_at || undefined,
    verifiedBy: undefined,
    rejectionReason: supabaseData.rejection_reason || undefined,
    uploadedDocumentUrl: supabaseData.attachment_urls?.[0] || undefined,
    notes: notes.map((n: any) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
  };
}

export default function AdminDocumentsPage() {
  const [verifications, setVerifications] = useState<DocumentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [loadingNotes, setLoadingNotes] = useState<string | null>(null);

  // Fetch verifications from Supabase
  useEffect(() => {
    async function fetchVerifications() {
      try {
        setLoading(true);
        setError(null);
        
        // Map document type filter to database type
        const docTypeMap: Record<string, string> = {
          "Birth Certificate": "birth_certificate",
          "Educational Certificate": "educational_certificate",
          "Marriage Certificate": "marriage_certificate",
          "Death Certificate": "death_certificate",
          "Business Registration": "business_registration",
          "Land Title": "land_title",
          "Tax Clearance": "tax_clearance",
          "Identity Document": "identity_card",
        };
        const dbDocType = typeFilter ? docTypeMap[typeFilter] : undefined;

        // Map status filter
        let dbStatus: string | undefined = undefined;
        if (statusFilter === "in_review") dbStatus = "in_review";
        else if (statusFilter) dbStatus = statusFilter;

        const { data, error: fetchError } = await getAllDocumentVerifications({
          status: dbStatus,
          document_type: dbDocType,
          search: searchTerm || undefined,
        });

        if (fetchError) {
          throw fetchError;
        }

        // Map Supabase data to DocumentVerification interface
        const mappedVerifications = (data || []).map((ver: any) => mapSupabaseToDocumentVerification(ver));
        setVerifications(mappedVerifications);
      } catch (err: any) {
        console.error("Error fetching document verifications:", err);
        setError(err.message || "Failed to load document verifications");
      } finally {
        setLoading(false);
      }
    }

    fetchVerifications();
  }, [statusFilter, typeFilter, searchTerm]);

  const refreshData = async () => {
    try {
      const docTypeMap: Record<string, string> = {
        "Birth Certificate": "birth_certificate",
        "Educational Certificate": "educational_certificate",
        "Marriage Certificate": "marriage_certificate",
        "Death Certificate": "death_certificate",
        "Business Registration": "business_registration",
        "Land Title": "land_title",
        "Tax Clearance": "tax_clearance",
        "Identity Document": "identity_card",
      };
      const dbDocType = typeFilter ? docTypeMap[typeFilter] : undefined;

      let dbStatus: string | undefined = undefined;
      if (statusFilter === "in_review") dbStatus = "in_review";
      else if (statusFilter) dbStatus = statusFilter;

      const { data, error: fetchError } = await getAllDocumentVerifications({
        status: dbStatus,
        document_type: dbDocType,
        search: searchTerm || undefined,
      });
      if (!fetchError && data) {
        setVerifications(data.map((ver: any) => mapSupabaseToDocumentVerification(ver)));
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

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

  const handleStatusChange = async (ids: string[], newStatus: VerificationStatus) => {
    // Map UI status to DB status
    let dbStatus = newStatus;
    if (newStatus === "in_review") dbStatus = "in_review";

    for (const id of ids) {
      try {
        const updates: any = { status: dbStatus };
        if (newStatus === "verified") {
          updates.verified_at = new Date().toISOString();
        }
        const { error } = await updateDocumentVerification(id, updates);
        if (error) throw error;
      } catch (err) {
        console.error(`Error updating verification ${id}:`, err);
        alert("Failed to update status");
        return;
      }
    }
    setSelected([]);
    await refreshData();
  };

  const handleAddNote = async (ids: string[]) => {
    const note = window.prompt("Enter note:");
    if (!note) return;
    for (const id of ids) {
      try {
        const { error } = await addDocumentVerificationNote(id, note);
        if (error) throw error;
      } catch (err) {
        console.error(`Error adding note to ${id}:`, err);
        alert("Failed to add note");
        return;
      }
    }
    if (activeVerification && ids.includes(activeVerification.id)) {
      const { data: notes } = await getDocumentVerificationNotes(activeVerification.id);
      if (notes) {
        setActiveVerification({
          ...activeVerification,
          notes: notes.map((n: any) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
        });
      }
    }
    setSelected([]);
    await refreshData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-taraba-green mx-auto mb-4" />
          <p className="text-gray-600">Loading document verifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p className="font-semibold">Error loading document verifications</p>
        </div>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

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
                      onClick={async () => {
                        setActiveVerification(verification);
                        // Fetch notes
                        try {
                          setLoadingNotes(verification.id);
                          const { data: notes, error: notesError } = await getDocumentVerificationNotes(verification.id);
                          if (!notesError && notes) {
                            setActiveVerification({
                              ...verification,
                              notes: notes.map((n: any) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
                            });
                          }
                        } catch (err) {
                          console.error("Error fetching notes:", err);
                        } finally {
                          setLoadingNotes(null);
                        }
                      }}
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
