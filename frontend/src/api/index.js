// Unified API Client with Automatic Django Backend/Offline LocalStorage Fallback

import { mockDbOps, initMockDb } from "../utils/mockDb";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// State to track if backend is online
let backendOnline = false;

// Helper to check backend status
export const checkBackendStatus = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/patients/`, { method: "HEAD" });
    backendOnline = res.ok || res.status === 401 || res.status === 403;
  } catch (err) {
    backendOnline = false;
  }
  return backendOnline;
};

// Check initially
checkBackendStatus();

const getAuthHeaders = () => {
  const token = localStorage.getItem("femina_token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const api = {
  isBackendOnline: () => backendOnline,

  // Authentication
  login: async (username, password) => {
    // If backend is online, attempt API login
    if (backendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("femina_token", data.access);
          // Fetch user details to get role
          const profileRes = await fetch(`${BASE_URL}/api/auth/profile/`, {
            headers: getAuthHeaders()
          });
          if (profileRes.ok) {
            const profile = await profileRes.json();
            localStorage.setItem("femina_user", JSON.stringify(profile));
            return { success: true, user: profile };
          }
        }
      } catch (err) {
        console.error("Backend login failed, attempting fallback...", err);
      }
    }

    // Fallback Mock Authentication
    // Accept admin/adminpassword123, doctor/doctorpassword123, receptionist/receppassword123
    const mockUsers = {
      admin: { id: 1, username: "admin", role: "admin", first_name: "Femina", last_name: "Admin" },
      doctor: { id: 2, username: "doctor", role: "doctor", first_name: "Dr. Anjali", last_name: "Deshmukh" },
      receptionist: { id: 3, username: "receptionist", role: "receptionist", first_name: "Kiran", last_name: "Joshi" }
    };

    const credentials = {
      admin: "adminpassword123",
      doctor: "doctorpassword123",
      receptionist: "receppassword123"
    };

    if (mockUsers[username] && credentials[username] === password) {
      const user = mockUsers[username];
      localStorage.setItem("femina_token", "mock-jwt-token");
      localStorage.setItem("femina_user", JSON.stringify(user));
      return { success: true, user };
    }

    return { success: false, message: "Invalid username or password" };
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
    await checkBackendStatus();
    if (backendOnline) {
      try {
        let url = `${BASE_URL}/api/patients/?search=${encodeURIComponent(search)}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (subcategory) url += `&subcategory=${encodeURIComponent(subcategory)}`;
        
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.error("Backend fetch failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.getPatients(search, category, subcategory);
  },

  getPatient: async (id) => {
    await checkBackendStatus();
    if (backendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/api/patients/${id}/`, { headers: getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.error("Backend fetch failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.getPatient(id);
  },

  createPatient: async (patientData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend create failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.createPatient(patientData);
  },

  updatePatient: async (id, patientData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend update failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.updatePatient(id, patientData);
  },

  deletePatient: async (id) => {
    await checkBackendStatus();
    if (backendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/api/patients/${id}/`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (res.ok) return true;
      } catch (err) {
        console.error("Backend delete failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.deletePatient(id);
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

    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend create visit failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.createVisit(sanitized);
  },

  updateVisit: async (id, visitData) => {
    const sanitized = { ...visitData };
    if (sanitized.next_appointment_date === "") {
      sanitized.next_appointment_date = null;
    }
    delete sanitized.id;

    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend update visit failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.updateVisit(id, sanitized);
  },

  // Direct Billing / Payments
  createPayment: async (paymentData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend create payment failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.createPayment(paymentData);
  },

  // Appointments
  getAppointments: async () => {
    await checkBackendStatus();
    if (backendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/api/appointments/`, { headers: getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.error("Backend fetch appointments failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.getAppointments();
  },

  createAppointment: async (apptData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend create appointment failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.createAppointment(apptData);
  },

  updateAppointment: async (id, apptData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend update appointment failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.updateAppointment(id, apptData);
  },

  // Academy Admissions
  getAdmissions: async (search = "") => {
    await checkBackendStatus();
    if (backendOnline) {
      try {
        const res = await fetch(`${BASE_URL}/api/academy/?search=${encodeURIComponent(search)}`, { headers: getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.error("Backend fetch academy admissions failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.getAdmissions(search);
  },

  createAdmission: async (admissionData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend create admission failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.createAdmission(admissionData);
  },

  updateAdmission: async (id, admissionData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend update admission failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.updateAdmission(id, admissionData);
  },

  // Salon Bookings
  getSalonBookings: async (service_type = "", search = "") => {
    await checkBackendStatus();
    if (backendOnline) {
      try {
        let url = `${BASE_URL}/api/salon/?search=${encodeURIComponent(search)}`;
        if (service_type) url += `&service_type=${encodeURIComponent(service_type)}`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.error("Backend fetch salon bookings failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.getSalonBookings(service_type, search);
  },

  createSalonBooking: async (bookingData) => {
    await checkBackendStatus();
    if (backendOnline) {
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
      } catch (err) {
        console.error("Backend create salon booking failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.createSalonBooking(bookingData);
  },

  // Master Dashboard Analytics
  getAnalytics: async (startDate = "", endDate = "") => {
    await checkBackendStatus();
    if (backendOnline) {
      try {
        let url = `${BASE_URL}/api/dashboard/analytics/`;
        if (startDate || endDate) {
          url += `?start_date=${startDate}&end_date=${endDate}`;
        }
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {
        console.error("Backend fetch analytics failed, falling back to LocalStorage...", err);
      }
    }
    return mockDbOps.getAnalytics(startDate, endDate);
  }
};
export default api;
