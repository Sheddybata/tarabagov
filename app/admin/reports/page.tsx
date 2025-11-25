"use client";

import { useMemo, useState, useEffect } from "react";
import {
  AlertCircle,
  Bell,
  Clock,
  Calendar,
  CheckCircle2,
  Download,
  Flag,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllReports, updateReport, addReportNote, getReportNotes } from "@/lib/supabase/reports";

type ReportStatus = "pending" | "in_progress" | "resolved";
type ReportCategory =
  | "Roads"
  | "Water"
  | "Health"
  | "Schools"
  | "Electricity"
  | "Sanitation"
  | "Security"
  | "Housing";

interface Report {
  id: string;
  reference: string;
  citizenName: string;
  phoneNumber?: string;
  email?: string;
  category: ReportCategory;
  status: ReportStatus;
  lga: string;
  submittedAt: string;
  description: string;
  dueDate?: string;
  isEscalated?: boolean;
  notes: string[];
  address?: string;
}

const categoryOptions: ReportCategory[] = [
  "Roads",
  "Water",
  "Health",
  "Schools",
  "Electricity",
  "Sanitation",
  "Security",
  "Housing",
];

// Helper function to map Supabase data to Report interface
function mapSupabaseToReport(supabaseReport: any, notes: any[] = []): Report {
  return {
    id: supabaseReport.id,
    reference: supabaseReport.reference_id || "",
    citizenName: "Citizen", // Reports don't have citizen name, using placeholder
    phoneNumber: supabaseReport.contact_phone || undefined,
    email: supabaseReport.contact_email || undefined,
    category: supabaseReport.category as ReportCategory,
    status: (supabaseReport.status || "pending") as ReportStatus,
    lga: supabaseReport.lga || "Unknown",
    submittedAt: supabaseReport.created_at || new Date().toISOString(),
    description: supabaseReport.description || "",
    dueDate: supabaseReport.due_date || undefined,
    isEscalated: supabaseReport.is_escalated || false,
    notes: notes.map((n) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
    address: supabaseReport.location_address || undefined,
  };
}

const statusConfig: Record<
  ReportStatus,
  { label: string; className: string; next: ReportStatus }
> = {
  pending: {
    label: "Pending",
    className: "bg-orange-100 text-orange-800",
    next: "in_progress",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800",
    next: "resolved",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 text-green-800",
    next: "resolved",
  },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "">("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Report | "dueDate";
    direction: "asc" | "desc";
  }>({ field: "submittedAt", direction: "desc" });
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [loadingNotes, setLoadingNotes] = useState<string | null>(null);

  // Fetch reports from Supabase
  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getAllReports({
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
          search: searchTerm || undefined,
        });

        if (fetchError) {
          console.error("❌ Error fetching reports:", fetchError);
          throw fetchError;
        }

        console.log("✅ Reports fetched:", data?.length || 0, "reports");
        
        // Map Supabase data to Report interface
        const mappedReports = (data || []).map((report: any) => mapSupabaseToReport(report));
        console.log("✅ Mapped reports:", mappedReports.length);
        setReports(mappedReports);
      } catch (err: any) {
        console.error("❌ Error fetching reports:", err);
        setError(err.message || "Failed to load reports");
        // Show error in UI
        alert(`Error loading reports: ${err.message}\n\nCheck:\n1. You are logged in as admin\n2. RLS policy allows SELECT for admins\n3. Browser console for details`);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [statusFilter, categoryFilter, searchTerm]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter
        ? report.category === categoryFilter
        : true;
      const matchesStatus = statusFilter ? report.status === statusFilter : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [reports, searchTerm, categoryFilter, statusFilter]);

  const sortedReports = useMemo(() => {
    const sorted = [...filteredReports].sort((a, b) => {
      const { field, direction } = sortConfig;
      let valueA: string | number = a[field] ? (a[field] as any) : "";
      let valueB: string | number = b[field] ? (b[field] as any) : "";

      if (field === "submittedAt" || field === "dueDate") {
        valueA = a[field] ? new Date(a[field] as string).getTime() : 0;
        valueB = b[field] ? new Date(b[field] as string).getTime() : 0;
      }

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredReports, sortConfig]);

  const toggleSort = (field: keyof Report | "dueDate") => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

  const handleRowSelect = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((selected) => selected !== id) : [...prev, id]
    );
  };

  const openReportDetails = async (report: Report) => {
    setActiveReport(report);
    // Fetch notes for this report
    try {
      setLoadingNotes(report.id);
      const { data: notes, error: notesError } = await getReportNotes(report.id);
      if (!notesError && notes) {
        setActiveReport({
          ...report,
          notes: notes.map((n: any) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
        });
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoadingNotes(null);
    }
  };

  const closeReportDetails = () => {
    setActiveReport(null);
  };

  const handleSelectAll = () => {
    if (selectedReports.length === sortedReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(sortedReports.map((report) => report.id));
    }
  };

  const handleAdvanceStatus = async (ids: string[]) => {
    for (const id of ids) {
      const report = reports.find((r) => r.id === id);
      if (!report) continue;
      const nextStatus = statusConfig[report.status].next;
      try {
        const { error } = await updateReport(id, { status: nextStatus });
        if (error) throw error;
      } catch (err) {
        console.error(`Error updating report ${id}:`, err);
        alert(`Failed to update report ${report.reference}`);
        return;
      }
    }
    // Refresh reports
    const { data, error } = await getAllReports({
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      search: searchTerm || undefined,
    });
    if (!error && data) {
      setReports(data.map((r: any) => mapSupabaseToReport(r)));
    }
  };

  const handleAddNote = async (ids: string[]) => {
    const note = window.prompt("Add follow-up note:");
    if (!note) return;
    for (const id of ids) {
      try {
        const { error } = await addReportNote(id, note);
        if (error) throw error;
      } catch (err) {
        console.error(`Error adding note to report ${id}:`, err);
        alert("Failed to add note");
        return;
      }
    }
    // Refresh active report if it's one of the updated ones
    if (activeReport && ids.includes(activeReport.id)) {
      const { data: notes } = await getReportNotes(activeReport.id);
      if (notes) {
        setActiveReport({
          ...activeReport,
          notes: notes.map((n: any) => `${new Date(n.created_at).toLocaleString()}: ${n.note}`),
        });
      }
    }
    // Refresh reports
    const { data, error } = await getAllReports({
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      search: searchTerm || undefined,
    });
    if (!error && data) {
      setReports(data.map((r: any) => mapSupabaseToReport(r)));
    }
  };

  const handleSetDueDate = async (ids: string[]) => {
    const date = window.prompt("Set due date (YYYY-MM-DD):");
    if (!date) return;
    for (const id of ids) {
      try {
        const { error } = await updateReport(id, { due_date: date });
        if (error) throw error;
      } catch (err) {
        console.error(`Error setting due date for report ${id}:`, err);
        alert("Failed to set due date");
        return;
      }
    }
    // Refresh reports
    const { data, error } = await getAllReports({
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      search: searchTerm || undefined,
    });
    if (!error && data) {
      setReports(data.map((r: any) => mapSupabaseToReport(r)));
    }
  };

  const handleEscalate = async (ids: string[]) => {
    for (const id of ids) {
      try {
        const { error } = await updateReport(id, { is_escalated: true });
        if (error) throw error;
      } catch (err) {
        console.error(`Error escalating report ${id}:`, err);
        alert("Failed to escalate report");
        return;
      }
    }
    // Refresh reports
    const { data, error } = await getAllReports({
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      search: searchTerm || undefined,
    });
    if (!error && data) {
      setReports(data.map((r: any) => mapSupabaseToReport(r)));
    }
  };

  const handleNotify = (ids: string[]) => {
    alert(
      `Notification queued for ${ids.length} report(s). Actual email/SMS will be wired once backend is connected.`
    );
  };

  const handleExport = () => {
    const rows = [
      ["Reference", "Category", "Status", "LGA", "Submitted", "Due Date"],
      ...sortedReports.map((report) => [
        report.reference,
        report.category,
        statusConfig[report.status].label,
        report.lga,
        new Date(report.submittedAt).toLocaleString(),
        report.dueDate || "-",
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "citizen-reports.csv");
    link.click();
  };

  const selectionDisabled = selectedReports.length === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-taraba-green mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p className="font-semibold">Error loading reports</p>
        </div>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Citizen Reports</h1>
        <p className="text-gray-600">
          Track and resolve infrastructure complaints and service requests.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by reference or citizen name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="Filter by category"
          >
            <option value="">All categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "")}
            placeholder="Filter by status"
          >
            <option value="">All statuses</option>
            {Object.entries(statusConfig).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={selectionDisabled}
            onClick={() => handleAdvanceStatus(selectedReports)}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Advance status
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selectionDisabled}
            onClick={() => handleAddNote(selectedReports)}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Add note
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selectionDisabled}
            onClick={() => handleSetDueDate(selectedReports)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Set due date
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selectionDisabled}
            onClick={() => handleEscalate(selectedReports)}
          >
            <Flag className="mr-2 h-4 w-4" />
            Escalate
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={selectionDisabled}
            onClick={() => handleNotify(selectedReports)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Notify citizen
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
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={
                      selectedReports.length > 0 &&
                      selectedReports.length === sortedReports.length
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all reports"
                  />
                </th>
                {[
                  { label: "Reference", field: "reference" as const },
                  { label: "Category", field: "category" as const },
                  { label: "LGA", field: "lga" as const },
                  { label: "Status", field: "status" as const },
                  { label: "Submitted", field: "submittedAt" as const },
                  { label: "Due Date", field: "dueDate" as const },
                ].map((column) => (
                  <th
                    key={column.field}
                    className="px-6 py-3 cursor-pointer"
                    onClick={() => toggleSort(column.field)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {sortConfig.field === column.field && (
                        <span>
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {sortedReports.map((report) => {
                const statusMeta = statusConfig[report.status];
                return (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openReportDetails(report)}
                  >
                    <td className="px-6 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(report.id);
                        }}
                        aria-label={`Select report ${report.reference}`}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {report.reference}
                      {report.isEscalated && (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                          Escalated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{report.category}</td>
                    <td className="px-6 py-4 text-gray-700">{report.lga}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusMeta.className}>{statusMeta.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(report.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {report.dueDate ? (
                        <span>{new Date(report.dueDate).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvanceStatus([report.id]);
                          }}
                        >
                          <RefreshCcw className="mr-1 h-4 w-4" />
                          {report.status === "resolved" ? "Resolved" : "Advance"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddNote([report.id]);
                          }}
                        >
                          <AlertCircle className="mr-1 h-4 w-4" />
                          Note
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEscalate([report.id]);
                          }}
                        >
                          <Flag className="mr-1 h-4 w-4" />
                          Escalate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotify([report.id]);
                          }}
                        >
                          <Bell className="mr-1 h-4 w-4" />
                          Notify
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedReports.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No reports found for the selected filters.
          </div>
        )}
      </div>
    </div>

    {activeReport && (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="flex-1 bg-black/40"
          onClick={closeReportDetails}
          aria-hidden="true"
        />
        <div className="relative w-full max-w-md overflow-y-auto bg-white shadow-2xl">
          <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
              <p className="text-xs uppercase text-gray-500">Reference</p>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeReport.reference}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={closeReportDetails}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6 px-6 py-5">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                Submitted {new Date(activeReport.submittedAt).toLocaleString()}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className={statusConfig[activeReport.status].className}>
                  {statusConfig[activeReport.status].label}
                </Badge>
                {activeReport.lga && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    <MapPin className="h-3 w-3" />
                    {activeReport.lga} LGA
                  </span>
                )}
                {activeReport.isEscalated && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    <Flag className="h-3 w-3" />
                    Escalated
                  </span>
                )}
              </div>
              {activeReport.dueDate && (
                <div className="text-sm text-gray-600">
                  Due by:{" "}
                  <span className="font-medium text-gray-900">
                    {new Date(activeReport.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </section>

            <section className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Issue Description</p>
              <p className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                {activeReport.description}
              </p>
            </section>

            <section className="space-y-3">
              <p className="text-sm font-semibold text-gray-800">Citizen Contact</p>
              <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <AlertCircle className="h-4 w-4 text-taraba-green" />
                  <span className="font-medium">{activeReport.citizenName}</span>
                </div>
                {activeReport.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {activeReport.phoneNumber}
                  </div>
                )}
                {activeReport.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {activeReport.email}
                  </div>
                )}
                {activeReport.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{activeReport.address}</span>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Notes & updates</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddNote([activeReport.id])}
                >
                  Add note
                </Button>
              </div>
              <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-4">
                {activeReport.notes.length === 0 && (
                  <p className="text-sm text-gray-500">No notes yet.</p>
                )}
                {activeReport.notes.map((note, idx) => (
                  <div key={idx} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    {note}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <p className="text-sm font-semibold text-gray-800">Workflow actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAdvanceStatus([activeReport.id])}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Advance status
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSetDueDate([activeReport.id])}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Set due date
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleEscalate([activeReport.id])}
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Escalate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNotify([activeReport.id])}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notify citizen
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

