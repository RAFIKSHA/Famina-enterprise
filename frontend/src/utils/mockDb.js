// Mock Database and LocalStorage Fallback for Femina Skin Clinic & Makeup Studio

const SEED_DATA = {
  patients: [
    {
      id: 1,
      patient_id: "FEM-2026-0001",
      registration_date: "2026-08-01",
      name: "Pooja Sharma",
      age: 28,
      gender: "Female",
      mobile_no: "9876543210",
      address: "Sahara City, Sillod",
      occupation: "IT Consultant",
      category: "Skin & Laser",
      subcategory: "Laser Hair Reduction",
      has_diabetes: false,
      has_high_bp: false,
      has_pcod_pcos: true,
      has_skin_allergy: false,
      has_keloid_history: false,
      other_medical_history: "",
      treatment_area: "Full Face & Arms",
      hair_type: "Coarse",
      diagnosis: "Hirsutism due to PCOD. Scheduled for 6 sessions of Diode Laser.",
      photographs_taken: true,
      inst_spf_sunscreen: true,
      inst_no_waxing_threading: true,
      inst_avoid_hot_water_steam: true,
      inst_use_moisturizer: true,
      inst_attend_next_session: true,
      custom_post_instructions: "Apply soothing gel if skin gets red.",
      status: "Active",
      custom_clinical_fields: {}
    },
    {
      id: 2,
      patient_id: "FEM-2026-0002",
      registration_date: "2026-08-03",
      name: "Anita Desai",
      age: 34,
      gender: "Female",
      mobile_no: "9922114455",
      address: "Aurangabad Road, Sillod",
      occupation: "Teacher",
      category: "Skin & Laser",
      subcategory: "Chemical Peeling",
      has_diabetes: false,
      has_high_bp: false,
      has_pcod_pcos: false,
      has_skin_allergy: true,
      has_keloid_history: false,
      other_medical_history: "Mild sensitive skin history.",
      treatment_area: "Face",
      hair_type: "",
      diagnosis: "Epidermal Pigmentation / Melasma. Scheduled for 3 Glycolic peel sessions.",
      photographs_taken: true,
      inst_spf_sunscreen: true,
      inst_no_waxing_threading: false,
      inst_avoid_hot_water_steam: false,
      inst_use_moisturizer: true,
      inst_attend_next_session: true,
      custom_post_instructions: "",
      status: "Active",
      custom_clinical_fields: {}
    },
    {
      id: 3,
      patient_id: "FEM-2026-0003",
      registration_date: "2026-08-03",
      name: "Rahul Verma",
      age: 31,
      gender: "Male",
      mobile_no: "9890123456",
      address: "Sillod City",
      occupation: "Bank Manager",
      category: "Hair Treatment",
      subcategory: "Hair PRP",
      has_diabetes: false,
      has_high_bp: false,
      has_pcod_pcos: false,
      has_skin_allergy: false,
      has_keloid_history: false,
      other_medical_history: "",
      treatment_area: "Scalp (Vertex & Frontal)",
      hair_type: "",
      diagnosis: "Male Pattern Baldness (Grade III). Scheduled for 4 PRP sessions.",
      photographs_taken: true,
      inst_spf_sunscreen: false,
      inst_no_waxing_threading: false,
      inst_avoid_hot_water_steam: false,
      inst_use_moisturizer: false,
      inst_attend_next_session: true,
      custom_post_instructions: "Do not wash hair for 24 hours. Avoid heavy exercise today.",
      status: "Active",
      custom_clinical_fields: {}
    },
    {
      id: 4,
      patient_id: "FEM-2026-0004",
      registration_date: "2026-08-03",
      name: "Kabir Malhotra",
      age: 29,
      gender: "Male",
      mobile_no: "9900887766",
      address: "Sahara City, Sillod",
      occupation: "Shop Owner",
      category: "Gents Skin & Hair Treatment",
      subcategory: "Dandruff Treatment",
      has_diabetes: false,
      has_high_bp: false,
      has_pcod_pcos: false,
      has_skin_allergy: false,
      has_keloid_history: false,
      other_medical_history: "",
      treatment_area: "Scalp",
      hair_type: "",
      diagnosis: "Severe Seborrheic Dermatitis. Recommended anti-dandruff scalp peeling treatment.",
      photographs_taken: false,
      inst_spf_sunscreen: false,
      inst_no_waxing_threading: false,
      inst_avoid_hot_water_steam: false,
      inst_use_moisturizer: false,
      inst_attend_next_session: true,
      custom_post_instructions: "",
      status: "Active",
      custom_clinical_fields: {}
    }
  ],
  visits: [
    {
      id: 1,
      patient: 1,
      visit_date: "2026-08-01",
      session_no: 1,
      total_sessions_in_package: 6,
      treatment_given: "Diode Laser Hair Reduction - Session 1",
      notes: "Tolerated well. Mild erythema post-laser, soothing gel applied.",
      amount_charged: 18000.00,
      amount_paid: 6000.00,
      payment_mode: "UPI",
      next_appointment_date: "2026-08-04",
      staff_attended: "doctor",
      staff_name: "doctor"
    },
    {
      id: 2,
      patient: 2,
      visit_date: "2026-08-03",
      session_no: 1,
      total_sessions_in_package: 3,
      treatment_given: "35% Glycolic Acid Peel - Session 1",
      notes: "Neutralized after 2 mins. No frosting. Instructed on strict SPF application.",
      amount_charged: 4500.00,
      amount_paid: 4500.00,
      payment_mode: "Cash",
      next_appointment_date: "2026-08-05",
      staff_attended: "doctor",
      staff_name: "doctor"
    },
    {
      id: 3,
      patient: 3,
      visit_date: "2026-08-03",
      session_no: 1,
      total_sessions_in_package: 4,
      treatment_given: "Autologous PRP Injection with Dermaroller",
      notes: "Activated PRP injected. Minimal pain, scalp wash done.",
      amount_charged: 16000.00,
      amount_paid: 8000.00,
      payment_mode: "Card",
      next_appointment_date: "2026-08-04",
      staff_attended: "doctor",
      staff_name: "doctor"
    },
    {
      id: 4,
      patient: 4,
      visit_date: "2026-08-03",
      session_no: 1,
      total_sessions_in_package: 3,
      treatment_given: "Anti-dandruff clarifying scalp peel + steam therapy",
      notes: "Scalp scaling cleared by 60%. Advised ketoconazole shampoo.",
      amount_charged: 3500.00,
      amount_paid: 1500.00,
      payment_mode: "UPI",
      next_appointment_date: "2026-08-04",
      staff_attended: "doctor",
      staff_name: "doctor"
    }
  ],
  payments: [
    {
      id: 1,
      patient: 1,
      patient_name: "Pooja Sharma",
      patient_id_str: "FEM-2026-0001",
      visit: 1,
      payment_date: "2026-08-01",
      receipt_no: "REC-2026-00001",
      total_package_amount: 18000.00,
      amount_paid: 6000.00,
      payment_mode: "UPI",
      discount_given: 0.00,
      discount_reason: "",
      staff_name: "receptionist"
    },
    {
      id: 2,
      patient: 2,
      patient_name: "Anita Desai",
      patient_id_str: "FEM-2026-0002",
      visit: 2,
      payment_date: "2026-08-03",
      receipt_no: "REC-2026-00002",
      total_package_amount: 4500.00,
      amount_paid: 4500.00,
      payment_mode: "Cash",
      discount_given: 0.00,
      discount_reason: "",
      staff_name: "receptionist"
    },
    {
      id: 3,
      patient: 3,
      patient_name: "Rahul Verma",
      patient_id_str: "FEM-2026-0003",
      visit: 3,
      payment_date: "2026-08-03",
      receipt_no: "REC-2026-00003",
      total_package_amount: 16000.00,
      amount_paid: 8000.00,
      payment_mode: "Card",
      discount_given: 0.00,
      discount_reason: "",
      staff_name: "receptionist"
    },
    {
      id: 4,
      patient: 4,
      patient_name: "Kabir Malhotra",
      patient_id_str: "FEM-2026-0004",
      visit: 4,
      payment_date: "2026-08-03",
      receipt_no: "REC-2026-00004",
      total_package_amount: 3500.00,
      amount_paid: 1500.00,
      payment_mode: "UPI",
      discount_given: 0.00,
      discount_reason: "",
      staff_name: "receptionist"
    }
  ],
  appointments: [
    {
      id: 1,
      patient: 1,
      patient_name: "Pooja Sharma",
      patient_mobile: "9876543210",
      patient_id_str: "FEM-2026-0001",
      appointment_date: "2026-08-04",
      appointment_time: "11:30",
      department: "Skin & Laser",
      subcategory: "Laser Hair Reduction",
      notes: "Session 2 follow-up.",
      status: "Scheduled",
      patient_data_saved: true,
      whatsapp_reminder_sent: true,
      sms_reminder_sent: true,
      call_reminder_done: false
    },
    {
      id: 2,
      patient: 3,
      patient_name: "Rahul Verma",
      patient_mobile: "9890123456",
      patient_id_str: "FEM-2026-0003",
      appointment_date: "2026-08-04",
      appointment_time: "14:30",
      department: "Hair Treatment",
      subcategory: "Hair PRP",
      notes: "Verify scalp healing.",
      status: "Scheduled",
      patient_data_saved: true,
      whatsapp_reminder_sent: true,
      sms_reminder_sent: false,
      call_reminder_done: true
    },
    {
      id: 3,
      patient: 4,
      patient_name: "Kabir Malhotra",
      patient_mobile: "9900887766",
      patient_id_str: "FEM-2026-0004",
      appointment_date: "2026-08-03",
      appointment_time: "10:00",
      department: "Gents Skin & Hair Treatment",
      subcategory: "Dandruff Treatment",
      notes: "Scheduled checkup.",
      status: "Missed",
      patient_data_saved: true,
      whatsapp_reminder_sent: false,
      sms_reminder_sent: false,
      call_reminder_done: false
    },
    {
      id: 4,
      patient: 2,
      patient_name: "Anita Desai",
      patient_mobile: "9922114455",
      patient_id_str: "FEM-2026-0002",
      appointment_date: "2026-08-05",
      appointment_time: "16:00",
      department: "Skin & Laser",
      subcategory: "Chemical Peeling",
      notes: "Session 2 peel.",
      status: "Scheduled",
      patient_data_saved: true,
      whatsapp_reminder_sent: false,
      sms_reminder_sent: false,
      call_reminder_done: false
    }
  ],
  academy: [
    {
      id: 1,
      student_name: "Priyanka Patil",
      course: "Professional Makeup & Styling Course",
      admission_date: "2026-08-01",
      total_fees: 45000.00,
      amount_paid: 15000.00,
      contact: "9822334455",
      batch: "Morning Batch (09:00 - 12:00)",
      notes: "Rs. 30000 due by 15th Aug.",
      balance_due: 30000.00
    },
    {
      id: 2,
      student_name: "Ritu Kale",
      course: "Clinical Aesthetician & Laser Diploma",
      admission_date: "2026-08-03",
      total_fees: 75000.00,
      amount_paid: 75000.00,
      contact: "9955772211",
      batch: "Afternoon Batch (13:00 - 16:00)",
      notes: "Paid full fees with 5% early bird discount.",
      balance_due: 0.00
    }
  ],
  salon: [
    {
      id: 1,
      customer_name: "Snehal Gade",
      service_type: "Makeup",
      service_name: "Bridal HD Makeup Package",
      booking_date: "2026-08-04",
      amount_charged: 15000.00,
      amount_paid: 5000.00,
      payment_mode: "UPI",
      staff_assigned: "Shreya (Senior Artist)",
      status: "Scheduled"
    },
    {
      id: 2,
      customer_name: "Megha Shah",
      service_type: "Salon",
      service_name: "Keratin Hair Treatment + HydraFacial",
      booking_date: "2026-08-03",
      amount_charged: 7500.00,
      amount_paid: 7500.00,
      payment_mode: "Card",
      staff_assigned: "Nilima",
      status: "Completed"
    }
  ]
};

// Initialize Mock DB in LocalStorage
export const initMockDb = () => {
  if (!localStorage.getItem("femina_db")) {
    localStorage.setItem("femina_db", JSON.stringify(SEED_DATA));
  }
};

const getDb = () => {
  initMockDb();
  return JSON.parse(localStorage.getItem("femina_db"));
};

const saveDb = (db) => {
  localStorage.setItem("femina_db", JSON.stringify(db));
};

export const mockDbOps = {
  // Patients CRUD
  getPatients: (search = "", category = "", subcategory = "") => {
    const db = getDb();
    let result = [...db.patients];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.mobile_no.includes(q) || 
        p.patient_id.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q))
      );
    }
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (subcategory) {
      result = result.filter(p => p.subcategory && p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }
    
    // Add visits, payments to result
    return result.map(p => {
      const patientVisits = db.visits.filter(v => v.patient === p.id);
      const patientPayments = db.payments.filter(pay => pay.patient === p.id);
      
      const totalPaid = patientVisits.reduce((sum, v) => sum + Number(v.amount_paid), 0) + 
                         patientPayments.filter(pay => !pay.visit).reduce((sum, pay) => sum + Number(pay.amount_paid), 0);
                         
      const latestPayment = [...patientPayments].pop();
      let balanceDue = 0;
      if (latestPayment) {
        const totalPackage = Number(latestPayment.total_package_amount);
        const totalPaidAll = patientPayments.reduce((sum, pay) => sum + Number(pay.amount_paid), 0);
        const totalDisc = patientPayments.reduce((sum, pay) => sum + Number(pay.discount_given), 0);
        balanceDue = Math.max(0, totalPackage - totalPaidAll - totalDisc);
      } else {
        const totalCharged = patientVisits.reduce((sum, v) => sum + Number(v.amount_charged), 0);
        balanceDue = Math.max(0, totalCharged - totalPaid);
      }

      return {
        ...p,
        visits: patientVisits,
        payments: patientPayments,
        total_paid: totalPaid,
        balance_due: balanceDue
      };
    });
  },

  getPatient: (id) => {
    const db = getDb();
    const p = db.patients.find(x => x.id === Number(id));
    if (!p) return null;
    const patientVisits = db.visits.filter(v => v.patient === p.id);
    const patientPayments = db.payments.filter(pay => pay.patient === p.id);
    
    const totalPaid = patientVisits.reduce((sum, v) => sum + Number(v.amount_paid), 0);
    const latestPayment = [...patientPayments].pop();
    let balanceDue = 0;
    if (latestPayment) {
      const totalPackage = Number(latestPayment.total_package_amount);
      const totalPaidAll = patientPayments.reduce((sum, pay) => sum + Number(pay.amount_paid), 0);
      const totalDisc = patientPayments.reduce((sum, pay) => sum + Number(pay.discount_given), 0);
      balanceDue = Math.max(0, totalPackage - totalPaidAll - totalDisc);
    } else {
      const totalCharged = patientVisits.reduce((sum, v) => sum + Number(v.amount_charged), 0);
      balanceDue = Math.max(0, totalCharged - totalPaid);
    }

    return {
      ...p,
      visits: patientVisits,
      payments: patientPayments,
      total_paid: totalPaid,
      balance_due: balanceDue
    };
  },

  createPatient: (data) => {
    const db = getDb();
    const newId = db.patients.length > 0 ? Math.max(...db.patients.map(p => p.id)) + 1 : 1;
    const year = new Date().getFullYear();
    const count = db.patients.filter(p => p.registration_date.startsWith(String(year))).length + 1;
    const patient_id = `FEM-${year}-${String(count).padStart(4, "0")}`;

    const newPatient = {
      id: newId,
      patient_id,
      registration_date: new Date().toISOString().split("T")[0],
      name: data.name,
      age: Number(data.age),
      gender: data.gender || "Female",
      mobile_no: data.mobile_no,
      address: data.address || "",
      occupation: data.occupation || "",
      category: data.category,
      subcategory: data.subcategory || "",
      has_diabetes: !!data.has_diabetes,
      has_high_bp: !!data.has_high_bp,
      has_pcod_pcos: !!data.has_pcod_pcos,
      has_skin_allergy: !!data.has_skin_allergy,
      has_keloid_history: !!data.has_keloid_history,
      other_medical_history: data.other_medical_history || "",
      treatment_area: data.treatment_area || "",
      hair_type: data.hair_type || "",
      diagnosis: data.diagnosis || "",
      photographs_taken: !!data.photographs_taken,
      inst_spf_sunscreen: !!data.inst_spf_sunscreen,
      inst_no_waxing_threading: !!data.inst_no_waxing_threading,
      inst_avoid_hot_water_steam: !!data.inst_avoid_hot_water_steam,
      inst_use_moisturizer: !!data.inst_use_moisturizer,
      inst_attend_next_session: !!data.inst_attend_next_session,
      custom_post_instructions: data.custom_post_instructions || "",
      status: "Active",
      custom_clinical_fields: data.custom_clinical_fields || {}
    };

    db.patients.push(newPatient);
    saveDb(db);
    return newPatient;
  },

  updatePatient: (id, data) => {
    const db = getDb();
    const idx = db.patients.findIndex(p => p.id === Number(id));
    if (idx === -1) return null;

    db.patients[idx] = {
      ...db.patients[idx],
      ...data,
      age: data.age ? Number(data.age) : db.patients[idx].age
    };
    saveDb(db);
    return db.patients[idx];
  },

  deletePatient: (id) => {
    const db = getDb();
    db.patients = db.patients.filter(p => p.id !== Number(id));
    db.visits = db.visits.filter(v => v.patient !== Number(id));
    db.payments = db.payments.filter(pay => pay.patient !== Number(id));
    db.appointments = db.appointments.filter(a => a.patient !== Number(id));
    saveDb(db);
    return true;
  },

  // Visits
  createVisit: (data) => {
    const db = getDb();
    const newId = db.visits.length > 0 ? Math.max(...db.visits.map(v => v.id)) + 1 : 1;
    const newVisit = {
      id: newId,
      patient: Number(data.patient),
      visit_date: data.visit_date || new Date().toISOString().split("T")[0],
      session_no: Number(data.session_no),
      total_sessions_in_package: Number(data.total_sessions_in_package || 1),
      treatment_given: data.treatment_given,
      notes: data.notes || "",
      before_photo: data.before_photo || null,
      after_photo: data.after_photo || null,
      amount_charged: Number(data.amount_charged || 0),
      amount_paid: Number(data.amount_paid || 0),
      payment_mode: data.payment_mode || "Cash",
      next_appointment_date: data.next_appointment_date || null,
      staff_attended: data.staff_attended || "receptionist",
      staff_name: data.staff_attended || "receptionist"
    };

    db.visits.push(newVisit);

    // Also trigger payment logging
    if (newVisit.amount_charged > 0 || newVisit.amount_paid > 0) {
      const patientPayments = db.payments.filter(pay => pay.patient === newVisit.patient);
      const latestPayment = patientPayments.pop();
      const packageAmount = latestPayment ? Number(latestPayment.total_package_amount) : newVisit.amount_charged;

      const newPayId = db.payments.length > 0 ? Math.max(...db.payments.map(p => p.id)) + 1 : 1;
      const receiptCount = db.payments.length + 1;
      const receipt_no = `REC-2026-${String(receiptCount).padStart(5, "0")}`;

      db.payments.push({
        id: newPayId,
        patient: newVisit.patient,
        patient_name: db.patients.find(x => x.id === newVisit.patient)?.name || "Patient",
        patient_id_str: db.patients.find(x => x.id === newVisit.patient)?.patient_id || "",
        visit: newVisit.id,
        payment_date: newVisit.visit_date,
        receipt_no,
        total_package_amount: packageAmount,
        amount_paid: newVisit.amount_paid,
        payment_mode: newVisit.payment_mode,
        discount_given: 0,
        discount_reason: "",
        staff_name: newVisit.staff_attended
      });
    }

    saveDb(db);
    return newVisit;
  },

  updateVisit: (id, data) => {
    const db = getDb();
    const idx = db.visits.findIndex(v => v.id === Number(id));
    if (idx === -1) return null;

    db.visits[idx] = {
      ...db.visits[idx],
      ...data,
      session_no: data.session_no !== undefined ? Number(data.session_no) : db.visits[idx].session_no,
      total_sessions_in_package: data.total_sessions_in_package !== undefined ? Number(data.total_sessions_in_package) : db.visits[idx].total_sessions_in_package,
      amount_charged: data.amount_charged !== undefined ? Number(data.amount_charged) : db.visits[idx].amount_charged,
      amount_paid: data.amount_paid !== undefined ? Number(data.amount_paid) : db.visits[idx].amount_paid,
    };

    const updatedVisit = db.visits[idx];

    // Keep corresponding payment in sync
    const paymentIdx = db.payments.findIndex(pay => pay.visit === updatedVisit.id);
    if (paymentIdx !== -1) {
      if (updatedVisit.amount_charged === 0 && updatedVisit.amount_paid === 0) {
        db.payments.splice(paymentIdx, 1);
      } else {
        db.payments[paymentIdx] = {
          ...db.payments[paymentIdx],
          amount_paid: updatedVisit.amount_paid,
          payment_mode: updatedVisit.payment_mode,
          payment_date: updatedVisit.visit_date
        };
      }
    } else {
      if (updatedVisit.amount_charged > 0 || updatedVisit.amount_paid > 0) {
        const patientPayments = db.payments.filter(pay => pay.patient === updatedVisit.patient);
        const latestPayment = patientPayments.pop();
        const packageAmount = latestPayment ? Number(latestPayment.total_package_amount) : updatedVisit.amount_charged;

        const newPayId = db.payments.length > 0 ? Math.max(...db.payments.map(p => p.id)) + 1 : 1;
        const receiptCount = db.payments.length + 1;
        const receipt_no = `REC-2026-${String(receiptCount).padStart(5, "0")}`;

        db.payments.push({
          id: newPayId,
          patient: updatedVisit.patient,
          patient_name: db.patients.find(x => x.id === updatedVisit.patient)?.name || "Patient",
          patient_id_str: db.patients.find(x => x.id === updatedVisit.patient)?.patient_id || "",
          visit: updatedVisit.id,
          payment_date: updatedVisit.visit_date,
          receipt_no,
          total_package_amount: packageAmount,
          amount_paid: updatedVisit.amount_paid,
          payment_mode: updatedVisit.payment_mode,
          discount_given: 0,
          discount_reason: "",
          staff_name: updatedVisit.staff_attended
        });
      }
    }

    saveDb(db);
    return updatedVisit;
  },

  // Direct Payments
  createPayment: (data) => {
    const db = getDb();
    const newId = db.payments.length > 0 ? Math.max(...db.payments.map(p => p.id)) + 1 : 1;
    const count = db.payments.length + 1;
    const receipt_no = `REC-2026-${String(count).padStart(5, "0")}`;

    const newPayment = {
      id: newId,
      patient: Number(data.patient),
      patient_name: db.patients.find(x => x.id === Number(data.patient))?.name || "Patient",
      patient_id_str: db.patients.find(x => x.id === Number(data.patient))?.patient_id || "",
      visit: data.visit ? Number(data.visit) : null,
      payment_date: data.payment_date || new Date().toISOString().split("T")[0],
      receipt_no,
      total_package_amount: Number(data.total_package_amount || 0),
      amount_paid: Number(data.amount_paid || 0),
      payment_mode: data.payment_mode || "Cash",
      discount_given: Number(data.discount_given || 0),
      discount_reason: data.discount_reason || "",
      staff_name: data.collected_by || "receptionist"
    };

    db.payments.push(newPayment);
    saveDb(db);
    return newPayment;
  },

  // Appointments
  getAppointments: () => {
    const db = getDb();
    return db.appointments;
  },

  createAppointment: (data) => {
    const db = getDb();
    const newId = db.appointments.length > 0 ? Math.max(...db.appointments.map(a => a.id)) + 1 : 1;
    const patientObj = db.patients.find(x => x.id === Number(data.patient));
    const newAppointment = {
      id: newId,
      patient: Number(data.patient),
      patient_name: patientObj?.name || "Patient",
      patient_mobile: patientObj?.mobile_no || "",
      patient_id_str: patientObj?.patient_id || "",
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time || "10:00",
      department: data.department,
      subcategory: data.subcategory || "",
      notes: data.notes || "",
      status: "Scheduled",
      patient_data_saved: !!data.patient_data_saved,
      whatsapp_reminder_sent: !!data.whatsapp_reminder_sent,
      sms_reminder_sent: !!data.sms_reminder_sent,
      call_reminder_done: !!data.call_reminder_done
    };

    db.appointments.push(newAppointment);
    saveDb(db);
    return newAppointment;
  },

  updateAppointment: (id, data) => {
    const db = getDb();
    const idx = db.appointments.findIndex(a => a.id === Number(id));
    if (idx === -1) return null;

    db.appointments[idx] = {
      ...db.appointments[idx],
      ...data
    };
    saveDb(db);
    return db.appointments[idx];
  },

  // Academy Admissions
  getAdmissions: (search = "") => {
    const db = getDb();
    let res = [...db.academy];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(a => 
        a.student_name.toLowerCase().includes(q) || 
        a.course.toLowerCase().includes(q) || 
        a.batch.toLowerCase().includes(q)
      );
    }
    return res;
  },

  createAdmission: (data) => {
    const db = getDb();
    const newId = db.academy.length > 0 ? Math.max(...db.academy.map(a => a.id)) + 1 : 1;
    const newAdm = {
      id: newId,
      student_name: data.student_name,
      course: data.course,
      admission_date: data.admission_date || new Date().toISOString().split("T")[0],
      total_fees: Number(data.total_fees || 0),
      amount_paid: Number(data.amount_paid || 0),
      contact: data.contact,
      batch: data.batch,
      notes: data.notes || "",
      balance_due: Number(data.total_fees || 0) - Number(data.amount_paid || 0)
    };
    db.academy.push(newAdm);
    saveDb(db);
    return newAdm;
  },

  updateAdmission: (id, data) => {
    const db = getDb();
    const idx = db.academy.findIndex(a => a.id === Number(id));
    if (idx === -1) return null;
    
    db.academy[idx] = {
      ...db.academy[idx],
      ...data,
      total_fees: Number(data.total_fees || 0),
      amount_paid: Number(data.amount_paid || 0),
      balance_due: Number(data.total_fees || 0) - Number(data.amount_paid || 0)
    };
    saveDb(db);
    return db.academy[idx];
  },

  // Salon Bookings
  getSalonBookings: (service_type = "", search = "") => {
    const db = getDb();
    let res = [...db.salon];
    if (service_type) {
      res = res.filter(s => s.service_type.toLowerCase() === service_type.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(s => 
        s.customer_name.toLowerCase().includes(q) || 
        s.service_name.toLowerCase().includes(q) || 
        (s.staff_assigned && s.staff_assigned.toLowerCase().includes(q))
      );
    }
    return res;
  },

  createSalonBooking: (data) => {
    const db = getDb();
    const newId = db.salon.length > 0 ? Math.max(...db.salon.map(s => s.id)) + 1 : 1;
    const newBooking = {
      id: newId,
      customer_name: data.customer_name,
      service_type: data.service_type,
      service_name: data.service_name,
      booking_date: data.booking_date || new Date().toISOString().split("T")[0],
      amount_charged: Number(data.amount_charged || 0),
      amount_paid: Number(data.amount_paid || 0),
      payment_mode: data.payment_mode || "Cash",
      staff_assigned: data.staff_assigned || "",
      status: "Scheduled"
    };
    db.salon.push(newBooking);
    saveDb(db);
    return newBooking;
  },

  // Analytics View calculations
  getAnalytics: (startDateStr, endDateStr) => {
    const db = getDb();
    const today = new Date().toISOString().split("T")[0];
    
    // Fallback date ranges
    const start = startDateStr || new Date(new Date().setDate(1)).toISOString().split("T")[0]; // start of month
    const end = endDateStr || today;

    const inRange = (d, s, e) => d >= s && d <= e;

    // Today's collection
    const todayPayments = db.payments.filter(p => p.payment_date === today).reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const todaySalon = db.salon.filter(s => s.booking_date === today).reduce((sum, s) => sum + Number(s.amount_paid), 0);
    const todayAcademy = db.academy.filter(a => a.admission_date === today).reduce((sum, a) => sum + Number(a.amount_paid), 0);
    const todayCollection = todayPayments + todaySalon + todayAcademy;

    // Today's appointments
    const todayAppts = db.appointments.filter(a => a.appointment_date === today);
    const pendingFollowups = db.appointments.filter(a => a.appointment_date < today && a.status === "Scheduled").length;

    // Range Revenue
    const rangePaymentsList = db.payments.filter(p => inRange(p.payment_date, start, end));
    const rangeSalonList = db.salon.filter(s => inRange(s.booking_date, start, end));
    const rangeAcademyList = db.academy.filter(a => inRange(a.admission_date, start, end));

    const totalRevenue = rangePaymentsList.reduce((sum, p) => sum + Number(p.amount_paid), 0) + 
                         rangeSalonList.reduce((sum, s) => sum + Number(s.amount_paid), 0) + 
                         rangeAcademyList.reduce((sum, a) => sum + Number(a.amount_paid), 0);

    // Department Breakdown
    const getPatientCategory = (patientId) => {
      return db.patients.find(x => x.id === patientId)?.category || "Skin & Laser";
    };

    const skinRev = rangePaymentsList.filter(p => getPatientCategory(p.patient) === "Skin & Laser").reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const hairRev = rangePaymentsList.filter(p => getPatientCategory(p.patient) === "Hair Treatment").reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const gentsRev = rangePaymentsList.filter(p => getPatientCategory(p.patient) === "Gents Skin & Hair Treatment").reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const salonRev = rangeSalonList.filter(s => s.service_type === "Salon").reduce((sum, s) => sum + Number(s.amount_paid), 0);
    const makeupRev = rangeSalonList.filter(s => s.service_type === "Makeup").reduce((sum, s) => sum + Number(s.amount_paid), 0);
    const academyRev = rangeAcademyList.reduce((sum, a) => sum + Number(a.amount_paid), 0);

    const deptRevenue = [
      { name: "Skin & Laser", value: skinRev },
      { name: "Hair Treatment", value: hairRev },
      { name: "Salon Services", value: salonRev },
      { name: "Makeup Services", value: makeupRev },
      { name: "Academy", value: academyRev },
      { name: "Gents Services", value: gentsRev },
    ];

    // Treatment Breakdown
    const treatmentRevDict = {};
    rangePaymentsList.forEach(p => {
      const subcat = db.patients.find(x => x.id === p.patient)?.subcategory || "General / Other";
      treatmentRevDict[subcat] = (treatmentRevDict[subcat] || 0) + Number(p.amount_paid);
    });
    const treatmentRevenue = Object.entries(treatmentRevDict).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 8);

    // Dues
    let totalDues = 0;
    db.patients.forEach(patient => {
      const pVisits = db.visits.filter(v => v.patient === patient.id);
      const pPayments = db.payments.filter(pay => pay.patient === patient.id);
      const latestPay = pPayments[pPayments.length - 1];
      if (latestPay) {
        const totalPack = Number(latestPay.total_package_amount);
        const totalPaid = pPayments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
        const totalDisc = pPayments.reduce((sum, p) => sum + Number(p.discount_given), 0);
        totalDues += Math.max(0, totalPack - totalPaid - totalDisc);
      } else {
        const totalChg = pVisits.reduce((sum, v) => sum + Number(v.amount_charged), 0);
        const totalPaid = pVisits.reduce((sum, v) => sum + Number(v.amount_paid), 0);
        totalDues += Math.max(0, totalChg - totalPaid);
      }
    });

    const academyDues = db.academy.reduce((sum, a) => sum + (Number(a.total_fees) - Number(a.amount_paid)), 0);
    const salonDues = db.salon.reduce((sum, s) => sum + (Number(s.amount_charged) - Number(s.amount_paid)), 0);
    const totalOutstandingDues = totalDues + academyDues + salonDues;

    // Payment Mode Split
    const modes = {};
    rangePaymentsList.forEach(p => { modes[p.payment_mode] = (modes[p.payment_mode] || 0) + Number(p.amount_paid); });
    rangeSalonList.forEach(s => { modes[s.payment_mode] = (modes[s.payment_mode] || 0) + Number(s.amount_paid); });
    const paymentModeSplit = Object.entries(modes).map(([name, value]) => ({ name, value }));

    // Patient counts
    const totalPatients = db.patients.length;
    const newPatientsThisMonth = db.patients.filter(p => p.registration_date >= start.substring(0, 7) + "-01").length;

    const deptCounts = {};
    db.patients.forEach(p => {
      deptCounts[p.category] = (deptCounts[p.category] || 0) + 1;
    });
    const deptPatients = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));

    // Repeat vs One-time
    let repeatCount = 0;
    let oneTimeCount = 0;
    db.patients.forEach(p => {
      const vCount = db.visits.filter(v => v.patient === p.id).length;
      if (vCount > 1) repeatCount++;
      else oneTimeCount++;
    });

    const patientTypeSplit = [
      { name: "Repeat Patients", value: repeatCount },
      { name: "One-time Patients", value: oneTimeCount }
    ];

    // Sessions remaining
    let sessionsRemaining = 0;
    db.patients.forEach(p => {
      const pVisits = db.visits.filter(v => v.patient === p.id).sort((a,b) => b.visit_date.localeCompare(a.visit_date));
      const lastVisit = pVisits[0];
      if (lastVisit && lastVisit.session_no < lastVisit.total_sessions_in_package) {
        sessionsRemaining++;
      }
    });

    return {
      today_snapshot: {
        collection: todayCollection,
        appointments_count: todayAppts.length,
        appointments: todayAppts.map(a => ({
          id: a.id,
          patient_name: a.patient_name,
          patient_mobile: a.patient_mobile,
          time: a.appointment_time,
          department: a.department,
          subcategory: a.subcategory,
          status: a.status
        })),
        new_patients: db.patients.filter(p => p.registration_date === today).length,
        pending_followups: pendingFollowups
      },
      revenue: {
        total_revenue: totalRevenue,
        dept_revenue: deptRevenue,
        treatment_revenue: treatmentRevenue,
        total_outstanding_dues: totalOutstandingDues,
        payment_mode_split: paymentModeSplit
      },
      patients: {
        total_patients: totalPatients,
        new_patients_this_month: newPatientsThisMonth,
        dept_patients: deptPatients,
        patient_type_split: patientTypeSplit,
        sessions_remaining: sessionsRemaining
      }
    };
  }
};
