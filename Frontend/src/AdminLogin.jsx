import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, Lock, User, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Forparticipants/Logo';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7109/api/ParticipantsLoginCheck/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (res.ok && result.role === 'admin') {
        localStorage.setItem("token", result.token);
        localStorage.setItem("AdminID", result.id);
        localStorage.setItem("role", "admin");
        toast.success("Welcome back, Administrator");
        navigate("/admin-dashboard");
      } else if (res.ok && result.role !== 'admin') {
        toast.error("Access Denied: This portal is for Administrators only.");
      } else {
        toast.error(result.message || "Invalid Admin credentials");
      }
    } catch (err) {
      toast.error("Network connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="flex justify-center mb-8">
           <Logo />
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 transition-opacity group-hover:opacity-40">
            <Shield size={60} className="text-violet-400" />
          </div>

          <div className="mb-10 relative">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Admin Portal</h2>
            <p className="text-slate-400 font-medium">Restricted access for system administrators only.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  {...register("Username", { required: "Username is required" })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                  placeholder="Enter admin username"
                />
              </div>
              {errors.Username && <p className="text-red-400 text-xs font-bold ml-1">{errors.Username.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  {...register("Password", { required: "Password is required" })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                  placeholder="Enter admin password"
                />
              </div>
              {errors.Password && <p className="text-red-400 text-xs font-bold ml-1">{errors.Password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-violet-600/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? "Authenticating..." : (
                <>
                  Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex justify-center">
            <Link to="/" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
                <Home size={16} /> Back to Website
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
