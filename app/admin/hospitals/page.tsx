"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  Building2,
  Calendar,
  Download,
  Edit,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllHospitals, upsertHospital, deleteHospital } from "@/lib/supabase/hospitals";

type FacilityLevel = "Primary Health Centre" | "General Hospital" | "Specialist Hospital" | "Private Clinic";
type FacilityOwnership = "Public" | "Private" | "Mission";
type FacilityStatus = "Operational" | "Pending Inspection" | "Suspended";

interface Hospital {
  id: string;
  name: string;
  level: FacilityLevel;
  ownership: FacilityOwnership;
  lga: string;
  address: string;
  contactPerson: string;
  phone?: string;
  email?: string;
  bedCapacity: number;
  icuBeds: number;
  ambulanceCount: number;
  lastInspection?: string;
  nextInspection?: string;
  services: string[];
  status: FacilityStatus;
  notes: string[];
}

const statusClasses: Record<FacilityStatus, string> = {
  Operational: "bg-green-100 text-green-800",
  "Pending Inspection": "bg-yellow-100 text-yellow-800",
  Suspended: "bg-red-100 text-red-700",
};

// Helper function to map Supabase data to Hospital interface
function mapSupabaseToHospital(supabaseData: any): Hospital {
  // Map status
  let status: FacilityStatus = "Pending Inspection";
  const dbStatus = supabaseData.status || supabaseData.accreditation_status;
  if (dbStatus === "Operational" || dbStatus === "operational" || dbStatus === "Active") status = "Operational";
  else if (dbStatus === "Suspended" || dbStatus === "suspended") status = "Suspended";
  else status = "Pending Inspection";

  // Parse services from string or array
  let services: string[] = [];
  if (supabaseData.specialties) {
    if (typeof supabaseData.specialties === "string") {
      services = supabaseData.specialties.split(",").map((s: string) => s.trim()).filter((s: string) => s);
    } else if (Array.isArray(supabaseData.specialties)) {
      services = supabaseData.specialties;
    }
  }

  // Parse notes
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
    level: (supabaseData.level || "General Hospital") as FacilityLevel,
    ownership: (supabaseData.ownership || "Public") as FacilityOwnership,
    lga: supabaseData.lga || "Unknown",
    address: supabaseData.address || "",
    contactPerson: "N/A", // Not stored in DB
    phone: supabaseData.phone || undefined,
    email: supabaseData.email || undefined,
    bedCapacity: supabaseData.bed_capacity || 0,
    icuBeds: supabaseData.icu_beds || 0,
    ambulanceCount: supabaseData.ambulance_count || 0,
    lastInspection: supabaseData.last_inspection_date || undefined,
    nextInspection: supabaseData.next_inspection_date || undefined,
    services,
    status,
    notes,
  };
}

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<FacilityLevel | "">("");
  const [ownershipFilter, setOwnershipFilter] = useState<FacilityOwnership | "">("");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeHospital, setActiveHospital] = useState<Hospital | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<Hospital>>({
    level: "General Hospital",
    ownership: "Public",
    status: "Pending Inspection",
    bedCapacity: 0,
    icuBeds: 0,
    ambulanceCount: 0,
    services: [],
    notes: [],
  });
  const [saving, setSaving] = useState(false);

  // Fetch hospitals from Supabase
  useEffect(() => {
    async function fetchHospitals() {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getAllHospitals({
          level: levelFilter || undefined,
          ownership: ownershipFilter || undefined,
          search: searchTerm || undefined,
        });

        if (fetchError) {
          throw fetchError;
        }

        // Map Supabase data to Hospital interface
        const mappedHospitals = (data || []).map((hospital: any) => mapSupabaseToHospital(hospital));
        setHospitals(mappedHospitals);
      } catch (err: any) {
        console.error("Error fetching hospitals:", err);
        setError(err.message || "Failed to load hospitals");
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, [levelFilter, ownershipFilter, searchTerm]);

  const refreshData = async () => {
    try {
      const { data, error: fetchError } = await getAllHospitals({
        level: levelFilter || undefined,
        ownership: ownershipFilter || undefined,
        search: searchTerm || undefined,
      });
      if (!fetchError && data) {
        setHospitals(data.map((hospital: any) => mapSupabaseToHospital(hospital)));
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.lga.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter ? hospital.level === levelFilter : true;
      const matchesOwnership = ownershipFilter ? hospital.ownership === ownershipFilter : true;
      const matchesStatus = statusFilter ? hospital.status === statusFilter : true;

      return matchesSearch && matchesLevel && matchesOwnership && matchesStatus;
    });
  }, [hospitals, searchTerm, levelFilter, ownershipFilter, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredHospitals.length) {
      setSelected([]);
    } else {
      setSelected(filteredHospitals.map((hospital) => hospital.id));
    }
  };

  const updateHospitals = (ids: string[], updater: (hospital: Hospital) => Hospital) => {
    setHospitals((prev) =>
      prev.map((hospital) => (ids.includes(hospital.id) ? updater(hospital) : hospital))
    );
  };

  const handleStatusChange = (ids: string[], status: FacilityStatus) => {
    updateHospitals(ids, (hospital) => ({ ...hospital, status }));
  };

  const handleAddNote = (ids: string[]) => {
    const note = window.prompt("Add note:");
    if (!note) return;
    updateHospitals(ids, (hospital) => ({
      ...hospital,
      notes: [...hospital.notes, `${new Date().toLocaleString()}: ${note}`],
    }));
  };

  const handleExport = () => {
    const rows = [
      [
        "Name",
        "Level",
        "Ownership",
        "Status",
        "LGA",
        "Bed Capacity",
        "ICU Beds",
        "Ambulances",
        "Last Inspection",
      ],
      ...filteredHospitals.map((hospital) => [
        hospital.name,
        hospital.level,
        hospital.ownership,
        hospital.status,
        hospital.lga,
        hospital.bedCapacity,
        hospital.icuBeds,
        hospital.ambulanceCount,
        hospital.lastInspection ? new Date(hospital.lastInspection).toLocaleDateString() : "N/A",
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "hospital-records.csv");
    link.click();
  };

  const openForm = (hospital?: Hospital) => {
    if (hospital) {
      setFormState(hospital);
      setIsEditing(true);
    } else {
      setFormState({
        level: "General Hospital",
        ownership: "Public",
        status: "Pending Inspection",
        bedCapacity: 0,
        icuBeds: 0,
        ambulanceCount: 0,
        services: [],
        notes: [],
      });
      setIsEditing(false);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
  };

  const handleFormChange = (field: keyof Hospital, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formState.name || !formState.lga) {
      window.alert("Please fill in required fields (name, LGA).");
      return;
    }

    try {
      setSaving(true);
      
      // Map UI form to Supabase format
      const hospitalData = {
        id: isEditing ? formState.id : undefined,
        name: formState.name!,
        level: formState.level!,
        ownership: formState.ownership!,
        lga: formState.lga!,
        address: formState.address || undefined,
        phone: formState.phone || undefined,
        email: formState.email || undefined,
        bed_capacity: formState.bedCapacity || 0,
        icu_beds: formState.icuBeds || 0,
        ambulance_count: formState.ambulanceCount || 0,
        last_inspection_date: formState.lastInspection || undefined,
        next_inspection_date: formState.nextInspection || undefined,
        specialties: formState.services?.length ? formState.services : undefined,
        status: formState.status || "Pending Inspection",
        accreditation_status: formState.status || "Pending Inspection",
        notes: formState.notes?.join("\n") || undefined,
      };

      console.log("💾 Saving hospital:", hospitalData);
      const { data, error: saveError } = await upsertHospital(hospitalData);

      if (saveError) {
        console.error("❌ Error saving hospital:", saveError);
        throw saveError;
      }

      console.log("✅ Hospital saved successfully:", data);
      closeForm();
      await refreshData();
    } catch (err: any) {
      console.error("❌ Error saving hospital:", err);
      const errorMessage = err.message || "Failed to save hospital";
      alert(`Error: ${errorMessage}\n\nCheck:\n1. You are logged in as admin\n2. RLS policy allows INSERT/UPDATE for admins\n3. Browser console for details`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-taraba-green mx-auto mb-4" />
          <p className="text-gray-600">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-semibold">Error loading hospitals</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Hospital Records</h1>
            <p className="text-gray-600">
              Manage facilities, inspections, and accreditation across Taraba State.
            </p>
          </div>
          <Button onClick={() => openForm()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add facility
          </Button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by facility, contact, or LGA"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as FacilityLevel | "")}
              placeholder="Filter by facility level"
            >
              <option value="">All levels</option>
              <option value="Primary Health Centre">Primary Health Centre</option>
              <option value="General Hospital">General Hospital</option>
              <option value="Specialist Hospital">Specialist Hospital</option>
              <option value="Private Clinic">Private Clinic</option>
            </Select>
            <Select
              value={ownershipFilter}
              onChange={(e) => setOwnershipFilter(e.target.value as FacilityOwnership | "")}
              placeholder="Ownership"
            >
              <option value="">All ownerships</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Mission">Mission</option>
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FacilityStatus | "")}
              placeholder="Operational status"
            >
              <option value="">All statuses</option>
              <option value="Operational">Operational</option>
              <option value="Pending Inspection">Pending Inspection</option>
              <option value="Suspended">Suspended</option>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!selected.length}
              onClick={() => handleStatusChange(selected, "Operational")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Mark operational
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
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={
                        selected.length > 0 && selected.length === filteredHospitals.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3">Facility</th>
                  <th className="px-6 py-3">Level</th>
                  <th className="px-6 py-3">Capacity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last inspection</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredHospitals.map((hospital) => (
                  <tr
                    key={hospital.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setActiveHospital(hospital)}
                  >
                    <td className="px-6 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selected.includes(hospital.id)}
                        onChange={() => toggleSelect(hospital.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{hospital.name}</p>
                      <p className="text-xs text-gray-500">
                        {hospital.ownership} • {hospital.lga}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{hospital.level}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {hospital.bedCapacity} beds
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {hospital.icuBeds} ICU • {hospital.ambulanceCount} ambulances
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusClasses[hospital.status]}>
                        {hospital.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {hospital.lastInspection
                        ? new Date(hospital.lastInspection).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => openForm(hospital)}>
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddNote([hospital.id])}>
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

          {filteredHospitals.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No hospitals match the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {activeHospital && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setActiveHospital(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <p className="text-xs uppercase text-gray-500">Facility</p>
                <h2 className="text-lg font-semibold text-gray-900">{activeHospital.name}</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setActiveHospital(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {activeHospital.address}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge className={statusClasses[activeHospital.status]}>
                    {activeHospital.status}
                  </Badge>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {activeHospital.level} • {activeHospital.ownership}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  {activeHospital.lastInspection && (
                    <p>
                      Last inspection:{" "}
                      <span className="font-medium text-gray-900">
                        {new Date(activeHospital.lastInspection).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  {activeHospital.nextInspection && (
                    <p>
                      Next inspection:{" "}
                      <span className="font-medium text-gray-900">
                        {new Date(activeHospital.nextInspection).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Contact</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{activeHospital.contactPerson}</p>
                  {activeHospital.phone && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {activeHospital.phone}
                    </p>
                  )}
                  {activeHospital.email && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {activeHospital.email}
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Capacity</p>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 space-y-1">
                  <p className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">
                      {activeHospital.bedCapacity} total beds
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span>{activeHospital.icuBeds} ICU beds</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Ambulance className="h-4 w-4 text-gray-500" />
                    <span>{activeHospital.ambulanceCount} ambulances</span>
                  </p>
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">Services</p>
                <div className="flex flex-wrap gap-2">
                  {activeHospital.services.length === 0 && (
                    <span className="text-sm text-gray-500">No services listed.</span>
                  )}
                  {activeHospital.services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1 rounded-full bg-taraba-green/10 px-3 py-1 text-xs font-medium text-taraba-green"
                    >
                      <Activity className="h-3 w-3" />
                      {service}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify_between">
                  <p className="text-sm font-semibold text-gray-800">Notes & Compliance</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddNote([activeHospital.id])}
                  >
                    Add note
                  </Button>
                </div>
                <div className="space-y-2 rounded-lg border border-gray-100 bg-white p-4">
                  {activeHospital.notes.length === 0 && (
                    <p className="text-sm text-gray-500">No notes yet.</p>
                  )}
                  {activeHospital.notes.map((note, idx) => (
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
                    onClick={() => handleStatusChange([activeHospital.id], "Operational")}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Mark operational
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange([activeHospital.id], "Suspended")}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Suspend
                  </Button>
                  <Button variant="outline" onClick={() => openForm(activeHospital)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit facility
                  </Button>
                  <Button variant="outline" onClick={() => handleAddNote([activeHospital.id])}>
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
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closeForm} aria-hidden="true" />
          <div className="relative w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <p className="text-xs uppercase text-gray-500">
                  {isEditing ? "Edit facility" : "Add new facility"}
                </p>
                <h2 className="text-lg font-semibold text-gray-900">
                  {formState.name || "New hospital"}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeForm}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Facility name</label>
                <Input
                  value={formState.name || ""}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="Enter facility name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <Select
                    value={(formState.level as FacilityLevel) || ""}
                    onChange={(e) => handleFormChange("level", e.target.value as FacilityLevel)}
                  >
                    <option value="Primary Health Centre">Primary Health Centre</option>
                    <option value="General Hospital">General Hospital</option>
                    <option value="Specialist Hospital">Specialist Hospital</option>
                    <option value="Private Clinic">Private Clinic</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ownership</label>
                  <Select
                    value={(formState.ownership as FacilityOwnership) || ""}
                    onChange={(e) =>
                      handleFormChange("ownership", e.target.value as FacilityOwnership)
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
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Select
                    value={(formState.status as FacilityStatus) || ""}
                    onChange={(e) =>
                      handleFormChange("status", e.target.value as FacilityStatus)
                    }
                  >
                    <option value="Operational">Operational</option>
                    <option value="Pending Inspection">Pending Inspection</option>
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
                  placeholder="facility@example.com"
                  type="email"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Bed capacity</label>
                  <Input
                    type="number"
                    min={0}
                    value={formState.bedCapacity ?? 0}
                    onChange={(e) => handleFormChange("bedCapacity", Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ICU beds</label>
                  <Input
                    type="number"
                    min={0}
                    value={formState.icuBeds ?? 0}
                    onChange={(e) => handleFormChange("icuBeds", Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ambulances</label>
                  <Input
                    type="number"
                    min={0}
                    value={formState.ambulanceCount ?? 0}
                    onChange={(e) =>
                      handleFormChange("ambulanceCount", Number(e.target.value) || 0)
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
                <div>
                  <label className="text-sm font-medium text-gray-700">Next inspection</label>
                  <Input
                    type="date"
                    value={formState.nextInspection || ""}
                    onChange={(e) => handleFormChange("nextInspection", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Services offered</label>
                <Input
                  value={formState.services?.join(", ") || ""}
                  onChange={(e) =>
                    handleFormChange(
                      "services",
                      e.target.value
                        .split(",")
                        .map((service) => service.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Emergency, Maternity, Laboratory..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={closeForm}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditing ? "Save changes" : "Add facility"
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

