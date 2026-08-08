import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Search, Grid, List, ChevronLeft, Plus, ArrowUpDown, 
  Filter, Calendar, UserCheck, AlertCircle, Phone, Clock
} from "lucide-react";
import api from "../api";

export default function PatientList({ currentRole }) {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  
  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [followupFilter, setFollowupFilter] = useState("All"); // 'All', 'Pending', 'Upcoming'
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        // Fetch all patients for this category & subcategory
        const data = await api.getPatients("", category, subcategory);
        setPatients(data);
      } catch (err) {
        console.error("Error loading patient list", err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, [category, subcategory]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter patients
  const filteredPatients = patients.filter(p => {
    // Search filter
    const matchesSearch = (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (p.mobile_no && p.mobile_no.includes(searchTerm)) || 
                          (p.patient_id && p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    // Follow-up status filter
    let matchesFollowup = true;
    const today = new Date().toISOString().split("T")[0];
    const nextAppt = p.visits && p.visits[0]?.next_appointment_date;
    
    if (followupFilter === "Pending") {
      // Overdue appointments (scheduled in past but not completed/updated)
      matchesFollowup = nextAppt && nextAppt < today && p.status === "Active";
    } else if (followupFilter === "Upcoming") {
      // Future appointments
      matchesFollowup = nextAppt && nextAppt >= today;
    }

    return matchesSearch && matchesStatus && matchesFollowup;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let valA = a[sortField] || "";
    let valB = b[sortField] || "";

    if (sortField === "last_visit") {
      valA = a.visits && a.visits[0]?.visit_date || "";
      valB = b.visits && b.visits[0]?.visit_date || "";
    } else if (sortField === "next_appointment") {
      valA = a.visits && a.visits[0]?.next_appointment_date || "";
      valB = b.visits && b.visits[0]?.next_appointment_date || "";
    }

    if (typeof valA === "string") {
      return sortOrder === "asc" 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
  });

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between no-print">
        <div className="text-xs text-charcoal-light flex items-center gap-2 font-medium">
          <Link to="/dashboard" className="hover:text-rose-gold transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to={`/category/${encodeURIComponent(category)}`} className="hover:text-rose-gold transition-colors">
            {category}
          </Link>
          <span>/</span>
          <span className="text-teal-accent font-semibold">{subcategory || "Patients"}</span>
        </div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-gold hover:text-rose-gold-dark"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Folders
        </button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-rose-gold uppercase bg-rose-50 px-2 py-0.5 rounded">
            {category}
          </span>
          <h2 className="text-2xl font-bold font-heading text-teal-accent mt-1">{subcategory || "Patient Index"}</h2>
          <p className="text-xs text-charcoal-light mt-0.5">
            Showing {sortedPatients.length} patient file cards in this department.
          </p>
        </div>

        <div className="flex gap-2">
          {/* View mode toggle */}
          <div className="bg-cream-card border border-rose-gold-light/20 rounded-xl p-1 flex">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === "table" ? "bg-rose-gold text-white" : "text-rose-gold"}`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-rose-gold text-white" : "text-rose-gold"}`}
              title="Card View"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <Link
            to={`/new-patient?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory || "")}`}
            className="flex items-center gap-2 bg-teal-accent hover:bg-teal-dark text-white font-medium py-2.5 px-5 rounded-xl shadow-xs transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Add Patient File
          </Link>
        </div>
      </div>

      {/* Filters Control Panel */}
      <div className="bg-cream-card rounded-2xl p-4 border border-rose-gold-light/10 shadow-xs space-y-4 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Local Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-rose-gold-dark" />
            <input
              type="text"
              placeholder="Search by name, ID or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cream-bg text-sm border border-rose-gold-light/20 focus:border-rose-gold rounded-xl py-2 pl-9 pr-4 focus:outline-none"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2 border border-rose-gold-light/20 rounded-xl px-3 py-2 bg-cream-bg">
            <UserCheck className="h-4 w-4 text-rose-gold" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none text-charcoal font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Packages</option>
              <option value="Completed">Completed Packages</option>
            </select>
          </div>

          {/* Followup schedule filters */}
          <div className="flex items-center gap-2 border border-rose-gold-light/20 rounded-xl px-3 py-2 bg-cream-bg">
            <Clock className="h-4 w-4 text-rose-gold" />
            <select
              value={followupFilter}
              onChange={(e) => setFollowupFilter(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none text-charcoal font-medium"
            >
              <option value="All">All Follow-ups</option>
              <option value="Pending">⚠️ Pending/Overdue Follow-ups</option>
              <option value="Upcoming">📅 Upcoming Appointments</option>
            </select>
          </div>

          {/* Fast Sort Column selection */}
          <div className="flex items-center gap-2 border border-rose-gold-light/20 rounded-xl px-3 py-2 bg-cream-bg">
            <ArrowUpDown className="h-4 w-4 text-rose-gold" />
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-transparent text-sm w-full focus:outline-none text-charcoal font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="registration_date">Sort by Reg. Date</option>
              <option value="last_visit">Sort by Last Session</option>
              <option value="next_appointment">Sort by Next Visit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Display Board */}
      {loading ? (
        <div className="text-center py-12">
          <Clock className="h-8 w-8 text-rose-gold animate-spin mx-auto mb-2" />
          <p className="text-xs text-charcoal-light">Reading folder cabinet...</p>
        </div>
      ) : sortedPatients.length === 0 ? (
        <div className="bg-cream-card border border-rose-gold-light/10 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <AlertCircle className="h-10 w-10 text-rose-gold mx-auto" />
          <h4 className="font-bold text-teal-accent text-lg">No records found</h4>
          <p className="text-xs text-charcoal-light">
            No patient files in this folder match the current filter selection. Try adjusting your search query.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPatients.map(p => {
            const lastVisit = p.visits && p.visits[0];
            const overdue = lastVisit?.next_appointment_date && lastVisit.next_appointment_date < new Date().toISOString().split("T")[0] && p.status === "Active";
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/patient/${p.id}`)}
                className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-sm hover:shadow-md hover:border-rose-gold-light/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[9px] font-bold bg-cream-bg text-rose-gold px-2 py-0.5 rounded uppercase">
                        {p.patient_id}
                      </span>
                      <h4 className="font-heading font-bold text-lg text-teal-accent mt-1">{p.name}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === "Active" ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-charcoal-light">
                    <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-rose-gold" /> {p.mobile_no}</p>
                    <p><strong>Age/Gender:</strong> {p.age} yrs • {p.gender}</p>
                    {lastVisit && (
                      <>
                        <p><strong>Last Visit:</strong> {lastVisit.visit_date} (Session {lastVisit.session_no})</p>
                        <p className={`font-semibold ${overdue ? "text-red-500 font-bold" : "text-charcoal-light"}`}>
                          <strong>Next Appt:</strong> {lastVisit.next_appointment_date || "Not Scheduled"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-gold-light/10 flex justify-between items-center text-xs font-semibold text-rose-gold">
                  <span>Dues: ₹{p.balance_due || 0}</span>
                  <span className="flex items-center gap-1">Open Profile →</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Table View
        <div className="bg-cream-card border border-rose-gold-light/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-cream-bg border-b border-rose-gold-light/15 text-rose-gold font-bold text-xs uppercase tracking-wider">
                  <th className="p-4">Patient ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Last Visit</th>
                  <th className="p-4">Next Appointment</th>
                  <th className="p-4 text-right">Balance Due</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-gold-light/5 text-xs">
                {sortedPatients.map(p => {
                  const lastVisit = p.visits && p.visits[p.visits.length - 1];
                  const nextApptDate = lastVisit?.next_appointment_date || "—";
                  const todayStr = new Date().toISOString().split("T")[0];
                  const isOverdue = nextApptDate !== "—" && nextApptDate < todayStr && p.status === "Active";

                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/patient/${p.id}`)}
                      className="hover:bg-cream-bg/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-rose-gold">{p.patient_id}</td>
                      <td className="p-4 font-semibold text-teal-accent text-sm">{p.name}</td>
                      <td className="p-4">{p.mobile_no}</td>
                      <td className="p-4">
                        {lastVisit ? `${lastVisit.visit_date} (Session ${lastVisit.session_no})` : "No visits logged"}
                      </td>
                      <td className={`p-4 ${isOverdue ? "text-red-500 font-bold" : ""}`}>
                        {nextApptDate} {isOverdue && "(Overdue)"}
                      </td>
                      <td className="p-4 text-right font-semibold">₹{p.balance_due || 0}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
                          p.status === "Active" ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
