"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

const initialReports: Report[] = [
  {
    id: "1",
    reference: "TS-892341",
    citizenName: "Rahman Yusuf",
    phoneNumber: "0803 456 7890",
    email: "rahman.yusuf@example.com",
    category: "Roads",
    status: "pending",
    lga: "Jalingo",
    submittedAt: "2024-11-10T08:30:00Z",
    description:
      "Please provide a detailed description of the issue... Large pothole along Wukari Road opposite the central market causing vehicles to swerve into incoming traffic.",
    notes: [],
    address: "Wukari Road, Central Market Junction",
  },
  {
    id: "2",
    reference: "TS-892340",
    citizenName: "Ruth Terkuma",
    phoneNumber: "0802 178 2214",
    email: "ruth.terkuma@example.com",
    category: "Water",
    status: "in_progress",
    lga: "Takum",
    submittedAt: "2024-11-09T14:10:00Z",
    description: "Burst water pipe flooding the market square.",
    dueDate: "2024-11-15",
    notes: ["Assigned to Water Board Technical Team."],
    address: "Takum New Market Square",
  },
  {
    id: "3",
    reference: "TS-892339",
    citizenName: "Ibrahim Sadiq",
    phoneNumber: "0805 112 9988",
    email: "ibrahim.sadiq@example.com",
    category: "Electricity",
    status: "pending",
    lga: "Bali",
    submittedAt: "2024-11-08T10:05:00Z",
    description: "Transformer failure leading to 3-day blackout.",
    notes: [],
    address: "Kofar Fada district, Bali",
  },
  {
    id: "4",
    reference: "TS-892338",
    citizenName: "Favour Amos",
    phoneNumber: "0810 778 3422",
    email: "favour.amos@example.com",
    category: "Health",
    status: "resolved",
    lga: "Gassol",
    submittedAt: "2024-11-07T09:15:00Z",
    description: "Shortage of vaccines at primary health center.",
    dueDate: "2024-11-09",
    notes: ["Supplies delivered and acknowledged."],
    address: "Primary Health Center, Mutum Biyu",
  },
];

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
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "">("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    field: keyof Report | "dueDate";
    direction: "asc" | "desc";
  }>({ field: "submittedAt", direction: "desc" });
  const [activeReport, setActiveReport] = useState<Report | null>(null);

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

  const openReportDetails = (report: Report) => {
    setActiveReport(report);
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

  const updateReports = (ids: string[], updater: (report: Report) => Report) => {
    setReports((prev) =>
      prev.map((report) =>
        ids.includes(report.id) ? updater(report) : report
      )
    );
  };

  const handleAdvanceStatus = (ids: string[]) => {
    updateReports(ids, (report) => ({
      ...report,
      status: statusConfig[report.status].next,
    }));
  };

  const handleAddNote = (ids: string[]) => {
    const note = window.prompt("Add follow-up note:");
    if (!note) return;
    updateReports(ids, (report) => ({
      ...report,
      notes: [...report.notes, `${new Date().toLocaleString()}: ${note}`],
    }));
  };

  const handleSetDueDate = (ids: string[]) => {
    const date = window.prompt("Set due date (YYYY-MM-DD):");
    if (!date) return;
    updateReports(ids, (report) => ({
      ...report,
      dueDate: date,
    }));
  };

  const handleEscalate = (ids: string[]) => {
    updateReports(ids, (report) => ({
      ...report,
      isEscalated: true,
    }));
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

