import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Menu, X, User, Calendar, BookOpen, Sparkles, Scissors, 
  Landmark, Shield, LogOut, RefreshCw, MapPin, Phone, 
  Activity, Search, Plus
} from "lucide-react";
import api, { checkBackendStatus } from "../api";

export default function Layout({ children, currentRole, onChangeRole, globalSearch, setGlobalSearch, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(api.isBackendOnline());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    checkBackendStatus().then(status => {
      if (mounted) setIsBackendOnline(status);
    });
    const timer = setInterval(async () => {
      const status = await checkBackendStatus();
      if (mounted) setIsBackendOnline(status);
    }, 10000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Sparkles, roles: ["admin", "doctor", "receptionist"] },
    { name: "Analytics Dashboard", path: "/analytics", icon: Landmark, roles: ["admin"] },
    { name: "Appointments & Calendar", path: "/appointments", icon: Calendar, roles: ["admin", "receptionist"] },
    { name: "Academy Admissions", path: "/academy", icon: BookOpen, roles: ["admin", "receptionist"] },
    { name: "Salon Services", path: "/salon", icon: Scissors, roles: ["admin", "receptionist"] },
    { name: "Makeup Services", path: "/makeup", icon: Sparkles, roles: ["admin", "receptionist"] },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      api.logout();
      navigate("/login");
    }
  };

  const [reconnecting, setReconnecting] = useState(false);

  const handleReconnect = async () => {
    setReconnecting(true);
    const status = await checkBackendStatus();
    setIsBackendOnline(status);
    setReconnecting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-bg text-charcoal">
      {/* Offline Alert Banner */}
      {!isBackendOnline && (
        <div className="bg-amber-100 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${reconnecting ? 'bg-blue-500 animate-ping' : 'bg-amber-500'}`}></span>
            <span>
              <strong>{reconnecting ? 'Connecting...' : 'Cloud Server Sleeping:'}</strong>{' '}
              {reconnecting
                ? 'Waking up Render backend and syncing with Supabase (takes ~15-20s)...'
                : 'Server is in eco sleep mode. Click Reconnect to wake it up or continue in offline mode.'}
            </span>
          </div>
          <button 
            onClick={handleReconnect}
            disabled={reconnecting}
            className="flex items-center gap-1.5 bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-lg text-amber-900 font-semibold cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${reconnecting ? 'animate-spin' : ''}`} />
            {reconnecting ? 'Waking Server...' : 'Wake & Reconnect'}
          </button>
        </div>
      )}

      {/* Main Premium Clinic Header */}
      <header className="bg-cream-card border-b border-rose-gold-light/20 px-4 py-3 md:px-6 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Clinic Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 md:hidden hover:bg-cream-bg rounded-lg"
              >
                <Menu className="h-6 w-6 text-rose-gold" />
              </button>
              <Link to="/dashboard" className="flex flex-col">
                <span className="font-heading font-bold text-lg md:text-xl tracking-wider text-teal-accent flex items-center gap-1.5">
                  FEMINA <span className="text-rose-gold font-light">SKIN CLINIC</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-charcoal-light font-medium">
                  Skin • Hair • Laser • Aesthetic • Trichology
                </span>
              </Link>
            </div>
            
            {/* Info on mobile */}
            <div className="md:hidden text-right text-[10px] text-charcoal-light">
              <p className="flex items-center justify-end gap-1"><MapPin className="h-2.5 w-2.5" /> Sillod</p>
              <p className="flex items-center justify-end gap-1"><Phone className="h-2.5 w-2.5" /> 9921719656</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-auto w-full relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-rose-gold" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name, phone, ID..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (location.pathname !== "/dashboard") {
                  navigate("/dashboard"); // Redirect to dashboard search
                }
              }}
              className="w-full bg-cream-bg border border-rose-gold-light/30 focus:border-rose-gold rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Quick Info & Demo Role Toggler */}
          <div className="flex items-center justify-end gap-4">
            <div className="hidden lg:flex flex-col text-right text-xs text-charcoal-light border-r border-rose-gold-light/20 pr-4">
              <p className="flex items-center gap-1 font-medium"><MapPin className="h-3 w-3 text-rose-gold" /> Sahara City, Sillod, Aurangabad</p>
              <p className="flex items-center gap-1 font-medium justify-end"><Phone className="h-3 w-3 text-rose-gold" /> +91 9921719656</p>
            </div>

            {/* Quick Demo Role Changer */}
            <div className="flex items-center gap-2 bg-cream-bg/80 border border-rose-gold-light/20 rounded-full px-3 py-1 text-xs">
              <Shield className="h-3.5 w-3.5 text-rose-gold" />
              <span className="font-medium">Role:</span>
              <select 
                value={currentRole} 
                onChange={(e) => onChangeRole(e.target.value)}
                className="bg-transparent font-semibold text-teal-accent focus:outline-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex relative">
        {/* Sidebar Nav */}
        <aside 
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-cream-card border-r border-rose-gold-light/10 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none no-print
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Sidebar Top on Mobile */}
          <div className="p-4 border-b border-rose-gold-light/10 flex items-center justify-between md:hidden bg-teal-accent text-white">
            <span className="font-bold tracking-wider">NAVIGATE</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-teal-dark rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems
              .filter(item => item.roles.includes(currentRole))
              .map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200
                      ${isActive 
                        ? "bg-rose-gold text-white shadow-md shadow-rose-gold/20 translate-x-1" 
                        : "text-charcoal hover:bg-cream-bg hover:text-teal-accent hover:translate-x-1"}
                    `}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-rose-gold"}`} />
                    {item.name}
                  </Link>
                );
              })}
          </nav>

          {/* Quick Action Button */}
          <div className="p-4 absolute bottom-4 left-0 right-0">
            <Link
              to="/new-patient"
              className="w-full flex items-center justify-center gap-2 bg-teal-accent hover:bg-teal-dark text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>New Patient</span>
            </Link>
          </div>
        </aside>

        {/* Sidebar Backdrop (Mobile) */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden"
          ></div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
