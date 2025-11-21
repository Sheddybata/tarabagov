"use client";

import { useMemo, useState } from "react";
import {
  Baby,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type RegistryStatus = "pending_review" | "awaiting_documents" | "approved" | "rejected";

interface BirthRegistration {
  id: string;
  reference: string;
  childName: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  birthType: "Hospital" | "Home";
  birthLocation: string;
  placeOfBirth: string;
  fatherName: string;
  motherName: string;
  fatherNIN: string;
  motherNIN: string;
  contactEmail?: string;
  contactPhone?: string;
  status: RegistryStatus;
  submittedAt: string;
  hospitalNotificationUrl?: string;
  notes: string[];
}

const statusMeta: Record<
  RegistryStatus,
  { label: string; className: string; next?: RegistryStatus }
> = {
  pending_review: {
    label: "Pending Review",
    className: "bg-orange-100 text-orange-800",
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

const initialRegistrations: BirthRegistration[] = [
  {
    id: "1",
    reference: "BR-102934",
    childName: "Aisha Mohammed",
    dateOfBirth: "2024-10-12",
    gender: "Female",
    birthType: "Hospital",
    birthLocation: "Federal Medical Centre, Jalingo",
    placeOfBirth: "Jalingo",
    fatherName: "Mohammed Idris",
    motherName: "Hauwa Ibrahim",
    fatherNIN: "12345678901",
    motherNIN: "10987654321",
    contactEmail: "hauwa.ibrahim@example.com",
    contactPhone: "0802 178 2214",
    status: "pending_review",
    submittedAt: "2024-11-08T09:15:00Z",
    hospitalNotificationUrl: "#",
    notes: [],
  },
  {
    id: "2",
    reference: "BR-102935",
    childName: "David Longkat",
    dateOfBirth: "2024-09-30",
    gender: "Male",
    birthType: "Home",
    birthLocation: "No. 12, Wukari Road, Takum",
    placeOfBirth: "Takum",
    fatherName: "Longkat Uche",
    motherName: "Rose Longkat",
    fatherNIN: "22345678901",
    motherNIN: "20987654321",
    contactEmail: "rose.longkat@example.com",
    contactPhone: "0803 456 7890",
    status: "awaiting_documents",
    submittedAt: "2024-11-06T11:40:00Z",
    notes: ["Request proof of home birth from community health worker."],
  },
  {
    id: "3",
    reference: "BR-102936",
    childName: "Grace Bala",
    dateOfBirth: "2024-10-01",
    gender: "Female",
    birthType: "Hospital",
    birthLocation: "General Hospital, Bali",
    placeOfBirth: "Bali",
    fatherName: "Bala Sunday",
    motherName: "Miriam Bala",
    fatherNIN: "32345678901",
    motherNIN: "30987654321",
    contactEmail: "miriam.bala@example.com",
    contactPhone: "0805 112 9988",
    status: "approved",
    submittedAt: "2024-10-28T14:05:00Z",
    hospitalNotificationUrl: "#",
    notes: ["Certificate issued on 2024-11-01."],
  },
];

export default function AdminBirthRegistrationsPage() {
  const [registrations, setRegistrations] = useState<BirthRegistration[]>(initialRegistrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RegistryStatus | "">("");
  const [birthTypeFilter, setBirthTypeFilter] = useState<"Hospital" | "Home" | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeRegistration, setActiveRegistration] = useState<BirthRegistration | null>(null);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((entry) => {
      const matchesSearch =
        entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.motherName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? entry.status === statusFilter : true;
      const matchesBirthType = birthTypeFilter ? entry.birthType === birthTypeFilter : true;

      return matchesSearch && matchesStatus && matchesBirthType;
    });
  }, [registrations, searchTerm, statusFilter, birthTypeFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredRegistrations.length) {
      setSelected([]);
    } else {
      setSelected(filteredRegistrations.map((entry) => entry.id));
    }
  };

  const updateEntries = (ids: string[], updater: (entry: BirthRegistration) => BirthRegistration) => {
    setRegistrations((prev) =>
      prev.map((entry) => (ids.includes(entry.id) ? updater(entry) : entry))
    );
  };

  const handleStatusChange = (ids: string[], newStatus: RegistryStatus) => {
    updateEntries(ids, (entry) => ({ ...entry, status: newStatus }));
  };

  const handleRequestDocuments = (ids: string[]) => {
    const note = window.prompt("Describe the missing documents or information:");
    updateEntries(ids, (entry) => ({
      ...entry,
      status: "awaiting_documents",
      notes: note ? [...entry.notes, `${new Date().toLocaleString()}: ${note}`] : entry.notes,
    }));
  };

  const handleAddNote = (ids: string[]) => {
    const note = window.prompt("Add note:");
    if (!note) return;
    updateEntries(ids, (entry) => ({
      ...entry,
      notes: [...entry.notes, `${new Date().toLocaleString()}: ${note}`],
    }));
  };

  const handleExport = () => {
    const rows = [
      ["Reference", "Child", "Birth Type", "DOB", "Status", "Submitted"],
      ...filteredRegistrations.map((entry) => [
        entry.reference,
        entry.childName,
        entry.birthType,
        entry.dateOfBirth,
        statusMeta[entry.status].label,
        new Date(entry.submittedAt).toLocaleString(),
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "birth-registrations.csv");
    link.click();
  };

  const selectedDisabled = selected.length === 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Birth Registrations</h1>
          <p className="text-gray-600">
            Review applications, verify documents, and issue birth certificates.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by reference, child or parent name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RegistryStatus | "")}
              placeholder="Filter by status"
            >
              <option value="">All statuses</option>
              {Object.entries(statusMeta).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </Select>
            <Select
              value={birthTypeFilter}
              onChange={(e) => setBirthTypeFilter(e.target.value as "Hospital" | "Home" | "")}
              placeholder="Filter by birth type"
            >
              <option value="">All birth types</option>
              <option value="Hospital">Hospital</option>
              <option value="Home">Home</option>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDisabled}
              onClick={() => handleStatusChange(selected, "approved")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDisabled}
              onClick={() => handleRequestDocuments(selected)}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Request documents
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDisabled}
              onClick={() => handleStatusChange(selected, "rejected")}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selectedDisabled}
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
            <table className="w-full min-w-[740px]">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selected.length > 0 && selected.length === filteredRegistrations.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Child</th>
                  <th className="px-6 py-3">Birth Type</th>
                  <th className="px-6 py-3">Date of Birth</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRegistrations.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setActiveRegistration(entry)}
                  >
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selected.includes(entry.id)}
                        onChange={() => toggleSelect(entry.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{entry.reference}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <p className="font-medium text-gray-900">{entry.childName}</p>
                      <p className="text-xs text-gray-500">{entry.gender}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{entry.birthType}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(entry.dateOfBirth).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusMeta[entry.status].className}>
                        {statusMeta[entry.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(entry.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                        {statusMeta[entry.status].next && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusChange([entry.id], statusMeta[entry.status].next!)
                            }
                          >
                            <RefreshCcw className="mr-1 h-4 w-4" />
                            Advance
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestDocuments([entry.id])}
                        >
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          Docs
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddNote([entry.id])}>
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

          {filteredRegistrations.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No registrations match the selected filters.
            </div>
          )}
        </div>
      </div>

      {activeRegistration && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setActiveRegistration(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <p className="text-xs uppercase text-gray-500">Reference</p>
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeRegistration.reference}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveRegistration(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Submitted {new Date(activeRegistration.submittedAt).toLocaleString()}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge className={statusMeta[activeRegistration.status].className}>
                    {statusMeta[activeRegistration.status].label}
                  </Badge>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    <MapPin className="h-3 w-3" />
                    {activeRegistration.placeOfBirth}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    <Baby className="h-3 w-3" />
                    {activeRegistration.birthType} birth
                  </span>
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Child Details</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{activeRegistration.childName}</p>
                  <p>
                    Date of Birth:{" "}
                    {new Date(activeRegistration.dateOfBirth).toLocaleDateString()}
                  </p>
                  <p>Gender: {activeRegistration.gender}</p>
                  <p>Birth Location: {activeRegistration.birthLocation}</p>
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Parent Details</p>
                <div className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <div>
                    <p className="font-medium text-gray-900">{activeRegistration.fatherName}</p>
                    <p className="text-xs text-gray-500">Father • NIN {activeRegistration.fatherNIN}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activeRegistration.motherName}</p>
                    <p className="text-xs text-gray-500">Mother • NIN {activeRegistration.motherNIN}</p>
                  </div>
                  {activeRegistration.contactPhone && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {activeRegistration.contactPhone}
                    </p>
                  )}
                  {activeRegistration.contactEmail && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {activeRegistration.contactEmail}
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Documents</p>
                  {activeRegistration.hospitalNotificationUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.alert("Download not wired to backend yet.")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download proof
                    </Button>
                  )}
                </div>
                {activeRegistration.hospitalNotificationUrl ? (
                  <p className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-800">
                    Hospital Notification of Birth uploaded.
                  </p>
                ) : (
                  <p className="rounded-lg border border-yellow-100 bg-yellow-50 p-3 text-sm text-yellow-800">
                    Awaiting upload of Hospital Notification / proof of birth.
                  </p>
                )}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Notes & updates</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddNote([activeRegistration.id])}
                  >
                    Add note
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-4">
                  {activeRegistration.notes.length === 0 && (
                    <p className="text-sm text-gray-500">No notes yet.</p>
                  )}
                  {activeRegistration.notes.map((note, idx) => (
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
                    onClick={() => handleStatusChange([activeRegistration.id], "approved")}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRequestDocuments([activeRegistration.id])}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Request docs
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange([activeRegistration.id], "rejected")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => handleAddNote([activeRegistration.id])}>
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

