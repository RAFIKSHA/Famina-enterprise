import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ChevronLeft, Save, Sparkles, AlertCircle, Calendar, ShieldCheck } from "lucide-react";
import api from "../api";

export default function PatientForm({ currentRole }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  
  const initialCategory = searchParams.get("category") || "Skin & Laser";
  const initialSubcategory = searchParams.get("subcategory") || "Laser Hair Reduction";

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    mobile_no: "",
    address: "",
    occupation: "",
    category: initialCategory,
    subcategory: initialSubcategory,
    
    // Medical History
    has_diabetes: false,
    has_high_bp: false,
    has_pcod_pcos: false,
    has_skin_allergy: false,
    has_keloid_history: false,
    other_medical_history: "",

    // Assessment
    treatment_area: "",
    hair_type: "Fine",
    diagnosis: "",
    photographs_taken: false,

    // Post Instructions
    inst_spf_sunscreen: true,
    inst_no_waxing_threading: false,
    inst_avoid_hot_water_steam: false,
    inst_use_moisturizer: true,
    inst_attend_next_session: true,
    custom_post_instructions: "",

    // First session fee collection
    amount_charged: 0,
    amount_paid: 0,
    payment_mode: "Cash",
    next_appointment_date: ""
  });

  useEffect(() => {
    if (id) {
      async function loadPatient() {
        try {
          const p = await api.getPatient(id);
          if (p) {
            setFormData({
              name: p.name || "",
              age: p.age || "",
              gender: p.gender || "Female",
              mobile_no: p.mobile_no || "",
              address: p.address || "",
              occupation: p.occupation || "",
              category: p.category || "Skin & Laser",
              subcategory: p.subcategory || "",
              has_diabetes: !!p.has_diabetes,
              has_high_bp: !!p.has_high_bp,
              has_pcod_pcos: !!p.has_pcod_pcos,
              has_skin_allergy: !!p.has_skin_allergy,
              has_keloid_history: !!p.has_keloid_history,
              other_medical_history: p.other_medical_history || "",
              treatment_area: p.treatment_area || "",
              hair_type: p.hair_type || "Fine",
              diagnosis: p.diagnosis || "",
              photographs_taken: !!p.photographs_taken,
              inst_spf_sunscreen: !!p.inst_spf_sunscreen,
              inst_no_waxing_threading: !!p.inst_no_waxing_threading,
              inst_avoid_hot_water_steam: !!p.inst_avoid_hot_water_steam,
              inst_use_moisturizer: !!p.inst_use_moisturizer,
              inst_attend_next_session: !!p.inst_attend_next_session,
              custom_post_instructions: p.custom_post_instructions || "",
              amount_charged: 0,
              amount_paid: 0,
              payment_mode: "Cash",
              next_appointment_date: ""
            });
          }
        } catch (err) {
          console.error("Error loading patient for edit", err);
        }
      }
      loadPatient();
    }
  }, [id]);

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
    ],
    "Gents Skin & Hair Treatment": [
      "Gents Hair PRP", "Gents Hair Growth Therapy", "Gents Dandruff Treatment", "Gents Skin Whitening", "Other"
    ]
  };

  const handleCategoryChange = (cat) => {
    const sub = subcategories[cat] ? subcategories[cat][0] : "";
    setFormData(prev => ({
      ...prev,
      category: cat,
      subcategory: sub
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update patient
        await api.updatePatient(id, formData);
        navigate(`/patient/${id}`);
      } else {
        // Create patient
        const payload = {
          ...formData,
          name: formData.name || "Patient Record"
        };
        const patient = await api.createPatient(payload);
        
        // If fee is charged or paid, log the first visit session
        if (formData.amount_charged > 0 || formData.amount_paid > 0) {
          const user = api.getCurrentUser();
          await api.createVisit({
            patient: patient.id,
            session_no: 1,
            total_sessions_in_package: 6, // default
            treatment_given: `Initial Setup - ${formData.subcategory || "Consultation"}`,
            notes: "First diagnostic and assessment session. Treatment plan initialized.",
            amount_charged: formData.amount_charged,
            amount_paid: formData.amount_paid,
            payment_mode: formData.payment_mode,
            next_appointment_date: formData.next_appointment_date,
            staff_attended: user ? user.username : "receptionist"
          });
        }
        navigate(`/patient/${patient.id}`);
      }
    } catch (err) {
      console.error("Error saving patient form", err);
      alert("Error saving record. Please review fields.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1.5 text-xs font-semibold text-rose-gold hover:text-rose-gold-dark cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" /> Go Back
        </button>
        <span className="text-xs font-semibold bg-cream-bg text-rose-gold px-3 py-1.5 border border-rose-gold-light/20 rounded-full">
          New Case Sheet
        </span>
      </div>

      <div className="bg-cream-card rounded-3xl p-6 md:p-8 border border-rose-gold-light/10 shadow-sm max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-rose-gold" />
          <h2 className="font-heading font-bold text-2xl text-teal-accent">
            {id ? "Edit Patient Record File" : "Register New Patient File"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-xs">
          
          {/* Section 1: Patient Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-gold border-b border-rose-gold-light/15 pb-2">
              1. Patient Basic Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold text-charcoal-light">Patient Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-semibold text-teal-accent"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 28"
                  className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-medium"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Mobile Number</label>
                <input
                  type="text"
                  value={formData.mobile_no}
                  onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g. Teacher, IT Engineer"
                  className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Cabinet Folder (Category)</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-semibold text-rose-gold"
                >
                  <option value="Skin & Laser">Skin & Laser</option>
                  <option value="Hair Treatment">Hair Treatment</option>
                  <option value="Gents Skin & Hair Treatment">Gents Skin & Hair Treatment</option>
                </select>
              </div>

              {subcategories[formData.category] && (
                <div>
                  <label className="block mb-1 font-semibold text-charcoal-light">Sub-category (Treatment)</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-semibold text-teal-accent"
                  >
                    {subcategories[formData.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold text-charcoal-light">Permanent Address</label>
              <textarea
                rows="2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Clinic patients local address notes..."
                className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Medical History Checkboxes */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-gold border-b border-rose-gold-light/15 pb-2">
              2. Medical History Checklists
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3.5 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_diabetes}
                  onChange={(e) => setFormData({ ...formData, has_diabetes: e.target.checked })}
                />
                <span className="font-semibold text-charcoal">Diabetes</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3.5 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_high_bp}
                  onChange={(e) => setFormData({ ...formData, has_high_bp: e.target.checked })}
                />
                <span className="font-semibold text-charcoal">High BP</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3.5 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_pcod_pcos}
                  onChange={(e) => setFormData({ ...formData, has_pcod_pcos: e.target.checked })}
                />
                <span className="font-semibold text-charcoal">PCOD / PCOS</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3.5 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_skin_allergy}
                  onChange={(e) => setFormData({ ...formData, has_skin_allergy: e.target.checked })}
                />
                <span className="font-semibold text-charcoal">Skin Allergy</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3.5 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_keloid_history}
                  onChange={(e) => setFormData({ ...formData, has_keloid_history: e.target.checked })}
                />
                <span className="font-semibold text-charcoal">Keloid History</span>
              </label>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-charcoal-light">Any Other Medical History / Allergies</label>
              <input
                type="text"
                value={formData.other_medical_history}
                onChange={(e) => setFormData({ ...formData, other_medical_history: e.target.value })}
                placeholder="Free text notes about patient health..."
                className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Clinical Assessment */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-gold border-b border-rose-gold-light/15 pb-2">
              3. Clinical Assessment & Doctor Notes
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-charcoal-light">Treatment Area</label>
                <input
                  type="text"
                  value={formData.treatment_area}
                  onChange={(e) => setFormData({ ...formData, treatment_area: e.target.value })}
                  placeholder="e.g. Face, Scalp, Cheeks"
                  className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
                />
              </div>

              {formData.category === "Skin & Laser" && formData.subcategory?.includes("Laser Hair") && (
                <div>
                  <label className="block mb-1 font-semibold text-charcoal-light">Hair Type</label>
                  <select
                    value={formData.hair_type}
                    onChange={(e) => setFormData({ ...formData, hair_type: e.target.value })}
                    className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-medium"
                  >
                    <option value="Fine">Fine</option>
                    <option value="Medium">Medium</option>
                    <option value="Coarse">Coarse</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="photos_taken"
                  checked={formData.photographs_taken}
                  onChange={(e) => setFormData({ ...formData, photographs_taken: e.target.checked })}
                  className="rounded h-4.5 w-4.5"
                />
                <label htmlFor="photos_taken" className="font-semibold text-charcoal cursor-pointer">
                  Photographs Taken (Before/After)
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-charcoal-light">Diagnosis / Clinical Summary Notes</label>
              <textarea
                rows="3"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Doctor's notes, energy settings details, expected sessions..."
                className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Section 4: Post Treatment Instructions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-gold border-b border-rose-gold-light/15 pb-2">
              4. Post-Treatment Instructions Given
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inst_spf_sunscreen}
                  onChange={(e) => setFormData({ ...formData, inst_spf_sunscreen: e.target.checked })}
                />
                <span className="font-semibold">SPF 50+ Sunscreen</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inst_no_waxing_threading}
                  onChange={(e) => setFormData({ ...formData, inst_no_waxing_threading: e.target.checked })}
                />
                <span className="font-semibold">No Waxing/Threading</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inst_avoid_hot_water_steam}
                  onChange={(e) => setFormData({ ...formData, inst_avoid_hot_water_steam: e.target.checked })}
                />
                <span className="font-semibold">Avoid Steam/Hot Water</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inst_use_moisturizer}
                  onChange={(e) => setFormData({ ...formData, inst_use_moisturizer: e.target.checked })}
                />
                <span className="font-semibold">Moisturizer Regularly</span>
              </label>

              <label className="flex items-center gap-2 border border-rose-gold-light/10 p-3 rounded-xl bg-cream-bg/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inst_attend_next_session}
                  onChange={(e) => setFormData({ ...formData, inst_attend_next_session: e.target.checked })}
                />
                <span className="font-semibold">Attend Next Session</span>
              </label>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-charcoal-light">Custom Department-specific Instructions</label>
              <input
                type="text"
                value={formData.custom_post_instructions}
                onChange={(e) => setFormData({ ...formData, custom_post_instructions: e.target.value })}
                placeholder="e.g. Do not apply makeup for 24 hours, apply calamine lotion."
                className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Section 5: First Session Fees & Package billing */}
          {!id && (
            <div className="space-y-4 bg-rose-50/20 p-5 rounded-2xl border border-rose-gold-light/20">
              <h3 className="text-sm font-bold text-teal-accent border-b border-rose-gold-light/15 pb-2">
                5. Initial Billing & Package Cost (First Session Visit)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-1 font-semibold text-charcoal-light">Total Package / Charge Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount_charged || ""}
                    onChange={(e) => setFormData({ ...formData, amount_charged: e.target.value === "" ? 0 : Number(e.target.value) })}
                    className="w-full bg-white border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-charcoal-light">Amount Paid Today (₹)</label>
                  <input
                    type="number"
                    value={formData.amount_paid || ""}
                    onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value === "" ? 0 : Number(e.target.value) })}
                    className="w-full bg-white border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-bold text-teal-accent"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-charcoal-light">Payment Mode</label>
                  <select
                    value={formData.payment_mode}
                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                    className="w-full bg-white border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-medium"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-charcoal-light">Next Session Appointment Date</label>
                  <input
                    type="date"
                    value={formData.next_appointment_date}
                    onChange={(e) => setFormData({ ...formData, next_appointment_date: e.target.value })}
                    className="w-full bg-white border border-rose-gold-light/20 focus:border-rose-gold p-3 rounded-xl focus:outline-none font-semibold text-teal-accent"
                  />
                </div>
              </div>
              
              <p className="text-[10px] text-charcoal-light italic mt-3">
                * Logging a charge creates Session 1 under the visit ledger history. Outstanding balance will be automatically calculated: ₹{(formData.amount_charged - formData.amount_paid) || 0} due.
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-rose-gold-light/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-cream-bg hover:bg-cream-dark text-charcoal font-semibold py-3 px-6 rounded-xl border border-rose-gold-light/25 cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="bg-teal-accent hover:bg-teal-dark text-white font-bold py-3 px-8 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Save className="h-4.5 w-4.5" />
              Save Record File
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
