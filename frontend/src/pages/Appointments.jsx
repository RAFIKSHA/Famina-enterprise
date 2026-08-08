import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, Clock, Users, Plus, CheckCircle,
  XCircle, AlertCircle, PhoneCall, Send, MessageSquare, RefreshCw
} from "lucide-react";
import api from "../api";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Date filters
  const today = new Date().toISOString().split("T")[0];
  const [filterDate, setFilterDate] = useState(today);

  // New appointment form state
  const [form, setForm] = useState({
    patient: "",
    appointment_date: today,
    appointment_time: "10:00",
    department: "Skin & Laser",
    subcategory: "Laser Hair Reduction",
    notes: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const appts = await api.getAppointments();
      setAppointments(appts);
      const pats = await api.getPatients();
      setPatients(pats);
    } catch (err) {
      console.error("Error loading appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.patient) {
      alert("Please select a patient.");
      return;
    }
    try {
      await api.createAppointment(form);
      setShowAddForm(false);
      setForm({
        patient: "",
        appointment_date: today,
        appointment_time: "10:00",
        department: "Skin & Laser",
        subcategory: "Laser Hair Reduction",
        notes: ""
      });
      loadData();
    } catch (err) {
      console.error("Error creating appointment", err);
    }
  };

  const handleToggleChecklist = async (apptId, field, currentValue) => {
    try {
      await api.updateAppointment(apptId, { [field]: !currentValue });
      // Update local state instantly for smooth performance
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, [field]: !currentValue } : a));
    } catch (err) {
      console.error("Error updating appointment checklist", err);
    }
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await api.updateAppointment(apptId, { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Error updating appointment status", err);
    }
  };

  // Filter list by date
  const todaysBookings = appointments.filter(a => a.appointment_date === filterDate);
  
  // Missed appointments list (overdue scheduled)
  const missedBookings = appointments.filter(a => a.appointment_date < today && a.status === "Scheduled");
  
  // Upcoming bookings list (future dates)
  const upcomingBookings = appointments.filter(a => a.appointment_date > today && a.status === "Scheduled");

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-teal-accent">Appointments & Reminders</h2>
          <p className="text-xs text-charcoal-light">Send and track manual confirmation alerts to reduce clinic missed rates.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-rose-gold text-white font-medium py-2.5 px-5 rounded-xl shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Booking
        </button>
      </div>

      {/* Add Booking Modal Block */}
      {showAddForm && (
        <div className="bg-cream-card rounded-3xl p-6 border-2 border-rose-gold shadow-md max-w-xl mx-auto animate-fadeIn">
          <div className="flex justify-between items-center mb-4 border-b border-rose-gold-light/10 pb-2">
            <h4 className="font-heading font-bold text-teal-accent flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-rose-gold" /> Schedule Session Appointment
            </h4>
            <button onClick={() => setShowAddForm(false)} className="text-xs text-rose-gold font-semibold hover:underline">
              Close
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block mb-1 font-semibold text-charcoal-light">Select Patient *</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-semibold text-teal-accent"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.patient_id} - {p.mobile_no})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Appointment Date</label>
                <input
                  type="date"
                  value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Time</label>
                <input
                  type="time"
                  value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                >
                  <option value="Skin & Laser">Skin & Laser</option>
                  <option value="Hair Treatment">Hair Treatment</option>
                  <option value="Gents Skin & Hair Treatment">Gents Skin & Hair Treatment</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Treatment Subcategory</label>
                <input
                  type="text"
                  placeholder="e.g. Hair PRP, Chemical Peeling"
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-charcoal-light">Special Notes / Requests</label>
              <input
                type="text"
                placeholder="e.g. Skin sensitive, patient requested specific doctor"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-teal-accent hover:bg-teal-dark text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer"
              >
                Create Schedule Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Date Selector Calendar & Scheduled Lists */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm">
            
            {/* Calendar list Date filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-gold-light/10 pb-4 mb-4">
              <h3 className="font-heading font-bold text-md text-teal-accent flex items-center gap-1.5">
                <CalendarIcon className="h-4.5 w-4.5 text-rose-gold" /> Daily Booking Sheets
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-light font-medium">Select Date:</span>
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-cream-bg border border-rose-gold-light/25 rounded-xl px-3 py-1.5 text-xs font-semibold text-teal-accent focus:outline-none"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-6 text-xs text-charcoal-light">Loading calendar logs...</div>
            ) : todaysBookings.length === 0 ? (
              <div className="text-center py-12 text-xs text-charcoal-light">
                No appointments booked for {filterDate}. Click "Add Booking" to schedule one.
              </div>
            ) : (
              <div className="space-y-4">
                {todaysBookings.map(appt => (
                  <div 
                    key={appt.id}
                    className={`border border-rose-gold-light/10 rounded-2xl p-4 transition-all relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white`}
                  >
                    {/* Booking metadata */}
                    <div className="space-y-1 text-xs flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-teal-accent">{appt.patient_name}</span>
                        <span className="text-[10px] font-bold bg-cream-bg text-rose-gold px-2 py-0.5 rounded">
                          {appt.patient_id_str}
                        </span>
                      </div>
                      <p className="text-charcoal-light font-medium">{appt.department} • {appt.subcategory || "Consultation"}</p>
                      {appt.notes && <p className="italic text-charcoal-light text-[11px] bg-cream-bg/30 p-1.5 rounded">{appt.notes}</p>}
                      <p className="flex items-center gap-1 font-semibold text-rose-gold"><Clock className="h-3.5 w-3.5" /> Time: {appt.appointment_time}</p>
                    </div>

                    {/* Follow-up Alerts checklist */}
                    <div className="flex flex-col sm:flex-row gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-rose-gold-light/5 text-xs">
                      {/* WhatsApp alert status */}
                      <button
                        onClick={() => handleToggleChecklist(appt.id, "whatsapp_reminder_sent", appt.whatsapp_reminder_sent)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          appt.whatsapp_reminder_sent 
                            ? "bg-green-50 border-green-200 text-green-700 font-semibold" 
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                      </button>

                      {/* SMS alert status */}
                      <button
                        onClick={() => handleToggleChecklist(appt.id, "sms_reminder_sent", appt.sms_reminder_sent)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          appt.sms_reminder_sent 
                            ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold" 
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <Send className="h-3.5 w-3.5" /> SMS (1 Day)
                      </button>

                      {/* Call alert status */}
                      <button
                        onClick={() => handleToggleChecklist(appt.id, "call_reminder_done", appt.call_reminder_done)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          appt.call_reminder_done 
                            ? "bg-amber-50 border-amber-200 text-amber-700 font-semibold" 
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <PhoneCall className="h-3.5 w-3.5" /> Call Checked
                      </button>
                    </div>

                    {/* Status updater */}
                    <div className="flex gap-2 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-rose-gold-light/5">
                      {appt.status === "Scheduled" ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "Completed")}
                            className="bg-teal-accent hover:bg-teal-dark text-white font-bold p-1.5 rounded-lg cursor-pointer flex items-center justify-center"
                            title="Mark Completed"
                          >
                            <CheckCircle className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "Missed")}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold p-1.5 rounded-lg cursor-pointer flex items-center justify-center"
                            title="Mark Missed"
                          >
                            <XCircle className="h-4.5 w-4.5" />
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                          appt.status === "Completed" ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-600"
                        }`}>
                          {appt.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Missed Appointments Alerts (in Red) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Missed block */}
          <div className="bg-cream-card rounded-3xl p-6 border-2 border-red-100 shadow-sm">
            <h3 className="font-heading font-bold text-md text-red-700 flex items-center gap-1.5 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" /> Overdue Reminders (Missed)
            </h3>

            {missedBookings.length === 0 ? (
              <p className="text-xs text-charcoal-light py-4 text-center">No missed appointments pending checks!</p>
            ) : (
              <div className="space-y-3">
                {missedBookings.map(appt => (
                  <div key={appt.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <strong className="text-red-900">{appt.patient_name}</strong>
                      <span className="text-[10px] text-red-700 font-bold">{appt.appointment_date}</span>
                    </div>
                    <p className="text-charcoal-light">{appt.department} • {appt.subcategory || "Laser Check"}</p>
                    <p className="text-rose-gold text-[10px] font-bold">Contact: {appt.patient_mobile}</p>
                    <div className="flex gap-2 pt-1 border-t border-red-200/40 justify-end">
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, "Scheduled")}
                        className="text-[10px] font-bold text-teal-accent hover:underline bg-white px-2 py-1 rounded border shadow-xs"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming appointments list */}
          <div className="bg-cream-card rounded-3xl p-6 border border-rose-gold-light/10 shadow-sm">
            <h3 className="font-heading font-bold text-md text-teal-accent flex items-center gap-1.5 mb-4">
              <CalendarIcon className="h-5 w-5 text-rose-gold" /> Upcoming (Future Weeks)
            </h3>

            {upcomingBookings.length === 0 ? (
              <p className="text-xs text-charcoal-light py-4 text-center">No future appointments scheduled.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {upcomingBookings.map(appt => (
                  <div key={appt.id} className="p-3 bg-cream-bg/40 border border-rose-gold-light/5 rounded-xl">
                    <div className="flex justify-between font-semibold">
                      <span className="text-teal-accent">{appt.patient_name}</span>
                      <span className="text-rose-gold font-bold">{appt.appointment_date}</span>
                    </div>
                    <p className="text-[10px] text-charcoal-light mt-0.5">{appt.department} ({appt.subcategory || "Consultation"})</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
