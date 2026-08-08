// Unified Django REST API Client connected directly to Supabase Backend

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://famina-enterprise.onrender.com";
  }
  return "http://127.0.0.1:8000";
};

const BASE_URL = getBaseUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem("femina_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const checkBackendStatus = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/health/`);
    return res.ok;
  } catch (err) {
    return false;
  }
};

export const api = {
  isBackendOnline: () => true,

  // Authentication
  login: async (username, password) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("femina_token", data.access);
        
        // Fetch user profile details
        const profileRes = await fetch(`${BASE_URL}/api/auth/profile/`, {
          headers: { "Authorization": `Bearer ${data.access}` }
        });
        if (profileRes.ok) {
          const profile = await profileRes.json();
          localStorage.setItem("femina_user", JSON.stringify(profile));
          return { success: true, user: profile };
        }
        
        const basicUser = { username, role: "admin" };
        localStorage.setItem("femina_user", JSON.stringify(basicUser));
        return { success: true, user: basicUser };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { 
          success: false, 
          message: errData.detail || "Invalid username or password." 
        };
      }
    } catch (err) {
      console.error("Login network error:", err);
      return { 
        success: false, 
        message: "Unable to connect to server. Please check your connection and try again." 
      };
    }
  },

  logout: () => {
    localStorage.removeItem("femina_token");
    localStorage.removeItem("femina_user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("femina_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Patients
  getPatients: async (search = "", category = "", subcategory = "") => {
    try {
      let url = `${BASE_URL}/api/patients/?search=${encodeURIComponent(search)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (subcategory) url += `&subcategory=${encodeURIComponent(subcategory)}`;
      
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      console.error("Fetch patients failed:", err);
      return [];
    }
  },

  getPatient: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients/${id}/`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Fetch patient failed:", err);
      return null;
    }
  },

  createPatient: async (patientData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(patientData)
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    } catch (err) {
      console.error("Create patient failed:", err);
      throw err;
    }
  },

  updatePatient: async (id, patientData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(patientData)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Update patient failed:", err);
      return null;
    }
  },

  deletePatient: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/patients/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch (err) {
      console.error("Delete patient failed:", err);
      return false;
    }
  },

  // Sessions / Visits
  createVisit: async (visitData) => {
    const sanitized = { ...visitData };
    if (sanitized.next_appointment_date === "") {
      sanitized.next_appointment_date = null;
    }
    if (sanitized.visit_date === "") {
      delete sanitized.visit_date;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/visits/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(sanitized)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Create visit failed:", err);
      return null;
    }
  },

  updateVisit: async (id, visitData) => {
    const sanitized = { ...visitData };
    if (sanitized.next_appointment_date === "") {
      sanitized.next_appointment_date = null;
    }
    delete sanitized.id;

    try {
      const res = await fetch(`${BASE_URL}/api/visits/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(sanitized)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Update visit failed:", err);
      return null;
    }
  },

  // Direct Billing / Payments
  createPayment: async (paymentData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/payments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(paymentData)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Create payment failed:", err);
      return null;
    }
  },

  // Appointments
  getAppointments: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      console.error("Fetch appointments failed:", err);
      return [];
    }
  },

  createAppointment: async (apptData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(apptData)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Create appointment failed:", err);
      return null;
    }
  },

  updateAppointment: async (id, apptData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/appointments/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(apptData)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Update appointment failed:", err);
      return null;
    }
  },

  // Academy Admissions
  getAdmissions: async (search = "") => {
    try {
      const res = await fetch(`${BASE_URL}/api/academy/?search=${encodeURIComponent(search)}`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      console.error("Fetch academy admissions failed:", err);
      return [];
    }
  },

  createAdmission: async (admissionData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/academy/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(admissionData)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Create admission failed:", err);
      return null;
    }
  },

  updateAdmission: async (id, admissionData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/academy/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(admissionData)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Update admission failed:", err);
      return null;
    }
  },

  // Salon Bookings
  getSalonBookings: async (service_type = "", search = "") => {
    try {
      let url = `${BASE_URL}/api/salon/?search=${encodeURIComponent(search)}`;
      if (service_type) url += `&service_type=${encodeURIComponent(service_type)}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return [];
    } catch (err) {
      console.error("Fetch salon bookings failed:", err);
      return [];
    }
  },

  createSalonBooking: async (bookingData) => {
    try {
      const res = await fetch(`${BASE_URL}/api/salon/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Create salon booking failed:", err);
      return null;
    }
  },

  // Master Dashboard Analytics
  getAnalytics: async (startDate = "", endDate = "") => {
    try {
      let url = `${BASE_URL}/api/dashboard/analytics/`;
      if (startDate || endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
      return null;
    } catch (err) {
      console.error("Fetch analytics failed:", err);
      return null;
    }
  }
};

export default api;
