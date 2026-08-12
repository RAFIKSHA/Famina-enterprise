import React, { useState, useEffect } from "react";
import { Plus, Scissors, Search, Sparkles, User, Calendar, CheckCircle } from "lucide-react";
import api from "../api";

export default function Salon({ serviceType }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    service_type: serviceType,
    service_name: "",
    booking_date: new Date().toISOString().split("T")[0],
    amount_charged: 0,
    amount_paid: 0,
    payment_mode: "Cash",
    staff_assigned: ""
  });

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getSalonBookings(serviceType, search);
      setBookings(data);
    } catch (err) {
      console.error(`Error loading ${serviceType} bookings`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset form service type when serviceType prop changes
    setForm(prev => ({ ...prev, service_type: serviceType }));
    loadBookings();
  }, [serviceType, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        customer_name: form.customer_name || "Walk-in Customer",
        service_name: form.service_name || (serviceType === "Makeup" ? "Makeup Service" : "Salon Service")
      };
      await api.createSalonBooking(payload);
      setShowAddForm(false);
      setForm({
        customer_name: "",
        service_type: serviceType,
        service_name: "",
        booking_date: new Date().toISOString().split("T")[0],
        amount_charged: 0,
        amount_paid: 0,
        payment_mode: "Cash",
        staff_assigned: ""
      });
      loadBookings();
    } catch (err) {
      console.error("Error creating booking", err);
    }
  };

  const isMakeup = serviceType === "Makeup";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-teal-accent">
            {isMakeup ? "Makeup Booking Logs" : "Salon Services Logs"}
          </h2>
          <p className="text-xs text-charcoal-light">
            {isMakeup 
              ? "Bridal makeup registries, HD packages, and makeup artist schedules."
              : "Hair smoothening, scalp spas, facials, and beauty booking logs."}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-rose-gold text-white font-medium py-2.5 px-5 rounded-xl shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Book Service
        </button>
      </div>

      {/* Add Booking Modal */}
      {showAddForm && (
        <div className="bg-cream-card rounded-3xl p-6 border-2 border-rose-gold shadow-md max-w-xl mx-auto animate-fadeIn text-xs">
          <div className="flex justify-between items-center mb-4 border-b border-rose-gold-light/10 pb-2">
            <h4 className="font-heading font-bold text-teal-accent flex items-center gap-2">
              {isMakeup ? <Sparkles className="h-5 w-5 text-rose-gold" /> : <Scissors className="h-5 w-5 text-rose-gold" />}
              Create Service Ticket
            </h4>
            <button onClick={() => setShowAddForm(false)} className="text-xs text-rose-gold font-semibold hover:underline">
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Snehal Gade"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-semibold text-teal-accent"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Staff Attending (Stylist/Artist)</label>
                <input
                  type="text"
                  placeholder="e.g. Shreya, Nilima"
                  value={form.staff_assigned}
                  onChange={(e) => setForm({ ...form, staff_assigned: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-semibold text-rose-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Service Done</label>
                <input
                  type="text"
                  placeholder={isMakeup ? "e.g. Bridal HD Makeup Package" : "e.g. Keratin Hair Smoothening"}
                  value={form.service_name}
                  onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Booking Date</label>
                <input
                  type="date"
                  value={form.booking_date}
                  onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Amount Charged (₹)</label>
                <input
                  type="number"
                  value={form.amount_charged || ""}
                  onChange={(e) => setForm({ ...form, amount_charged: e.target.value === "" ? 0 : Number(e.target.value) })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={form.amount_paid || ""}
                  onChange={(e) => setForm({ ...form, amount_paid: e.target.value === "" ? 0 : Number(e.target.value) })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-bold text-teal-accent"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Payment Mode</label>
                <select
                  value={form.payment_mode}
                  onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-teal-accent hover:bg-teal-dark text-white font-bold py-2.5 px-6 rounded-xl shadow cursor-pointer"
              >
                Log Service Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings Ledger Board */}
      <div className="bg-cream-card rounded-3xl p-5 border border-rose-gold-light/10 shadow-xs space-y-4">
        {/* Search */}
        <div className="max-w-md relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-rose-gold-dark" />
          <input
            type="text"
            placeholder="Search bookings by customer or staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none"
          />
        </div>

        {/* List Table */}
        {loading ? (
          <div className="text-center py-6 text-xs text-charcoal-light">Searching booking files...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 text-xs text-charcoal-light">No service tickets found in this folder.</div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-bg border-b border-rose-gold-light/10 text-rose-gold font-bold uppercase tracking-wider">
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Service Details</th>
                  <th className="p-3">Staff Assigned</th>
                  <th className="p-3 text-right">Charged</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right text-red-500">Balance Due</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-gold-light/5">
                {bookings.map(b => {
                  const dues = Math.max(0, b.amount_charged - b.amount_paid);
                  return (
                    <tr key={b.id} className="hover:bg-cream-bg/30">
                      <td className="p-3">{b.booking_date}</td>
                      <td className="p-3 font-semibold text-teal-accent text-sm">{b.customer_name}</td>
                      <td className="p-3 font-medium">{b.service_name}</td>
                      <td className="p-3 text-rose-gold font-semibold flex items-center gap-1 mt-1.5"><User className="h-3 w-3" /> {b.staff_assigned || "—"}</td>
                      <td className="p-3 text-right font-medium">₹{b.amount_charged}</td>
                      <td className="p-3 text-right font-medium text-teal-accent">₹{b.amount_paid} ({b.payment_mode})</td>
                      <td className={`p-3 text-right font-bold ${dues > 0 ? "text-red-500" : "text-teal-accent"}`}>
                        ₹{dues}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          b.status === "Completed" ? "bg-teal-50 text-teal-700" : "bg-orange-50 text-orange-700"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
