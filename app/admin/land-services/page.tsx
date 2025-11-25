"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Layers,
  Mail,
  Map,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  getAllLandServices,
  updateLandService,
  addLandServiceNote,
  getLandServiceNotes,
} from "@/lib/supabase/land-services";

type LandRequestStatus =
  | "submitted"
  | "in_review"
  | "awaiting_documents"
  | "approved"
  | "rejected";

type LandServiceType = "Land Search" | "Registration" | "Document Request";

interface LandRequest {
  id: string;
  reference: string;
  applicantName: string;
  contactPhone?: string;
  contactEmail?: string;
  requestType: LandServiceType;
  plotNumber?: string;
  location: string;
  lga: string;
  status: LandRequestStatus;
  submittedAt: string;
  assignedTo?: string;
  supportingDocs: { name: string; url?: string }[];
  notes: string[];
}

const statusMap: Record<
  LandRequestStatus,
  { label: string; className: string; next?: LandRequestStatus }
> = {
  submitted: {
    label: "Submitted",
    className: "bg-gray-100 text-gray-800",
    next: "in_review",
  },
  in_review: {
    label: "In Review",
    className: "bg-blue-100 text-blue-800",
    next: "awaiting_documents",
  },
  awaiting_documents: {
    label: "Awaiting Documents",
    className: "bg-yellow-100 text-yellow-800",
    next: "approved",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
  },
};

// Helper function to map Supabase data to LandRequest interface
function mapSupabaseToLandRequest(supabaseData: any, notes: any[] = []): LandRequest {
  // Determine request type from request_type field
  let requestType: LandServiceType = "Land Search";
  if (supabaseData.request_type?.includes("registration") || supabaseData.request_type === "new" || supabaseData.request_type === "transfer" || supabaseData.request_type === "update") {
    requestType = "Registration";
  } else if (supabaseData.request_type?.includes("document")) {
    requestType = "Document Request";
  }

  // Map status
  let status: LandRequestStatus = "submitted";
  const dbStatus = supabaseData.status || "pending";
  if (dbStatus === "pending") status = "submitted";
  else if (dbStatus === "in_progress" || dbStatus === "in_review") status = "in_review";
  else if (dbStatus === "awaiting_documents") status = "awaiting_documents";
  else if (dbStatus === "approved" || dbStatus === "resolved") status = "approved";
  else if (dbStatus === "rejected") status = "rejected";

  // Parse documents
  const supportingDocs = (supabaseData.documents_urls || []).map((url: string) => ({
    name: url.split("/").pop() || "Document",
    url,
  }));

  return {
    id: supabaseData.id,
    reference: supabaseData.reference_id || "",
    applicantName: supabaseData.applicant_name || "",
    contactPhone: supabaseData.applicant_phone || undefined,
    contactEmail: supabaseData.applicant_email || undefined,
    requestType,
    plotNumber: supabaseData.plot_number || undefined,
    location: supabaseData.location_description || "",
    lga: supabaseData.lga || "Unknown",
    status,
    submittedAt: supabaseData.created_at || new Date().toISOString(),
    assignedTo: undefined,
    supportingDocs,
    notes: notes.map((n: any) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
  };
}

export default function AdminLandServicesPage() {
  const [requests, setRequests] = useState<LandRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LandRequestStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<LandServiceType | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeRequest, setActiveRequest] = useState<LandRequest | null>(null);
  const [loadingNotes, setLoadingNotes] = useState<string | null>(null);

  // Fetch requests from Supabase
  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        setError(null);
        
        // Map status filter to database status
        let dbStatus: string | undefined = undefined;
        if (statusFilter === "submitted") dbStatus = "pending";
        else if (statusFilter === "in_review") dbStatus = "in_progress";
        else if (statusFilter) dbStatus = statusFilter;

        // Map type filter to request_type
        let requestType: string | undefined = undefined;
        if (typeFilter === "Registration") requestType = "new";
        else if (typeFilter === "Document Request") requestType = "document_request";

        const { data, error: fetchError } = await getAllLandServices({
          status: dbStatus,
          request_type: requestType,
          search: searchTerm || undefined,
        });

        if (fetchError) {
          throw fetchError;
        }

        // Map Supabase data to LandRequest interface
        const mappedRequests = (data || []).map((req: any) => mapSupabaseToLandRequest(req));
        setRequests(mappedRequests);
      } catch (err: any) {
        console.error("Error fetching land services:", err);
        setError(err.message || "Failed to load land service requests");
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [statusFilter, typeFilter, searchTerm]);

  const refreshData = async () => {
    try {
      let dbStatus: string | undefined = undefined;
      if (statusFilter === "submitted") dbStatus = "pending";
      else if (statusFilter === "in_review") dbStatus = "in_progress";
      else if (statusFilter) dbStatus = statusFilter;

      let requestType: string | undefined = undefined;
      if (typeFilter === "Registration") requestType = "new";
      else if (typeFilter === "Document Request") requestType = "document_request";

      const { data, error: fetchError } = await getAllLandServices({
        status: dbStatus,
        request_type: requestType,
        search: searchTerm || undefined,
      });
      if (!fetchError && data) {
        setRequests(data.map((req: any) => mapSupabaseToLandRequest(req)));
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.plotNumber ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? request.status === statusFilter : true;
      const matchesType = typeFilter ? request.requestType === typeFilter : true;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, searchTerm, statusFilter, typeFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredRequests.length) {
      setSelected([]);
    } else {
      setSelected(filteredRequests.map((request) => request.id));
    }
  };

  const handleAdvance = async (ids: string[]) => {
    for (const id of ids) {
      const request = requests.find((r) => r.id === id);
      if (!request) continue;
      const nextStatus = statusMap[request.status].next;
      if (!nextStatus) continue;

      // Map UI status to DB status
      let dbStatus: string = nextStatus;
      if (nextStatus === "submitted") dbStatus = "pending";
      else if (nextStatus === "in_review") dbStatus = "in_progress";

      try {
        const { error } = await updateLandService(id, { status: dbStatus });
        if (error) throw error;
      } catch (err) {
        console.error(`Error updating land service ${id}:`, err);
        alert("Failed to update status");
        return;
      }
    }
    await refreshData();
  };

  const handleRequestDocs = async (ids: string[]) => {
    const note = window.prompt("Describe the required document or information:");
    if (!note) return;
    for (const id of ids) {
      try {
        await updateLandService(id, { status: "awaiting_documents" });
        await addLandServiceNote(id, note);
      } catch (err) {
        console.error(`Error requesting docs for ${id}:`, err);
        alert("Failed to request documents");
        return;
      }
    }
    await refreshData();
  };

  const handleReject = async (ids: string[]) => {
    const note = window.prompt("Reason for rejection:");
    if (!note) return;
    for (const id of ids) {
      try {
        await updateLandService(id, { status: "rejected", notes: note });
        await addLandServiceNote(id, `Rejected: ${note}`);
      } catch (err) {
        console.error(`Error rejecting ${id}:`, err);
        alert("Failed to reject request");
        return;
      }
    }
    await refreshData();
  };

  const handleAddNote = async (ids: string[]) => {
    const note = window.prompt("Add note:");
    if (!note) return;
    for (const id of ids) {
      try {
        const { error } = await addLandServiceNote(id, note);
        if (error) throw error;
      } catch (err) {
        console.error(`Error adding note to ${id}:`, err);
        alert("Failed to add note");
        return;
      }
    }
    if (activeRequest && ids.includes(activeRequest.id)) {
      const { data: notes } = await getLandServiceNotes(activeRequest.id);
      if (notes) {
        setActiveRequest({
          ...activeRequest,
          notes: notes.map((n: any) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
        });
      }
    }
    await refreshData();
  };

  const handleExport = () => {
    const rows = [
      ["Reference", "Applicant", "Type", "Status", "LGA", "Submitted"],
      ...filteredRequests.map((req) => [
        req.reference,
        req.applicantName,
        req.requestType,
        statusMap[req.status].label,
        req.lga,
        new Date(req.submittedAt).toLocaleString(),
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "land-requests.csv");
    link.click();
  };

  const disabled = selected.length === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-taraba-green mx-auto mb-4" />
          <p className="text-gray-600">Loading land service requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-semibold">Error loading land service requests</p>
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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Land Services</h1>
          <p className="text-gray-600">
            Manage TAGIS land searches, registrations, and document requests.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by reference, applicant, or plot"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LandRequestStatus | "")}
              placeholder="Filter by status"
            >
              <option value="">All statuses</option>
              {Object.entries(statusMap).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </Select>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as LandServiceType | "")}
              placeholder="Filter by request type"
            >
              <option value="">All service types</option>
              <option value="Land Search">Land Search</option>
              <option value="Registration">Registration</option>
              <option value="Document Request">Document Request</option>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => handleAdvance(selected)}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Advance status
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => handleRequestDocs(selected)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Request docs
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => handleReject(selected)}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
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
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selected.length > 0 && selected.length === filteredRequests.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Plot / Location</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={async () => {
                      setActiveRequest(request);
                      // Fetch notes
                      try {
                        setLoadingNotes(request.id);
                        const { data: notes, error: notesError } = await getLandServiceNotes(request.id);
                        if (!notesError && notes) {
                          setActiveRequest({
                            ...request,
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
                        checked={selected.includes(request.id)}
                        onChange={() => toggleSelect(request.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{request.reference}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <p className="font-medium text-gray-900">{request.applicantName}</p>
                      {request.contactPhone && (
                        <p className="text-xs text-gray-500">{request.contactPhone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{request.requestType}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {request.plotNumber ? (
                        <>
                          <p className="font-medium text-gray-900">{request.plotNumber}</p>
                          <p className="text-xs text-gray-500">{request.location}</p>
                        </>
                      ) : (
                        request.location
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusMap[request.status].className}>
                        {statusMap[request.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(request.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                        {statusMap[request.status].next && (
                          <Button variant="outline" size="sm" onClick={() => handleAdvance([request.id])}>
                            <RefreshCcw className="mr-1 h-4 w-4" />
                            Advance
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleRequestDocs([request.id])}>
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          Docs
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddNote([request.id])}>
                          <FileText className="mr-1 h-4 w-4" />
                          Note
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No requests match the selected filters.
            </div>
          )}
        </div>
      </div>

      {activeRequest && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setActiveRequest(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <p className="text-xs uppercase text-gray-500">Reference</p>
                <h2 className="text-lg font-semibold text-gray-900">{activeRequest.reference}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveRequest(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Submitted {new Date(activeRequest.submittedAt).toLocaleString()}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge className={statusMap[activeRequest.status].className}>
                    {statusMap[activeRequest.status].label}
                  </Badge>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    <Layers className="h-3 w-3" />
                    {activeRequest.requestType}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    <MapPin className="h-3 w-3" />
                    {activeRequest.lga} LGA
                  </span>
                </div>
                {activeRequest.assignedTo && (
                  <p className="text-sm text-gray-600">
                    Assigned to:{" "}
                    <span className="font-medium text-gray-900">{activeRequest.assignedTo}</span>
                  </p>
                )}
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Applicant</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{activeRequest.applicantName}</p>
                  {activeRequest.contactPhone && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {activeRequest.contactPhone}
                    </p>
                  )}
                  {activeRequest.contactEmail && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {activeRequest.contactEmail}
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Plot / location</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  {activeRequest.plotNumber && (
                    <p className="font-medium text-gray-900 mb-1">Plot: {activeRequest.plotNumber}</p>
                  )}
                  <p>{activeRequest.location}</p>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Supporting documents</p>
                  {activeRequest.supportingDocs.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.alert("Document downloads will be wired to backend later.")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download all
                    </Button>
                  )}
                </div>
                {activeRequest.supportingDocs.length === 0 ? (
                  <p className="rounded-lg border border-yellow-100 bg-yellow-50 p-3 text-sm text-yellow-800">
                    Awaiting supporting documents.
                  </p>
                ) : (
                  <ul className="space-y-2 rounded-lg border border-gray-100 bg-white p-4 text-sm">
                    {activeRequest.supportingDocs.map((doc, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-gray-700">
                          <FileText className="h-4 w-4 text-gray-500" />
                          {doc.name}
                        </span>
                        {doc.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.alert("Download not wired to backend yet.")}
                          >
                            Download
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Notes</p>
                  <Button size="sm" variant="outline" onClick={() => handleAddNote([activeRequest.id])}>
                    Add note
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-4">
                  {activeRequest.notes.length === 0 && (
                    <p className="text-sm text-gray-500">No notes yet.</p>
                  )}
                  {activeRequest.notes.map((note, idx) => (
                    <div key={idx} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                      {note}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Workflow</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => handleAdvance([activeRequest.id])}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Advance status
                  </Button>
                  <Button variant="outline" onClick={() => handleRequestDocs([activeRequest.id])}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Request docs
                  </Button>
                  <Button variant="outline" onClick={() => handleReject([activeRequest.id])}>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => handleAddNote([activeRequest.id])}>
                    <FileText className="mr-2 h-4 w-4" />
                    Add note
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

