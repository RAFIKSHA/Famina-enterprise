import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Search, Grid, List, ChevronLeft, Plus, ArrowUpDown, 
  Filter, Calendar, UserCheck, AlertCircle, Phone, Clock,
  Users, Sparkles, XCircle, RotateCcw
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
  const [genderFilter, setGenderFilter] = useState("All"); // 'All', 'Female', 'Male', 'Other'
  const [datePreset, setDatePreset] = useState("all"); // 'all', 'today', 'this_month', 'last_month', 'custom'
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [followupFilter, setFollowupFilter] = useState("All"); // 'All', 'Pending', 'Upcoming'
  const [sortField, setSortField] = useState("registration_date");
  const [sortOrder, setSortOrder] = useState("desc");

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

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setGenderFilter("All");
    setDatePreset("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setFollowupFilter("All");
    setSortField("registration_date");
    setSortOrder("desc");
  };

  // Date calculation helpers
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  
  const startOfThisMonth = new Date(currentYear, currentMonth, 1).toISOString().split("T")[0];
  const endOfThisMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split("T")[0];
  
  const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split("T")[0];
  const endOfLastMonth = new Date(currentYear, currentMonth, 0).toISOString().split("T")[0];

  // Filter patients
  const filteredPatients = patients.filter(p => {
    // Search filter
    const matchesSearch = (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (p.mobile_no && p.mobile_no.includes(searchTerm)) || 
                          (p.patient_id && p.patient_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    // Gender filter
    const matchesGender = genderFilter === "All" || (p.gender && p.gender.toLowerCase() === genderFilter.toLowerCase());

    // Date Filter
    let matchesDate = true;
    const regDate = p.registration_date;
    if (datePreset === "today") {
      matchesDate = regDate === todayStr;
    } else if (datePreset === "this_month") {
      matchesDate = regDate >= startOfThisMonth && regDate <= endOfThisMonth;
    } else if (datePreset === "last_month") {
      matchesDate = regDate >= startOfLastMonth && regDate <= endOfLastMonth;
    } else if (datePreset === "custom") {
      if (customStartDate && customEndDate) {
        matchesDate = regDate >= customStartDate && regDate <= customEndDate;
      } else if (customStartDate) {
        matchesDate = regDate >= customStartDate;
      } else if (customEndDate) {
        matchesDate = regDate <= customEndDate;
      }
    }

    // Follow-up status filter
    let matchesFollowup = true;
    const nextAppt = p.visits && p.visits[0]?.next_appointment_date;
    
    if (followupFilter === "Pending") {
      // Overdue appointments (scheduled in past but not completed/updated)
      matchesFollowup = nextAppt && nextAppt < todayStr && p.status === "Active";
    } else if (followupFilter === "Upcoming") {
      // Future appointments
      matchesFollowup = nextAppt && nextAppt >= todayStr;
    }

    return matchesSearch && matchesStatus && matchesGender && matchesDate && matchesFollowup;
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

  // Recent patients (top 4 latest added)
  const recentPatients = [...patients].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 4);

  const isFiltered = searchTerm !== "" || statusFilter !== "All" || genderFilter !== "All" || datePreset !== "all" || followupFilter !== "All" || customStartDate !== "" || customEndDate !== "";

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between no-print">
        <div className="text-xs text-charcoal-light flex items-center gap-2 font-medium">
          <Link to="/dashboard" className="hover:text-rose-gold transition-colors">Dashboard</Link>
          <span>/</span>
          {category ? (
            <>
              <Link to={`/category/${encodeURIComponent(category)}`} className="hover:text-rose-gold transition-colors">
                {category}
              </Link>
              <span>/</span>
              <span className="text-teal-accent font-semibold">{subcategory || "Patients"}</span>
            </>
          ) : (
            <span className="text-teal-accent font-semibold">All Patients Directory</span>
          )}
        </div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-gold hover:text-rose-gold-dark cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {category && (
            <span className="text-[10px] font-bold tracking-widest text-rose-gold uppercase bg-rose-50 px-2 py-0.5 rounded">
              {category}
            </span>
          )}
          <h2 className="text-2xl font-bold font-heading text-teal-accent mt-1">{subcategory || (category ? `${category} Patients` : "Patient Records Vault")}</h2>
          <p className="text-xs text-charcoal-light mt-0.5">
            Showing {sortedPatients.length} of {patients.length} total patient files.
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
            to={`/new-patient?category=${encodeURIComponent(category || "Skin & Laser")}&subcategory=${encodeURIComponent(subcategory || "")}`}
            className="flex items-center gap-2 bg-teal-accent hover:bg-teal-dark text-white font-medium py-2.5 px-5 rounded-xl shadow-xs transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> Register Patient File
          </Link>
        </div>
      </div>

      {/* Recent Patients Highlight Strip */}
      {recentPatients.length > 0 && !isFiltered && (
        <div className="bg-cream-card rounded-2xl p-4 border border-rose-gold-light/15 shadow-xs space-y-3 no-print">
          <div className="flex items-center justify-between border-b border-rose-gold-light/10 pb-2">
            <h3 className="text-xs font-bold text-teal-accent flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-rose-gold" /> Recently Registered Patients
            </h3>
            <span className="text-[10px] text-charcoal-light font-medium">Latest Entries</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentPatients.map(p => (
              <div 
                key={p.id}
                onClick={() => navigate(`/patient/${p.id}`)}
                className="bg-white hover:bg-rose-50/30 border border-rose-gold-light/20 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-xs flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold bg-cream-bg text-rose-gold px-1.5 py-0.5 rounded">
                    {p.patient_id}
                  </span>
                  <h4 className="font-bold text-teal-accent text-xs truncate max-w-[140px]">{p.name}</h4>
                  <p className="text-[10px] text-charcoal-light">{p.gender} • {p.age ? `${p.age} yrs` : "Age N/A"}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-charcoal-light font-semibold block">{p.registration_date}</span>
                  <span className="text-[10px] font-bold text-rose-gold">View →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Filters Control Panel */}
      <div className="bg-cream-card rounded-2xl p-4 border border-rose-gold-light/10 shadow-xs space-y-4 no-print">
        
        {/* Quick Date Presets Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-gold-light/10 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-teal-accent flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-rose-gold" /> Date Range:
            </span>
            {[
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "this_month", label: "This Month" },
              { id: "last_month", label: "Last Month" },
              { id: "custom", label: "Custom Range" }
            ].map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDatePreset(preset.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  datePreset === preset.id
                    ? "bg-rose-gold text-white shadow-xs"
                    : "bg-cream-bg text-charcoal hover:bg-cream-dark border border-rose-gold-light/20"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Custom Date Pickers (Shown only when 'Custom Range' is selected) */}
        {datePreset === "custom" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-rose-gold-light/20 animate-fadeIn">
            <div>
              <label className="block text-[11px] font-semibold text-charcoal-light mb-1">From Date:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full bg-cream-bg border border-rose-gold-light/25 rounded-xl p-2 text-xs font-semibold text-teal-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-charcoal-light mb-1">To Date:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full bg-cream-bg border border-rose-gold-light/25 rounded-xl p-2 text-xs font-semibold text-teal-accent focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Main Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Local Search input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-rose-gold-dark" />
            <input
              type="text"
              placeholder="Search by name, ID or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cream-bg text-xs border border-rose-gold-light/20 focus:border-rose-gold rounded-xl py-2.5 pl-9 pr-4 focus:outline-none font-medium"
            />
          </div>

          {/* Gender filter dropdown */}
          <div className="flex items-center gap-2 border border-rose-gold-light/20 rounded-xl px-3 py-2 bg-cream-bg">
            <Users className="h-4 w-4 text-rose-gold" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none text-charcoal font-semibold"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2 border border-rose-gold-light/20 rounded-xl px-3 py-2 bg-cream-bg">
            <UserCheck className="h-4 w-4 text-rose-gold" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none text-charcoal font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Packages</option>
              <option value="Completed">Completed Packages</option>
            </select>
          </div>

          {/* Fast Sort Column selection */}
          <div className="flex items-center gap-2 border border-rose-gold-light/20 rounded-xl px-3 py-2 bg-cream-bg">
            <ArrowUpDown className="h-4 w-4 text-rose-gold" />
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none text-charcoal font-semibold"
            >
              <option value="registration_date">Sort: Newest First</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="last_visit">Sort: Last Session</option>
              <option value="next_appointment">Sort: Next Visit</option>
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
