import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Lock, User, Info, AlertCircle } from "lucide-react";
import api from "../api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(username, password);
      if (res.success) {
        onLogin(res.user);
        navigate("/dashboard");
      } else {
        setError(res.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-cream-card rounded-3xl p-8 border border-rose-gold-light/20 shadow-md space-y-6">
        
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-rose-gold text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl tracking-wider text-teal-accent">
            FEMINA <span className="text-rose-gold font-light">SKIN CLINIC</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-charcoal-light font-medium">
            Management Portal
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-3.5 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1.5 font-semibold text-charcoal-light">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-rose-gold-dark" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin, doctor, receptionist"
                className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold rounded-xl py-3.5 pl-10 pr-4 focus:outline-none text-charcoal font-semibold text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-semibold text-charcoal-light">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-rose-gold-dark" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream-bg border border-rose-gold-light/20 focus:border-rose-gold rounded-xl py-3.5 pl-10 pr-4 focus:outline-none text-charcoal text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-accent hover:bg-teal-dark text-white font-bold py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.01] cursor-pointer text-sm"
          >
            {loading ? "Authenticating..." : "Enter Portal"}
          </button>
        </form>

        {/* Demo hints */}
        <div className="bg-cream-bg/60 border border-rose-gold-light/10 p-4 rounded-2xl text-[11px] leading-relaxed text-charcoal-light">
          <div className="flex gap-1.5 items-start">
            <Info className="h-4 w-4 text-rose-gold flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-teal-accent">Login Credentials:</p>
              <p>• <strong>Main Admin:</strong> famina / famina9656</p>
              <p>• <strong>Doctor:</strong> doctor / doctorpassword123</p>
              <p>• <strong>Receptionist:</strong> receptionist / receppassword123</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
