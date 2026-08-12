import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  User, Calendar, Clock, DollarSign, Plus, Printer, ShieldAlert,
  ChevronLeft, ClipboardList, CheckCircle, FileText, Sparkles,
  Camera, ArrowRight, ShieldCheck, HeartPulse, Send, AlertTriangle,
  Trash2, Edit
} from "lucide-react";
import api from "../api";

export default function PatientProfile({ currentRole }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogVisit, setShowLogVisit] = useState(false);
  const [editingVisitId, setEditingVisitId] = useState(null);

  // New Visit form state
  const [visitForm, setVisitForm] = useState({
    session_no: 1,
    total_sessions_in_package: 1,
    treatment_given: "",
    notes: "",
    amount_charged: 0,
    amount_paid: 0,
    payment_mode: "Cash",
    next_appointment_date: "",
    before_photo: "",
    after_photo: ""
  });

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const data = await api.getPatient(id);
      setPatient(data);
      if (data) {
        // Pre-fill next session number
        const nextSession = data.visits && data.visits.length > 0
          ? Math.max(...data.visits.map(v => v.session_no)) + 1
          : 1;
        const totalSessions = data.visits && data.visits.length > 0
          ? data.visits[0].total_sessions_in_package
          : 6; // default package size
        
        setVisitForm(prev => ({
          ...prev,
          session_no: nextSession,
          total_sessions_in_package: totalSessions
        }));
      }
    } catch (err) {
      console.error("Error fetching patient profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const handleVisitSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate session logging
    const sessionExists = patient.visits && patient.visits.some(v => Number(v.session_no) === Number(visitForm.session_no));
    if (sessionExists) {
      alert(`Session ${visitForm.session_no} has already been logged for this patient. Please use a different session number.`);
      return;
    }

    try {
      const user = api.getCurrentUser();
      const payload = {
        patient: patient.id,
        ...visitForm,
        treatment_given: visitForm.treatment_given || "General Treatment Session",
        staff_attended: user ? user.username : "doctor"
      };
      await api.createVisit(payload);
      setShowLogVisit(false);
      setVisitForm({
        session_no: visitForm.session_no + 1,
        total_sessions_in_package: visitForm.total_sessions_in_package,
        treatment_given: "",
        notes: "",
        amount_charged: 0,
        amount_paid: 0,
        payment_mode: "Cash",
        next_appointment_date: "",
        before_photo: "",
        after_photo: ""
      });
      loadPatientData();
    } catch (err) {
      console.error("Error logging visit", err);
    }
  };

  const handleEditClick = (visit) => {
    setEditingVisitId(visit.id);
    setVisitForm({
      session_no: visit.session_no,
      total_sessions_in_package: visit.total_sessions_in_package,
      treatment_given: visit.treatment_given,
      notes: visit.notes || "",
      amount_charged: Number(visit.amount_charged || 0),
      amount_paid: Number(visit.amount_paid || 0),
      payment_mode: visit.payment_mode || "Cash",
      next_appointment_date: visit.next_appointment_date || "",
      before_photo: visit.before_photo || "",
      after_photo: visit.after_photo || ""
    });
    setShowLogVisit(false); // Hide log visit if open
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const sessionExists = patient.visits && patient.visits.some(v => 
      v.id !== editingVisitId && Number(v.session_no) === Number(visitForm.session_no)
    );
    if (sessionExists) {
      alert(`Session ${visitForm.session_no} has already been logged for this patient. Please use a different session number.`);
      return;
    }

    try {
      const payload = {
        patient: patient.id,
        ...visitForm,
        treatment_given: visitForm.treatment_given || "General Treatment Session"
      };
      await api.updateVisit(editingVisitId, payload);
      setEditingVisitId(null);
      loadPatientData();
    } catch (err) {
      console.error("Error editing visit", err);
    }
  };

  // Image Upload helper (converts file to base64)
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVisitForm(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  const handleDeletePatient = async () => {
    if (window.confirm("Are you sure you want to permanently delete this patient record file? This action is irreversible and will delete all session logs, payments, and appointments.")) {
      try {
        await api.deletePatient(patient.id);
        navigate("/dashboard");
      } catch (err) {
        console.error("Error deleting patient", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Clock className="h-8 w-8 text-rose-gold animate-spin mx-auto mb-2" />
        <p className="text-xs text-charcoal-light">Opening patient record vault...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12 max-w-md mx-auto space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-gold mx-auto" />
        <h3 className="text-lg font-bold text-teal-accent">File Not Found</h3>
        <p className="text-sm text-charcoal-light">This patient record does not exist or has been archived.</p>
        <button onClick={() => navigate(-1)} className="text-rose-gold hover:underline font-semibold text-xs">
          Go Back
        </button>
      </div>
    );
  }

  // Role permissions checks
  const isDoctor = currentRole === "doctor" || currentRole === "admin";
  const isRecep = currentRole === "receptionist" || currentRole === "admin";

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex justify-between items-center no-print">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-gold hover:text-rose-gold-dark cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Back to List
        </button>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/patient/${patient.id}/edit`}
            className="flex items-center gap-1.5 bg-cream-card border border-rose-gold-light/30 hover:border-rose-gold text-rose-gold font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
          >
            <Edit className="h-4 w-4" /> Edit Profile
          </Link>
          <button
            onClick={triggerPrint}
            className="flex items-center gap-1.5 bg-cream-card border border-rose-gold-light/30 hover:border-rose-gold text-rose-gold font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print Ledger / File
          </button>
          {currentRole === "admin" && (
            <button
              onClick={handleDeletePatient}
              className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-semibold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" /> Delete File
            </button>
          )}
          <button
            onClick={() => setShowLogVisit(!showLogVisit)}
            className="flex items-center gap-1.5 bg-teal-accent hover:bg-teal-dark text-white font-semibold py-2 px-4 rounded-xl text-xs transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Log Session Visit
          </button>
        </div>
      </div>

      {/* Stylized Printable Clinic Header */}
      <div className="hidden print:block text-center border-b border-double border-charcoal/30 pb-4 mb-6">
        <h1 className="text-2xl font-bold font-heading tracking-widest text-teal-accent">FEMINA SKIN CLINIC & MAKEUP STUDIO</h1>
        <p className="text-xs text-charcoal-light font-medium uppercase tracking-wider mt-1">Skin • Hair • Laser • Aesthetic • Trichology</p>
        <p className="text-[10px] text-charcoal-light mt-1">📍 Sahara City, Sillod, Dist. Aurangabad | 📞 9921719656</p>
        <h2 className="text-md font-bold tracking-wide mt-4 text-rose-gold uppercase">PATIENT LEDGER / SESSION RECORD CARD</h2>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient Profile Card & Medical History */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Patient Info Card */}
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm print-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[9px] font-extrabold bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                  {patient.patient_id}
                </span>
                <h3 className="font-heading font-bold text-xl text-teal-accent mt-1">{patient.name}</h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                patient.status === "Active" ? "bg-teal-50 text-teal-700" : "bg-gray-100 text-gray-600"
              }`}>
                {patient.status}
              </span>
            </div>

            <div className="space-y-2.5 text-xs border-t border-rose-gold-light/10 pt-4">
              <div className="flex justify-between"><span className="text-charcoal-light">Registered:</span> <span className="font-medium">{patient.registration_date}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-light">Age / Gender:</span> <span className="font-medium">{patient.age} Yrs • {patient.gender}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-light">Mobile No:</span> <span className="font-semibold text-rose-gold">{patient.mobile_no}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-light">Occupation:</span> <span className="font-medium">{patient.occupation || "—"}</span></div>
              <div>
                <span className="text-charcoal-light block mb-1">Address:</span>
                <span className="font-medium bg-cream-bg/40 block p-2 rounded-lg text-[11px] leading-relaxed border border-rose-gold-light/5">{patient.address || "—"}</span>
              </div>
            </div>
          </div>

          {/* Medical History Section (Hidden from Receptionists) */}
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm print-card">
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="h-5 w-5 text-rose-gold" />
              <h4 className="font-heading font-bold text-md text-teal-accent">Medical History</h4>
            </div>

            {!isDoctor ? (
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-center text-xs space-y-2">
                <AlertTriangle className="h-6 w-6 text-rose-500 mx-auto" />
                <p className="font-semibold text-rose-800">Access Restricted</p>
                <p className="text-charcoal-light">Medical histories are visible to Doctors and Admins only.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2.5 rounded-xl border ${patient.has_diabetes ? "bg-red-50 border-red-100 text-red-700 font-semibold" : "border-rose-gold-light/10 text-charcoal-light bg-cream-bg/30"}`}>
                    Diabetes: {patient.has_diabetes ? "Yes" : "No"}
                  </div>
                  <div className={`p-2.5 rounded-xl border ${patient.has_high_bp ? "bg-red-50 border-red-100 text-red-700 font-semibold" : "border-rose-gold-light/10 text-charcoal-light bg-cream-bg/30"}`}>
                    High BP: {patient.has_high_bp ? "Yes" : "No"}
                  </div>
                  <div className={`p-2.5 rounded-xl border ${patient.has_pcod_pcos ? "bg-red-50 border-red-100 text-red-700 font-semibold" : "border-rose-gold-light/10 text-charcoal-light bg-cream-bg/30"}`}>
                    PCOD/PCOS: {patient.has_pcod_pcos ? "Yes" : "No"}
                  </div>
                  <div className={`p-2.5 rounded-xl border ${patient.has_skin_allergy ? "bg-red-50 border-red-100 text-red-700 font-semibold" : "border-rose-gold-light/10 text-charcoal-light bg-cream-bg/30"}`}>
                    Skin Allergy: {patient.has_skin_allergy ? "Yes" : "No"}
                  </div>
                  <div className={`p-2.5 rounded-xl border ${patient.has_keloid_history ? "bg-red-50 border-red-100 text-red-700 font-semibold" : "border-rose-gold-light/10 text-charcoal-light bg-cream-bg/30"}`}>
                    Keloid Hist: {patient.has_keloid_history ? "Yes" : "No"}
                  </div>
                </div>
                {patient.other_medical_history && (
                  <div className="bg-cream-bg/50 border border-rose-gold-light/10 p-3 rounded-xl text-xs">
                    <strong className="text-teal-accent">Other conditions:</strong>
                    <p className="mt-1 text-charcoal-light leading-relaxed">{patient.other_medical_history}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Treatment Instructions Card */}
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm print-card">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-rose-gold" />
              <h4 className="font-heading font-bold text-md text-teal-accent">Post-Treatment Instructions</h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-charcoal-light">
                <input type="checkbox" checked={patient.inst_spf_sunscreen} readOnly className="pointer-events-none rounded h-4 w-4" />
                <span className={patient.inst_spf_sunscreen ? "text-teal-accent font-medium" : ""}>SPF 50+ Sunscreen Daily</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-light">
                <input type="checkbox" checked={patient.inst_no_waxing_threading} readOnly className="pointer-events-none rounded h-4 w-4" />
                <span className={patient.inst_no_waxing_threading ? "text-teal-accent font-medium" : ""}>No Waxing or Threading</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-light">
                <input type="checkbox" checked={patient.inst_avoid_hot_water_steam} readOnly className="pointer-events-none rounded h-4 w-4" />
                <span className={patient.inst_avoid_hot_water_steam ? "text-teal-accent font-medium" : ""}>Avoid Hot Water & Steam (24-48 hrs)</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-light">
                <input type="checkbox" checked={patient.inst_use_moisturizer} readOnly className="pointer-events-none rounded h-4 w-4" />
                <span className={patient.inst_use_moisturizer ? "text-teal-accent font-medium" : ""}>Use Moisturizer Regularly</span>
              </div>
              <div className="flex items-center gap-2 text-charcoal-light">
                <input type="checkbox" checked={patient.inst_attend_next_session} readOnly className="pointer-events-none rounded h-4 w-4" />
                <span className={patient.inst_attend_next_session ? "text-teal-accent font-medium" : ""}>Attend Next Session on Time</span>
              </div>
              {patient.custom_post_instructions && (
                <div className="mt-4 pt-3 border-t border-rose-gold-light/10 text-xs">
                  <span className="font-bold text-rose-gold block mb-1">Additional Instructions:</span>
                  <p className="p-2.5 bg-cream-bg rounded-lg text-charcoal-light leading-relaxed border border-rose-gold-light/5">
                    {patient.custom_post_instructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: Clinical Assessment, Visit Timeline, Payment logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Clinical Assessment Detail */}
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm print-card">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-rose-gold" />
              <h4 className="font-heading font-bold text-md text-teal-accent">Clinical Diagnosis & Assessment</h4>
            </div>

            {!isDoctor ? (
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 text-center text-xs space-y-2">
                <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
                <h5 className="font-bold text-rose-800">Clinical Data Shielded</h5>
                <p className="text-charcoal-light">
                  Diagnosis summaries, treatment areas, hair types, and session notes are locked for Reception staff.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-charcoal-light mb-1 font-medium">Treatment Area:</p>
                  <p className="p-3 bg-cream-bg border border-rose-gold-light/10 rounded-xl text-teal-accent font-semibold">
                    {patient.treatment_area || "Not logged"}
                  </p>
                </div>
                {patient.hair_type && (
                  <div>
                    <p className="text-charcoal-light mb-1 font-medium">Hair Type (Laser Reduction):</p>
                    <p className="p-3 bg-cream-bg border border-rose-gold-light/10 rounded-xl text-teal-accent font-semibold">
                      {patient.hair_type}
                    </p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-charcoal-light mb-1 font-medium">Diagnosis & Physician's Notes:</p>
                  <p className="p-4 bg-cream-bg border border-rose-gold-light/10 rounded-xl text-charcoal leading-relaxed whitespace-pre-line font-medium">
                    {patient.diagnosis || "No diagnosis logged."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Log Session Visit Form Modal/Block */}
          {showLogVisit && (
            <div className="bg-cream-card rounded-3xl p-6 border-2 border-rose-gold shadow-md no-print animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-heading font-bold text-lg text-teal-accent flex items-center gap-2">
                  <Plus className="h-5 w-5 text-rose-gold" /> Log Treatment Visit Session
                </h4>
                <button 
                  onClick={() => setShowLogVisit(false)}
                  className="text-xs text-rose-gold font-semibold hover:underline"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleVisitSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Session No.</label>
                    <input
                      type="number"
                      value={visitForm.session_no}
                      onChange={(e) => setVisitForm({ ...visitForm, session_no: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl text-teal-accent font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Total Package Sessions</label>
                    <input
                      type="number"
                      value={visitForm.total_sessions_in_package}
                      onChange={(e) => setVisitForm({ ...visitForm, total_sessions_in_package: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Next Appointment Date</label>
                    <input
                      type="date"
                      value={visitForm.next_appointment_date}
                      onChange={(e) => setVisitForm({ ...visitForm, next_appointment_date: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-charcoal-light">Treatment Administered Today</label>
                  <input
                    type="text"
                    placeholder="e.g. Diode Laser session 2, full face. Or Hydrafacial."
                    value={visitForm.treatment_given}
                    onChange={(e) => setVisitForm({ ...visitForm, treatment_given: e.target.value })}
                    className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-charcoal-light">Visit Session Notes (Clinical response, settings used)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Laser Energy used: 24 J/cm2. Good response, patient comfortable."
                    value={visitForm.notes}
                    onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                    className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Visit Charge (₹)</label>
                    <input
                      type="number"
                      value={visitForm.amount_charged || ""}
                      onChange={(e) => setVisitForm({ ...visitForm, amount_charged: e.target.value === "" ? 0 : Number(e.target.value) })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Amount Paid Today (₹)</label>
                    <input
                      type="number"
                      value={visitForm.amount_paid || ""}
                      onChange={(e) => setVisitForm({ ...visitForm, amount_paid: e.target.value === "" ? 0 : Number(e.target.value) })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none font-bold text-teal-accent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Payment Mode</label>
                    <select
                      value={visitForm.payment_mode}
                      onChange={(e) => setVisitForm({ ...visitForm, payment_mode: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none font-medium"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                {/* Photo upload mock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-dashed border-rose-gold-light/35 rounded-xl p-3 text-center">
                    <label className="cursor-pointer block">
                      <Camera className="h-5 w-5 text-rose-gold mx-auto mb-1" />
                      <span className="font-semibold block text-[10px]">Upload Before Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, "before_photo")}
                        className="hidden" 
                      />
                    </label>
                    {visitForm.before_photo && (
                      <img src={visitForm.before_photo} className="mt-2 h-16 w-auto mx-auto rounded border" alt="Before" />
                    )}
                  </div>
                  <div className="border border-dashed border-rose-gold-light/35 rounded-xl p-3 text-center">
                    <label className="cursor-pointer block">
                      <Camera className="h-5 w-5 text-rose-gold mx-auto mb-1" />
                      <span className="font-semibold block text-[10px]">Upload After Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, "after_photo")}
                        className="hidden" 
                      />
                    </label>
                    {visitForm.after_photo && (
                      <img src={visitForm.after_photo} className="mt-2 h-16 w-auto mx-auto rounded border" alt="After" />
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-teal-accent hover:bg-teal-dark text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer"
                  >
                    Save Session Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Session Visit Form Modal/Block */}
          {editingVisitId && (
            <div className="bg-cream-card rounded-3xl p-6 border-2 border-rose-gold shadow-md no-print animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-heading font-bold text-lg text-teal-accent flex items-center gap-2">
                  <Edit className="h-5 w-5 text-rose-gold" /> Edit Treatment Visit Session
                </h4>
                <button 
                  onClick={() => setEditingVisitId(null)}
                  className="text-xs text-rose-gold font-semibold hover:underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Session No.</label>
                    <input
                      type="number"
                      value={visitForm.session_no}
                      onChange={(e) => setVisitForm({ ...visitForm, session_no: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl text-teal-accent font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Total Package Sessions</label>
                    <input
                      type="number"
                      value={visitForm.total_sessions_in_package}
                      onChange={(e) => setVisitForm({ ...visitForm, total_sessions_in_package: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Next Appointment Date</label>
                    <input
                      type="date"
                      value={visitForm.next_appointment_date}
                      onChange={(e) => setVisitForm({ ...visitForm, next_appointment_date: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-charcoal-light">Treatment Administered Today</label>
                  <input
                    type="text"
                    placeholder="e.g. Diode Laser session 2, full face. Or Hydrafacial."
                    value={visitForm.treatment_given}
                    onChange={(e) => setVisitForm({ ...visitForm, treatment_given: e.target.value })}
                    className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-charcoal-light">Visit Session Notes (Clinical response, settings used)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Laser Energy used: 24 J/cm2. Good response, patient comfortable."
                    value={visitForm.notes}
                    onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                    className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Visit Charge (₹)</label>
                    <input
                      type="number"
                      value={visitForm.amount_charged || ""}
                      onChange={(e) => setVisitForm({ ...visitForm, amount_charged: e.target.value === "" ? 0 : Number(e.target.value) })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Amount Paid Today (₹)</label>
                    <input
                      type="number"
                      value={visitForm.amount_paid || ""}
                      onChange={(e) => setVisitForm({ ...visitForm, amount_paid: e.target.value === "" ? 0 : Number(e.target.value) })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none font-bold text-teal-accent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-charcoal-light">Payment Mode</label>
                    <select
                      value={visitForm.payment_mode}
                      onChange={(e) => setVisitForm({ ...visitForm, payment_mode: e.target.value })}
                      className="w-full bg-cream-bg border border-rose-gold-light/20 p-2.5 rounded-xl focus:outline-none font-medium"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-dashed border-rose-gold-light/35 rounded-xl p-3 text-center">
                    <label className="cursor-pointer block">
                      <Camera className="h-5 w-5 text-rose-gold mx-auto mb-1" />
                      <span className="font-semibold block text-[10px]">Upload Before Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, "before_photo")}
                        className="hidden" 
                      />
                    </label>
                    {visitForm.before_photo && (
                      <div className="relative mt-2 inline-block">
                        <img src={visitForm.before_photo} className="h-16 w-auto mx-auto rounded border" alt="Before" />
                        <button 
                          type="button" 
                          onClick={() => setVisitForm({ ...visitForm, before_photo: "" })} 
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-[8px] flex items-center justify-center h-4 w-4 shadow-sm"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="border border-dashed border-rose-gold-light/35 rounded-xl p-3 text-center">
                    <label className="cursor-pointer block">
                      <Camera className="h-5 w-5 text-rose-gold mx-auto mb-1" />
                      <span className="font-semibold block text-[10px]">Upload After Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageChange(e, "after_photo")}
                        className="hidden" 
                      />
                    </label>
                    {visitForm.after_photo && (
                      <div className="relative mt-2 inline-block">
                        <img src={visitForm.after_photo} className="h-16 w-auto mx-auto rounded border" alt="After" />
                        <button 
                          type="button" 
                          onClick={() => setVisitForm({ ...visitForm, after_photo: "" })} 
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-[8px] flex items-center justify-center h-4 w-4 shadow-sm"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-teal-accent hover:bg-teal-dark text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer"
                  >
                    Update Session Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ledger Accounts and Packages Dues */}
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm print-card">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-rose-gold" />
              <h4 className="font-heading font-bold text-md text-teal-accent">Fees Package Ledger</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div className="p-3 bg-cream-bg/40 border border-rose-gold-light/10 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-charcoal-light">Total Paid</span>
                <p className="text-lg font-extrabold text-teal-accent mt-0.5">₹{patient.total_paid || 0}</p>
              </div>
              <div className="p-3 bg-cream-bg/40 border border-rose-gold-light/10 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-charcoal-light">Dues Balance</span>
                <p className={`text-lg font-extrabold mt-0.5 ${patient.balance_due > 0 ? "text-red-500" : "text-teal-accent"}`}>
                  ₹{patient.balance_due || 0}
                </p>
              </div>
              <div className="p-3 bg-cream-bg/40 border border-rose-gold-light/10 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-charcoal-light">Total Sessions</span>
                <p className="text-lg font-extrabold text-teal-accent mt-0.5">
                  {patient.visits && patient.visits.length > 0 ? patient.visits[0].total_sessions_in_package : "—"}
                </p>
              </div>
              <div className="p-3 bg-cream-bg/40 border border-rose-gold-light/10 rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-charcoal-light">Sessions Done</span>
                <p className="text-lg font-extrabold text-teal-accent mt-0.5">{patient.visits ? patient.visits.length : 0}</p>
              </div>
            </div>

            {/* Direct receipts / payment listings */}
            {patient.payments && patient.payments.length > 0 && (
              <div className="space-y-2.5">
                <span className="font-bold text-xs text-rose-gold">Payment Receipts Log</span>
                <div className="border border-rose-gold-light/10 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-4 bg-cream-bg p-2 font-bold text-rose-gold uppercase text-[10px]">
                    <span>Receipt No</span>
                    <span>Date</span>
                    <span>Payment Mode</span>
                    <span className="text-right">Amount Paid</span>
                  </div>
                  <div className="divide-y divide-rose-gold-light/5">
                    {patient.payments.map(pay => (
                      <div key={pay.id} className="grid grid-cols-4 p-2.5 bg-white">
                        <span className="font-bold text-teal-accent">{pay.receipt_no}</span>
                        <span>{pay.payment_date}</span>
                        <span>{pay.payment_mode}</span>
                        <span className="text-right font-semibold text-teal-accent">₹{pay.amount_paid}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Session / Visit History log Timeline */}
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm print-card">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-rose-gold" />
                <h4 className="font-heading font-bold text-md text-teal-accent">Session Visit History Timeline</h4>
              </div>
              <span className="text-[10px] font-semibold bg-cream-bg text-rose-gold px-2 py-0.5 rounded uppercase">
                Most Recent on Top
              </span>
            </div>

            {patient.visits && patient.visits.length === 0 ? (
              <div className="text-center py-8 text-xs text-charcoal-light">
                No session visits logged for this patient yet. Use the "Log Session Visit" button above.
              </div>
            ) : (
              <div className="relative border-l border-rose-gold-light/20 ml-3.5 space-y-8 pb-4">
                {patient.visits.map((visit, index) => {
                  return (
                    <div key={visit.id} className="relative pl-7">
                      {/* Timeline dot */}
                      <span className="absolute -left-2 top-1.5 h-4.5 w-4.5 rounded-full bg-teal-accent border-4 border-white flex items-center justify-center shadow-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                      </span>

                      {/* Timeline Card */}
                      <div className="bg-cream-bg/40 border border-rose-gold-light/10 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                          <div>
                            <span className="font-bold text-sm text-teal-accent">Session {visit.session_no}</span>
                            <span className="text-charcoal-light ml-2">({visit.visit_date})</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded">
                              Charged: ₹{visit.amount_charged}
                            </span>
                            <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded">
                              Paid: ₹{visit.amount_paid} ({visit.payment_mode})
                            </span>
                            <button
                              onClick={() => handleEditClick(visit)}
                              className="text-rose-gold hover:text-rose-gold-dark p-1 rounded hover:bg-rose-gold-light/10 transition-colors cursor-pointer ml-1 no-print"
                              title="Edit Session"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Visit content */}
                        <div className="space-y-2 text-xs">
                          <p>
                            <strong className="text-teal-accent">Treatment Given: </strong>
                            <span className="font-medium text-charcoal bg-white/70 px-2 py-1 rounded border border-rose-gold-light/5 inline-block">
                              {visit.treatment_given}
                            </span>
                          </p>
                          
                          {/* Visit Notes (Obscured for receptionists) */}
                          <div>
                            <strong className="text-teal-accent">Clinical Visit Notes: </strong>
                            {!isDoctor ? (
                              <span className="text-red-500 italic block mt-0.5">[Notes Shielded]</span>
                            ) : (
                              <p className="mt-1 text-charcoal-light leading-relaxed whitespace-pre-wrap bg-white/50 p-2.5 rounded-lg border border-rose-gold-light/5">
                                {visit.notes || "No visit notes logged."}
                              </p>
                            )}
                          </div>

                          {/* Photos before/after */}
                          {(visit.before_photo || visit.after_photo) && (
                            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-rose-gold-light/10 no-print">
                              {visit.before_photo && (
                                <div>
                                  <span className="text-[10px] text-charcoal-light font-bold block mb-1">Before:</span>
                                  <img 
                                    src={visit.before_photo} 
                                    className="max-h-36 w-auto rounded border shadow-xs" 
                                    alt="Before Treatment" 
                                  />
                                </div>
                              )}
                              {visit.after_photo && (
                                <div>
                                  <span className="text-[10px] text-charcoal-light font-bold block mb-1">After:</span>
                                  <img 
                                    src={visit.after_photo} 
                                    className="max-h-36 w-auto rounded border shadow-xs" 
                                    alt="After Treatment" 
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center text-[10px] text-charcoal-light pt-2 border-t border-rose-gold-light/5 mt-2">
                            <span>Attended by: <strong>{visit.staff_name}</strong></span>
                            {visit.next_appointment_date && (
                              <span>Next Session Appointment set for: <strong className="text-teal-accent">{visit.next_appointment_date}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
