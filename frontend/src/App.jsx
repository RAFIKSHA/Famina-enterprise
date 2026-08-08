import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";
import PatientForm from "./components/PatientForm";
import MasterDashboard from "./pages/MasterDashboard";
import Appointments from "./pages/Appointments";
import Academy from "./pages/Academy";
import Salon from "./pages/Salon";
import Login from "./pages/Login";
import Home from "./pages/Home";
import api from "./api";
import { initMockDb } from "./utils/mockDb";

// Authentication Guard Component
const AuthGuard = ({ children, user }) => {
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const [user, setUser] = useState(api.getCurrentUser());
  const [role, setRole] = useState(user ? user.role : "receptionist");
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    // Seed localStorage database if empty on startup
    initMockDb();
  }, []);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    setRole(loggedUser.role);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  const handleChangeRole = (newRole) => {
    setRole(newRole);
    // Also sync mock user role
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem("femina_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Auth Route */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} 
        />

        {/* Protected App Routes */}
        <Route
          path="/*"
          element={
            <AuthGuard user={user}>
              <Layout 
                currentRole={role} 
                onChangeRole={handleChangeRole} 
                globalSearch={globalSearch}
                setGlobalSearch={setGlobalSearch}
                onLogout={handleLogout}
              >
                <Routes>
                  {/* Dashboard Explorer paths */}
                  <Route path="/dashboard" element={<Dashboard currentRole={role} globalSearch={globalSearch} />} />
                  <Route path="/category/:category" element={<Dashboard currentRole={role} globalSearch={globalSearch} />} />
                  <Route path="/category/:category/:subcategory" element={<PatientList currentRole={role} />} />
                  
                  {/* Patient Records */}
                  <Route path="/patient/:id" element={<PatientProfile currentRole={role} />} />
                  <Route path="/patient/:id/edit" element={<PatientForm currentRole={role} />} />
                  <Route path="/new-patient" element={<PatientForm currentRole={role} />} />

                  {/* Other Cabinets */}
                  <Route path="/analytics" element={<MasterDashboard currentRole={role} />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/academy" element={<Academy />} />
                  
                  {/* Salon and Makeup bookings share the Salon layout */}
                  <Route path="/salon" element={<Salon serviceType="Salon" />} />
                  <Route path="/makeup" element={<Salon serviceType="Makeup" />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
