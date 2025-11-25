"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllSchools, upsertSchool, deleteSchool } from "@/lib/supabase/schools";

type SchoolLevel = "Primary" | "Secondary" | "Tertiary";
type Ownership = "Public" | "Private" | "Mission";
type AccreditationStatus = "Accredited" | "Pending" | "Suspended";

interface School {
  id: string;
  name: string;
  level: SchoolLevel;
  ownership: Ownership;
  lga: string;
  address: string;
  contactPerson: string;
  phone?: string;
  email?: string;
  enrollmentMale: number;
  enrollmentFemale: number;
  lastInspection?: string;
  status: AccreditationStatus;
  boarding: boolean;
  notes: string[];
}

const statusClassMap: Record<AccreditationStatus, string> = {
  Accredited: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-700",
  Suspended: "bg-red-100 text-red-700",
};

const getTotalEnrollment = (school: { enrollmentMale: number; enrollmentFemale: number }) =>
  (school.enrollmentMale || 0) + (school.enrollmentFemale || 0);

// Helper function to map Supabase data to School interface
function mapSupabaseToSchool(supabaseData: any): School {
  // Map accreditation_status to AccreditationStatus
  let status: AccreditationStatus = "Pending";
  const accStatus = supabaseData.accreditation_status || supabaseData.status;
  if (accStatus === "Accredited" || accStatus === "accredited") status = "Accredited";
  else if (accStatus === "Suspended" || accStatus === "suspended") status = "Suspended";
  else status = "Pending";

  // Parse notes from string or array
  let notes: string[] = [];
  if (supabaseData.notes) {
    if (typeof supabaseData.notes === "string") {
      notes = supabaseData.notes.split("\n").filter((n: string) => n.trim());
    } else if (Array.isArray(supabaseData.notes)) {
      notes = supabaseData.notes;
    }
  }

  return {
    id: supabaseData.id,
    name: supabaseData.name || "",
    level: (supabaseData.level || "Secondary") as SchoolLevel,
    ownership: (supabaseData.ownership || "Public") as Ownership,
    lga: supabaseData.lga || "Unknown",
    address: supabaseData.address || "",
    contactPerson: "N/A", // Not stored in DB
    phone: supabaseData.contact_phone || undefined,
    email: supabaseData.contact_email || undefined,
    enrollmentMale: supabaseData.enrollment_male || 0,
    enrollmentFemale: supabaseData.enrollment_female || 0,
    lastInspection: supabaseData.last_inspection_date || undefined,
    status,
    boarding: supabaseData.boarding || false,
    notes,
  };
}

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<SchoolLevel | "">("");
  const [ownershipFilter, setOwnershipFilter] = useState<Ownership | "">("");
  const [statusFilter, setStatusFilter] = useState<AccreditationStatus | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSchool, setActiveSchool] = useState<School | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [formState, setFormState] = useState<Partial<School>>({
    level: "Secondary",
    ownership: "Public",
    status: "Pending",
    boarding: false,
    enrollmentMale: 0,
    enrollmentFemale: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch schools from Supabase
  useEffect(() => {
    async function fetchSchools() {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getAllSchools({
          level: levelFilter || undefined,
          ownership: ownershipFilter || undefined,
          search: searchTerm || undefined,
        });

        if (fetchError) {
          throw fetchError;
        }

        // Map Supabase data to School interface
        const mappedSchools = (data || []).map((school: any) => mapSupabaseToSchool(school));
        setSchools(mappedSchools);
      } catch (err: any) {
        console.error("Error fetching schools:", err);
        setError(err.message || "Failed to load schools");
      } finally {
        setLoading(false);
      }
    }

    fetchSchools();
  }, [levelFilter, ownershipFilter, searchTerm]);

  const refreshData = async () => {
    try {
      const { data, error: fetchError } = await getAllSchools({
        level: levelFilter || undefined,
        ownership: ownershipFilter || undefined,
        search: searchTerm || undefined,
      });
      if (!fetchError && data) {
        setSchools(data.map((school: any) => mapSupabaseToSchool(school)));
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesSearch =
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.lga.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter ? school.level === levelFilter : true;
      const matchesOwnership = ownershipFilter ? school.ownership === ownershipFilter : true;
      const matchesStatus = statusFilter ? school.status === statusFilter : true;

      return matchesSearch && matchesLevel && matchesOwnership && matchesStatus;
    });
  }, [schools, searchTerm, levelFilter, ownershipFilter, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredSchools.length) {
      setSelected([]);
    } else {
      setSelected(filteredSchools.map((school) => school.id));
    }
  };

  const handleStatusChange = async (ids: string[], status: AccreditationStatus) => {
    for (const id of ids) {
      try {
        const school = schools.find((s) => s.id === id);
        if (!school) continue;
        
        const { error } = await upsertSchool({
          id,
          name: school.name,
          level: school.level,
          ownership: school.ownership,
          lga: school.lga,
          accreditation_status: status,
          status: status,
        });
        if (error) throw error;
      } catch (err) {
        console.error(`Error updating school ${id}:`, err);
        alert("Failed to update status");
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
        const school = schools.find((s) => s.id === id);
        if (!school) continue;
        const existingNotes = school.notes.join("\n");
        const newNotes = existingNotes ? `${existingNotes}\n${new Date().toLocaleString()}: ${note}` : `${new Date().toLocaleString()}: ${note}`;
        const { error } = await upsertSchool({
          id,
          name: school.name,
          level: school.level,
          ownership: school.ownership,
          lga: school.lga,
          notes: newNotes,
        });
        if (error) throw error;
      } catch (err) {
        console.error(`Error adding note to ${id}:`, err);
        alert("Failed to add note");
        return;
      }
    }
    await refreshData();
  };

  const handleExport = () => {
    const rows = [
      [
        "Name",
        "Level",
        "Ownership",
        "Male Enrollment",
        "Female Enrollment",
        "Total Enrollment",
        "Status",
        "LGA",
        "Last Inspection",
      ],
      ...filteredSchools.map((school) => [
        school.name,
        school.level,
        school.ownership,
        school.enrollmentMale,
        school.enrollmentFemale,
        getTotalEnrollment(school),
        school.status,
        school.lga,
        school.lastInspection ? new Date(school.lastInspection).toLocaleDateString() : "N/A",
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "school-records.csv");
    link.click();
  };

  const openAddDrawer = (school?: School) => {
    if (school) {
      setFormState(school);
      setIsEditing(true);
    } else {
      setFormState({
        level: "Secondary",
        ownership: "Public",
        status: "Pending",
        boarding: false,
        enrollmentMale: 0,
        enrollmentFemale: 0,
      });
      setIsEditing(false);
    }
    setIsAddDrawerOpen(true);
  };

  const closeAddDrawer = () => {
    setIsAddDrawerOpen(false);
    setIsEditing(false);
  };

  const handleFormChange = (field: keyof School, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSchool = async () => {
    if (!formState.name || !formState.lga || !formState.level || !formState.ownership) {
      window.alert("Please fill in required fields.");
      return;
    }

    try {
      setSaving(true);
      
      // Map UI form to Supabase format
      const schoolData = {
        id: isEditing ? formState.id : undefined,
        name: formState.name!,
        level: formState.level!,
        ownership: formState.ownership!,
        lga: formState.lga!,
        address: formState.address || undefined,
        contact_phone: formState.phone || undefined,
        contact_email: formState.email || undefined,
        enrollment_male: formState.enrollmentMale || 0,
        enrollment_female: formState.enrollmentFemale || 0,
        last_inspection_date: formState.lastInspection || undefined,
        accreditation_status: formState.status || "Pending",
        boarding: formState.boarding || false,
        notes: formState.notes?.join("\n") || undefined,
        status: formState.status || "Pending",
      };

      const { data, error: saveError } = await upsertSchool(schoolData);

      if (saveError) {
        throw saveError;
      }

      closeAddDrawer();
      await refreshData();
    } catch (err: any) {
      console.error("Error saving school:", err);
      alert(err.message || "Failed to save school");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">School Records</h1>
            <p className="text-gray-600">
              Manage Taraba State institutions: approvals, inspections, and compliance.
            </p>
          </div>
          <Button onClick={() => openAddDrawer()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add school
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by school, contact, or LGA"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as SchoolLevel | "")}
              placeholder="Filter by level"
            >
              <option value="">All levels</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Tertiary">Tertiary</option>
            </Select>
            <Select
              value={ownershipFilter}
              onChange={(e) => setOwnershipFilter(e.target.value as Ownership | "")}
              placeholder="Ownership"
            >
              <option value="">All ownerships</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Mission">Mission</option>
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AccreditationStatus | "")}
              placeholder="Accreditation status"
            >
              <option value="">All statuses</option>
              <option value="Accredited">Accredited</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleStatusChange(selected, "Accredited")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Mark accredited
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleStatusChange(selected, "Suspended")}
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
            <table className="w-full min-w-[780px]">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={
                        selected.length > 0 && selected.length === filteredSchools.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">School</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Enrollment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last inspection</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSchools.map((school) => (
                  <tr
                    key={school.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setActiveSchool(school)}
                  >
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selected.includes(school.id)}
                        onChange={() => toggleSelect(school.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{school.name}</p>
                      <p className="text-xs text-gray-500">
                        {school.ownership} • {school.lga}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{school.level}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {getTotalEnrollment(school).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {school.enrollmentMale.toLocaleString()} male •{" "}
                        {school.enrollmentFemale.toLocaleString()} female
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusClassMap[school.status]}>
                        {school.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {school.lastInspection
                        ? new Date(school.lastInspection).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => openAddDrawer(school)}>
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddNote([school.id])}
                        >
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

          {filteredSchools.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No schools match the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {activeSchool && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setActiveSchool(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <p className="text-xs uppercase text-gray-500">School</p>
                <h2 className="text-lg font-semibold text-gray-900">{activeSchool.name}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveSchool(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {activeSchool.address}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge className={statusClassMap[activeSchool.status]}>
                    {activeSchool.status}
                  </Badge>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {activeSchool.level} • {activeSchool.ownership}
                  </span>
                  {activeSchool.boarding && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      Boarding
                    </span>
                  )}
                </div>
                {activeSchool.lastInspection && (
                  <div className="text-sm text-gray-600">
                    Last inspection:{" "}
                    <span className="font-medium text-gray-900">
                      {new Date(activeSchool.lastInspection).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Contact</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{activeSchool.contactPerson}</p>
                  {activeSchool.phone && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {activeSchool.phone}
                    </p>
                  )}
                  {activeSchool.email && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {activeSchool.email}
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Enrollment</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">
                      {getTotalEnrollment(activeSchool).toLocaleString()} students
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {activeSchool.enrollmentMale.toLocaleString()} male •{" "}
                    {activeSchool.enrollmentFemale.toLocaleString()} female
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Notes & Compliance</p>
                  <Button size="sm" variant="outline" onClick={() => handleAddNote([activeSchool.id])}>
                    Add note
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-4">
                  {activeSchool.notes.length === 0 && (
                    <p className="text-sm text-gray-500">No notes yet.</p>
                  )}
                  {activeSchool.notes.map((note, idx) => (
                    <div key={idx} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                      {note}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Quick actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange([activeSchool.id], "Accredited")}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Mark accredited
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange([activeSchool.id], "Suspended")}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Suspend
                  </Button>
                  <Button variant="outline" onClick={() => openAddDrawer(activeSchool)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit school
                  </Button>
                  <Button variant="outline" onClick={() => handleAddNote([activeSchool.id])}>
                    <FileText className="mr-2 h-4 w-4" />
                    Add note
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Drawer */}
      {isAddDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={closeAddDrawer}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <p className="text-xs uppercase text-gray-500">
                  {isEditing ? "Edit school" : "Add new school"}
                </p>
                <h2 className="text-lg font-semibold text-gray-900">
                  {formState.name || "New school"}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeAddDrawer}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="text-sm font-medium text-gray-700">School name</label>
                <Input
                  value={formState.name || ""}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter school name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <Select
                    value={(formState.level as SchoolLevel) || ""}
                    onChange={(e) => handleFormChange("level", e.target.value as SchoolLevel)}
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Tertiary">Tertiary</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ownership</label>
                  <Select
                    value={(formState.ownership as Ownership) || ""}
                    onChange={(e) =>
                      handleFormChange("ownership", e.target.value as Ownership)
                    }
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Mission">Mission</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">LGA</label>
                  <Input
                    value={formState.lga || ""}
                    onChange={(e) => handleFormChange("lga", e.target.value)}
                    placeholder="Enter LGA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Accreditation status</label>
                  <Select
                    value={(formState.status as AccreditationStatus) || ""}
                    onChange={(e) =>
                      handleFormChange("status", e.target.value as AccreditationStatus)
                    }
                  >
                    <option value="Accredited">Accredited</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <Input
                  value={formState.address || ""}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  placeholder="Street, town"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact person</label>
                  <Input
                    value={formState.contactPerson || ""}
                    onChange={(e) => handleFormChange("contactPerson", e.target.value)}
                    placeholder="Name of administrator"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input
                    value={formState.phone || ""}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    placeholder="080..."
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  value={formState.email || ""}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="school@example.com"
                  type="email"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Male enrollment</label>
                  <Input
                    type="number"
                    min={0}
                    value={formState.enrollmentMale ?? 0}
                    onChange={(e) => handleFormChange("enrollmentMale", Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Female enrollment</label>
                  <Input
                    type="number"
                    min={0}
                    value={formState.enrollmentFemale ?? 0}
                    onChange={(e) =>
                      handleFormChange("enrollmentFemale", Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Last inspection</label>
                  <Input
                    type="date"
                    value={formState.lastInspection || ""}
                    onChange={(e) => handleFormChange("lastInspection", e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <p className="text-sm text-gray-600">
                    Total enrollment:{" "}
                    <span className="font-semibold text-gray-900">
                      {((formState.enrollmentMale || 0) + (formState.enrollmentFemale || 0)).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={formState.boarding ?? false}
                  onChange={(e) => handleFormChange("boarding", e.target.checked)}
                />
                <span className="text-sm text-gray-700">Boarding facility available</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={closeAddDrawer}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSchool} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditing ? "Save changes" : "Add school"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

