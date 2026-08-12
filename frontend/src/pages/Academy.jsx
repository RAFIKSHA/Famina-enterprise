import React, { useState, useEffect } from "react";
import { Plus, BookOpen, Search, Landmark, Clock, ArrowUpDown, ChevronRight, Edit } from "lucide-react";
import api from "../api";

export default function Academy() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    student_name: "",
    course: "Professional Makeup & Hairstyling Diploma",
    admission_date: new Date().toISOString().split("T")[0],
    total_fees: 0,
    amount_paid: 0,
    contact: "",
    batch: "Morning Batch (10:00 - 13:00)",
    notes: ""
  });

  const loadAdmissions = async () => {
    try {
      setLoading(true);
      const data = await api.getAdmissions(search);
      setAdmissions(data);
    } catch (err) {
      console.error("Error loading academy admissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmissions();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        student_name: form.student_name || "Student Record",
        contact: form.contact || "N/A"
      };
      if (editId) {
        await api.updateAdmission(editId, payload);
      } else {
        await api.createAdmission(payload);
      }
      handleClose();
      loadAdmissions();
    } catch (err) {
      console.error("Error saving student record", err);
    }
  };

  const handleEditClick = (student) => {
    setForm({
      student_name: student.student_name,
      course: student.course,
      admission_date: student.admission_date,
      total_fees: student.total_fees,
      amount_paid: student.amount_paid,
      contact: student.contact,
      batch: student.batch,
      notes: student.notes || ""
    });
    setEditId(student.id);
    setShowAddForm(true);
  };

  const handleClose = () => {
    setShowAddForm(false);
    setEditId(null);
    setForm({
      student_name: "",
      course: "Professional Makeup & Hairstyling Diploma",
      admission_date: new Date().toISOString().split("T")[0],
      total_fees: 0,
      amount_paid: 0,
      contact: "",
      batch: "Morning Batch (10:00 - 13:00)",
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-heading text-teal-accent">Academy Student Admissions</h2>
          <p className="text-xs text-charcoal-light">Enroll students, log admission receipts, and track batch courses.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-rose-gold text-white font-medium py-2.5 px-5 rounded-xl shadow-xs transition-transform hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Enroll Student
        </button>
      </div>

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="bg-cream-card rounded-3xl p-6 border-2 border-rose-gold shadow-md max-w-2xl mx-auto animate-fadeIn text-xs">
          <div className="flex justify-between items-center mb-4 border-b border-rose-gold-light/10 pb-2">
            <h4 className="font-heading font-bold text-teal-accent flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rose-gold" /> {editId ? "Edit Student Registration Sheet" : "Student Registration Sheet"}
            </h4>
            <button onClick={handleClose} className="text-xs text-rose-gold font-semibold hover:underline">
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priyanka Patil"
                  value={form.student_name}
                  onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-semibold text-teal-accent"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9822334455"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Course / Academy Program</label>
                <select
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                >
                  <option value="Professional Makeup & Hairstyling Diploma">Professional Makeup & Hairstyling Diploma</option>
                  <option value="Clinical Aesthetician & Laser Diploma">Clinical Aesthetician & Laser Diploma</option>
                  <option value="Self Makeup Basic Course">Self Makeup Basic Course</option>
                  <option value="Advanced Hair Styling Course">Advanced Hair Styling Course</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Batch & Timings</label>
                <input
                  type="text"
                  value={form.batch}
                  onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Total Fee Amount (₹)</label>
                <input
                  type="number"
                  value={form.total_fees || ""}
                  onChange={(e) => setForm({ ...form, total_fees: e.target.value === "" ? 0 : Number(e.target.value) })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Amount Paid Today (₹)</label>
                <input
                  type="number"
                  value={form.amount_paid || ""}
                  onChange={(e) => setForm({ ...form, amount_paid: e.target.value === "" ? 0 : Number(e.target.value) })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-bold text-teal-accent"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Admission Date</label>
                <input
                  type="date"
                  value={form.admission_date}
                  onChange={(e) => setForm({ ...form, admission_date: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 p-3 rounded-xl focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-charcoal-light">Admission Remarks / Installment Notes</label>
              <textarea
                rows="2"
                placeholder="Details of next installments due or batch status..."
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
                {editId ? "Update Student Admission" : "Save Student Admission"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Filter and Student Ledger Table */}
      <div className="bg-cream-card rounded-3xl p-5 border border-rose-gold-light/10 shadow-xs space-y-4">
        {/* Search */}
        <div className="max-w-md relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-rose-gold-dark" />
          <input
            type="text"
            placeholder="Search students by name, course or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-6 text-xs text-charcoal-light">Searching admissions files...</div>
        ) : admissions.length === 0 ? (
          <div className="text-center py-10 text-xs text-charcoal-light">No student admissions records found.</div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream-bg border-b border-rose-gold-light/10 text-rose-gold font-bold uppercase tracking-wider">
                  <th className="p-3">Admission Date</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3 text-right">Total Fees</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right text-red-500">Balance Due</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-gold-light/5">
                {admissions.map(adm => (
                  <tr key={adm.id} className="hover:bg-cream-bg/30">
                    <td className="p-3">{adm.admission_date}</td>
                    <td className="p-3 font-semibold text-teal-accent text-sm">{adm.student_name}</td>
                    <td className="p-3 font-medium">{adm.course}</td>
                    <td className="p-3 text-charcoal-light">{adm.batch}</td>
                    <td className="p-3">{adm.contact}</td>
                    <td className="p-3 text-right font-medium">₹{adm.total_fees}</td>
                    <td className="p-3 text-right font-medium text-teal-accent">₹{adm.amount_paid}</td>
                    <td className={`p-3 text-right font-bold ${adm.balance_due > 0 ? "text-red-500" : "text-teal-accent"}`}>
                      ₹{adm.balance_due}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleEditClick(adm)}
                        className="p-1 text-rose-gold hover:bg-rose-gold/10 rounded cursor-pointer"
                        title="Edit Student Record"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
