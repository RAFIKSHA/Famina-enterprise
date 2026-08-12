import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  Folder, ArrowRight, Shield, User, Clock, 
  Sparkles, Flame, Droplet, UserCheck, ShieldAlert,
  Search, Plus, ClipboardList, Scissors, BookOpen
} from "lucide-react";
import api from "../api";

export default function Dashboard({ currentRole, globalSearch }) {
  const [patients, setPatients] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { category, subcategory } = useParams();

  // Top level departments configuration
  const departments = [
    { 
      name: "Skin & Laser", 
      icon: Flame, 
      color: "bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100/50", 
      description: "Laser, Peels, HIFU & Aesthetics",
      hasSubfolders: true 
    },
    { 
      name: "Hair Treatment", 
      icon: Droplet, 
      color: "bg-teal-50 border-teal-100 text-teal-700 hover:bg-teal-100/50", 
      description: "PRP, GFC & Growth Therapy",
      hasSubfolders: true 
    },
    { 
      name: "Salon Services", 
      icon: Scissors, 
      color: "bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100/50", 
      description: "Hair styling, spa & beauty care",
      hasSubfolders: false,
      directPath: "/salon"
    },
    { 
      name: "Makeup Services", 
      icon: Sparkles, 
      color: "bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100/50", 
      description: "Bridal, HD & party makeup log",
      hasSubfolders: false,
      directPath: "/makeup"
    },
    { 
      name: "Academy Admissions", 
      icon: BookOpen, 
      color: "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/50", 
      description: "Student registrations & batches",
      hasSubfolders: false,
      directPath: "/academy"
    },
    { 
      name: "Gents Skin & Hair Treatment", 
      icon: User, 
      color: "bg-sky-50 border-sky-100 text-sky-700 hover:bg-sky-100/50", 
      description: "Men's dermatology & trichology",
      hasSubfolders: false,
      directPath: "/category/Gents Skin & Hair Treatment"
    }
  ];

  // Subcategories mapping
  const subcategories = {
    "Skin & Laser": [
      "Laser Hair Reduction", "Tattoo Removal", "Skin Laser", "HIFU Treatment",
      "Anti-Aging Treatment", "Acne Pimple Treatment", "Acne Scar Treatment",
      "Pigmentation / Melasma Treatment", "Skin Whitening & Brightening Treatment",
      "Chemical Peeling", "Advanced Facial", "Mole / Skin Tag Removal",
      "General Laser", "Multiple Treatments"
    ],
    "Hair Treatment": [
      "Hair PRP", "PRP + GFC", "Hair Growth Therapy", "Dandruff Treatment", "Alopecia Treatment"
    ]
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const patientsData = await api.getPatients();
        setPatients(patientsData);
        
        // Fetch dashboard analytics summary
        const stats = await api.getAnalytics();
        setAnalytics(stats);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter patients based on search, category and subcategory
  const filteredPatients = patients.filter(p => {
    if (globalSearch) {
      const q = globalSearch.toLowerCase();
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.mobile_no && p.mobile_no.includes(q)) ||
        (p.patient_id && p.patient_id.toLowerCase().includes(q))
      );
    }
    if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (subcategory && p.subcategory && p.subcategory.toLowerCase() !== subcategory.toLowerCase()) return false;
    return true;
  });

  const getPatientCount = (cat, sub = "") => {
    return patients.filter(p => {
      const catMatch = p.category.toLowerCase() === cat.toLowerCase();
      if (!sub) return catMatch;
      return catMatch && p.subcategory && p.subcategory.toLowerCase() === sub.toLowerCase();
    }).length;
  };

  // Main global search results layout if user is searching
  if (globalSearch) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-teal-accent">Search Results</h2>
            <p className="text-sm text-charcoal-light">Showing results matching "{globalSearch}"</p>
          </div>
          <Link
            to="/new-patient"
            className="flex items-center gap-2 bg-rose-gold text-white font-medium py-2 px-4 rounded-xl shadow hover:bg-rose-gold-dark transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Patient
          </Link>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="bg-cream-card rounded-3xl p-12 border border-rose-gold-light/20 shadow-sm text-center max-w-xl mx-auto space-y-4">
            <ShieldAlert className="h-12 w-12 text-rose-gold mx-auto" />
            <h3 className="text-lg font-bold text-teal-accent">No patients found</h3>
            <p className="text-sm text-charcoal-light">
              We couldn't find any patient matching your search query. You can add a new patient record file immediately.
            </p>
            <Link
              to="/new-patient"
              className="inline-flex items-center gap-2 bg-teal-accent hover:bg-teal-dark text-white font-medium py-2.5 px-6 rounded-xl shadow transition-colors"
            >
              Create New Patient File
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map(p => (
              <div 
                key={p.id} 
                onClick={() => navigate(`/patient/${p.id}`)}
                className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-sm hover:shadow-md hover:border-rose-gold-light/40 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-rose-gold bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                      {p.patient_id}
                    </span>
                    <h4 className="font-heading font-bold text-lg text-teal-accent mt-1">{p.name}</h4>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    p.status === "Active" ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-charcoal-light">
                  <p><strong>Mobile:</strong> {p.mobile_no}</p>
                  <p><strong>Category:</strong> {p.category} {p.subcategory && `> ${p.subcategory}`}</p>
                  <p><strong>Diagnosis:</strong> {p.diagnosis || "No diagnosis logged."}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-gold-light/10 flex justify-between items-center text-xs font-semibold text-rose-gold">
                  <span>Balance: ₹{p.balance_due || 0}</span>
                  <span className="flex items-center gap-1">View File <ArrowRight className="h-3.5 w-3.5" /></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sub-folders view (e.g. Skin & Laser -> subcategories cards)
  if (category && subcategories[category]) {
    return (
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="text-xs text-charcoal-light flex items-center gap-2 font-medium">
          <Link to="/dashboard" className="hover:text-rose-gold transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-teal-accent font-semibold">{category}</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-teal-accent font-heading">{category}</h2>
          <p className="text-sm text-charcoal-light">Select a treatment department below to browse records.</p>
        </div>

        {/* Sub-categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subcategories[category].map(sub => {
            const count = getPatientCount(category, sub);
            return (
              <div
                key={sub}
                onClick={() => navigate(`/category/${encodeURIComponent(category)}/${encodeURIComponent(sub)}`)}
                className="bg-cream-card border border-rose-gold-light/10 hover:border-rose-gold/30 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-cream-bg rounded-xl text-rose-gold group-hover:bg-rose-gold group-hover:text-white transition-colors">
                    <Folder className="h-5 w-5" />
                  </div>
                  <span className="bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {count} Patients
                  </span>
                </div>
                <h4 className="font-heading font-semibold text-charcoal group-hover:text-teal-accent transition-colors leading-tight">
                  {sub}
                </h4>
                <div className="mt-4 flex items-center justify-end text-xs font-semibold text-rose-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Subfolder <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Top level Dashboard
  return (
    <div className="space-y-8">
      {/* Metrics Row (for Admins / Receptionists) */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
          <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">Today's Collection</span>
            <h3 className="text-xl md:text-2xl font-bold font-heading mt-1 text-teal-accent">
              ₹{analytics.today_snapshot.collection.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">Today's Bookings</span>
            <h3 className="text-xl md:text-2xl font-bold font-heading mt-1 text-teal-accent">
              {analytics.today_snapshot.appointments_count}
            </h3>
          </div>
          <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">New Patients Today</span>
            <h3 className="text-xl md:text-2xl font-bold font-heading mt-1 text-teal-accent">
              {analytics.today_snapshot.new_patients}
            </h3>
          </div>
          <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">Followups Pending</span>
            <h3 className={`text-xl md:text-2xl font-bold font-heading mt-1 ${
              analytics.today_snapshot.pending_followups > 0 ? "text-red-500" : "text-teal-accent"
            }`}>
              {analytics.today_snapshot.pending_followups}
            </h3>
          </div>
        </div>
      )}

      {/* Main Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-teal-accent">Welcome to Femina Control Center</h2>
          <p className="text-sm text-charcoal-light">Manage and review your clinic operations and patient cards.</p>
        </div>
        <Link
          to="/new-patient"
          className="inline-flex items-center justify-center gap-2 bg-teal-accent hover:bg-teal-dark text-white font-medium py-3 px-6 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          <span>New Patient Registration</span>
        </Link>
      </div>

      {/* Department Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-heading text-rose-gold">Department Cabinets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => {
            const IconComponent = dept.icon;
            const patientCount = getPatientCount(dept.name);

            return (
              <div
                key={dept.name}
                onClick={() => {
                  if (dept.hasSubfolders) {
                    navigate(`/category/${encodeURIComponent(dept.name)}`);
                  } else {
                    navigate(dept.directPath);
                  }
                }}
                className="bg-cream-card border border-rose-gold-light/10 hover:border-rose-gold/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Accent line decoration */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-gold/10 group-hover:bg-rose-gold transition-colors"></div>

                <div className="flex justify-between items-start mb-6 mt-2">
                  <div className={`p-4 rounded-2xl ${dept.color.split(' ')[0]} ${dept.color.split(' ')[2]}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  {/* Badge showing patient counts in general folders */}
                  {!dept.directPath?.includes('/salon') && !dept.directPath?.includes('/makeup') && !dept.directPath?.includes('/academy') && (
                    <span className="bg-teal-50 text-teal-800 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xs">
                      {patientCount} Patients
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-heading font-bold text-xl text-teal-accent mb-1 group-hover:text-rose-gold transition-colors">
                    {dept.name}
                  </h4>
                  <p className="text-xs text-charcoal-light">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-gold-light/5 flex items-center justify-between text-xs font-semibold text-rose-gold">
                  <span>Browse Cabinet</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Schedule preview widget */}
      {analytics && analytics.today_snapshot.appointments.length > 0 && (
        <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg text-teal-accent">Today's Appointment Log</h3>
            <Link to="/appointments" className="text-xs font-semibold text-rose-gold hover:underline">
              View Calendar
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.today_snapshot.appointments.map(appt => (
              <div 
                key={appt.id} 
                className="flex items-center justify-between p-3.5 bg-cream-bg/50 border border-rose-gold-light/5 rounded-xl hover:border-rose-gold/20 transition-all"
              >
                <div>
                  <h5 className="font-bold text-sm text-teal-accent">{appt.patient_name}</h5>
                  <p className="text-xs text-charcoal-light">{appt.department} • {appt.subcategory || "Consultation"}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-gold bg-rose-50 px-2 py-0.5 rounded-md">
                    {appt.time}
                  </span>
                  <p className="text-[10px] text-charcoal-light mt-1">{appt.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Added Patients Table Widget */}
      {patients.length > 0 && (
        <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-rose-gold-light/10 pb-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-teal-accent flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-rose-gold" /> Recently Added Patients
              </h3>
              <p className="text-xs text-charcoal-light">Real-time patient files registered in the clinic system</p>
            </div>
            <Link to="/patients" className="text-xs font-bold text-rose-gold hover:underline">
              Browse All ({patients.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...patients].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 6).map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/patient/${p.id}`)}
                className="bg-white hover:bg-rose-50/30 border border-rose-gold-light/20 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-cream-bg text-rose-gold px-2 py-0.5 rounded uppercase">
                      {p.patient_id}
                    </span>
                    <span className="text-[10px] text-charcoal-light font-semibold">
                      {p.registration_date}
                    </span>
                  </div>
                  <h4 className="font-bold text-teal-accent text-sm truncate">{p.name}</h4>
                  <p className="text-xs text-charcoal-light mt-0.5">{p.gender} • {p.age ? `${p.age} yrs` : "Age N/A"}</p>
                  <p className="text-[11px] text-rose-gold font-medium mt-1 truncate">{p.category} {p.subcategory && `• ${p.subcategory}`}</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-rose-gold-light/10 flex justify-between items-center text-xs font-semibold text-rose-gold">
                  <span>Balance: ₹{p.balance_due || 0}</span>
                  <span>Open File →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
