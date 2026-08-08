import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  DollarSign, Users, Calendar, AlertTriangle, Download, 
  ChevronRight, ArrowUpRight, TrendingUp, AlertCircle, RefreshCw,
  Clock, CheckCircle, HelpCircle
} from "lucide-react";
import api from "../api";

export default function MasterDashboard({ currentRole }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Date filter states (default current month)
  const today = new Date().toISOString().split("T")[0];
  const startOfMonth = new Date(new Date().setDate(1)).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(startOfMonth);
  const [endDate, setEndDate] = useState(today);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics(startDate, endDate);
      setData(res);
    } catch (err) {
      console.error("Error loading analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [startDate, endDate]);

  const COLORS = ["#134e4a", "#C5A08A", "#6366f1", "#a855f7", "#ec4899", "#0ea5e9"];

  // Mock Export function
  const handleExport = (type) => {
    alert(`Success: Downloaded Femina ${type} report (${startDate} to ${endDate}) as Excel/CSV format.`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Clock className="h-8 w-8 text-rose-gold animate-spin mx-auto mb-2" />
        <p className="text-xs text-charcoal-light">Reading clinic cash book & schedules...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-xs text-charcoal-light">Unable to load analytics. Please check connection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top title and filters bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold font-heading text-teal-accent">Master Business Control</h2>
          <p className="text-xs text-charcoal-light">Real-time revenue tracking, dues collections, and patient retention metrics.</p>
        </div>

        {/* Date Filters & Download logs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-cream-card border border-rose-gold-light/25 p-1.5 rounded-xl text-xs">
            <span className="text-charcoal-light font-medium pl-1">Range:</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="bg-transparent font-semibold focus:outline-none"
            />
            <span className="text-charcoal-light">to</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="bg-transparent font-semibold focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleExport("Revenue")}
              className="flex items-center gap-1.5 bg-cream-card border border-rose-gold-light/20 hover:border-rose-gold text-rose-gold font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer"
            >
              <Download className="h-4 w-4" /> Export Excel
            </button>
            <button 
              onClick={loadAnalytics}
              className="p-2 bg-cream-card border border-rose-gold-light/20 hover:border-rose-gold text-rose-gold rounded-xl cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total revenue */}
        <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">Total Revenue</span>
            <div className="p-1.5 bg-teal-50 text-teal-800 rounded-lg"><DollarSign className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-heading text-teal-accent">
              ₹{data.revenue.total_revenue.toLocaleString('en-IN')}
            </h3>
            <p className="text-[10px] text-charcoal-light mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="h-3 w-3 text-teal-600" /> Filtered range collection
            </p>
          </div>
        </div>

        {/* Total Outstanding Dues */}
        <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">Pending Dues</span>
            <div className="p-1.5 bg-red-50 text-red-800 rounded-lg"><AlertTriangle className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-heading text-red-500">
              ₹{data.revenue.total_outstanding_dues.toLocaleString('en-IN')}
            </h3>
            <p className="text-[10px] text-red-600 mt-1 font-bold">
              Outstanding package balances
            </p>
          </div>
        </div>

        {/* Total Patients */}
        <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">Total Patients</span>
            <div className="p-1.5 bg-sky-50 text-sky-800 rounded-lg"><Users className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-heading text-teal-accent">
              {data.patients.total_patients}
            </h3>
            <p className="text-[10px] text-charcoal-light mt-1 font-semibold">
              +{data.patients.new_patients_this_month} registered this month
            </p>
          </div>
        </div>

        {/* Sessions remaining */}
        <div className="bg-cream-card rounded-2xl p-5 border border-rose-gold-light/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-gold uppercase tracking-wider">Unfinished Packages</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-800 rounded-lg"><Clock className="h-4 w-4" /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-heading text-teal-accent">
              {data.patients.sessions_remaining} Patients
            </h3>
            <p className="text-[10px] text-charcoal-light mt-1 font-semibold">
              Have remaining visit sessions
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Revenue Breakdown */}
        <div className="lg:col-span-2 bg-cream-card border border-rose-gold-light/10 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="font-heading font-bold text-md text-teal-accent mb-4">Revenue Breakdown by Department</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenue.dept_revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Collection"]} contentStyle={{ borderRadius: "12px", border: "1px solid #ddd" }} />
                <Bar dataKey="value" fill="#C5A08A" radius={[8, 8, 0, 0]}>
                  {data.revenue.dept_revenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment mode split */}
        <div className="lg:col-span-1 bg-cream-card border border-rose-gold-light/10 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="font-heading font-bold text-md text-teal-accent mb-4">Payment Methods</h3>
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenue.payment_mode_split}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.revenue.payment_mode_split.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-[10px] uppercase font-bold text-charcoal-light">Total Range</span>
              <span className="text-md font-extrabold text-teal-accent">₹{data.revenue.total_revenue.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Custom Legends list */}
          <div className="space-y-1.5 text-xs pt-4 border-t border-rose-gold-light/10">
            {data.revenue.payment_mode_split.map((entry, idx) => (
              <div key={entry.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-charcoal">{entry.name}</span>
                </div>
                <span className="font-bold">₹{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient demographics & Top Treatment earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Earnings by Treatment subcategory */}
        <div className="lg:col-span-2 bg-cream-card border border-rose-gold-light/10 rounded-3xl p-5 shadow-xs">
          <h3 className="font-heading font-bold text-md text-teal-accent mb-4">Top Treatment Earnings</h3>
          {data.revenue.treatment_revenue.length === 0 ? (
            <p className="text-xs text-charcoal-light py-8 text-center">No laser or hair treatments recorded in this range.</p>
          ) : (
            <div className="space-y-3.5 text-xs">
              {data.revenue.treatment_revenue.map((t, idx) => {
                const maxVal = Math.max(...data.revenue.treatment_revenue.map(x => x.value)) || 1;
                const percentage = (t.value / maxVal) * 100;
                return (
                  <div key={t.name} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-charcoal font-bold">{idx + 1}. {t.name}</span>
                      <span className="text-rose-gold font-bold">₹{t.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-cream-bg rounded-full h-2">
                      <div className="bg-teal-accent h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Patient Retention / Type Split */}
        <div className="lg:col-span-1 bg-cream-card border border-rose-gold-light/10 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="font-heading font-bold text-md text-teal-accent mb-4">Patient Retention Profile</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.patients.patient_type_split}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#134e4a" />
                  <Cell fill="#C5A08A" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-cream-bg/40 border border-rose-gold-light/10 p-3 rounded-2xl text-[11px] leading-relaxed text-charcoal-light">
            <strong>Analytic Tip:</strong> A high proportion of "Repeat Patients" indicates strong clinical trust. Use target follow-up reminders for one-time patients to schedule their second laser sessions.
          </div>
        </div>
      </div>
    </div>
  );
}
