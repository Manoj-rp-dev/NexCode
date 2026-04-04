import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { api } from "../services/api";


const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setMessage({ type: '', text: '' });
    try {
      const result = await api.auth.participantLogin({
        username: data.username,
        password: data.password,
      });

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      
      if (result.role === "admin") {
        localStorage.setItem("AdminID", result.id);
        setMessage({ type: "success", text: "Root Access Granted" });
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1000);
      } else {
        localStorage.setItem("ParticipantsID", result.id);
        setMessage({ type: "success", text: result.message || "Login successful" });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Login failed" });
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center flex-col items-center relative bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500 overflow-hidden">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-violet-500/20 dark:bg-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-cyan-500/20 dark:bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="mb-8 z-10 cursor-pointer hover:scale-105 transition-transform duration-300">
        <Logo className="h-16 lg:h-20 drop-shadow-md" />
      </div>

      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="z-10 w-[90vw] max-w-md flex flex-col justify-center border border-slate-200 dark:border-white/10 rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl p-8 lg:p-10"
      >
        <div className="text-3xl text-center font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400">
          Participant Login
        </div>
        
        {message.text && (
          <div className={`mb-6 p-3 rounded-lg text-sm font-semibold text-center border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Username</label>
            <input
              className="w-full h-12 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-950/50 rounded-xl px-4 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-violet-500 dark:focus:border-fuchsia-500 focus:ring-1 focus:ring-violet-500 dark:focus:ring-fuchsia-500 transition-all shadow-inner"
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })} 
            />
            <p className="h-5 text-red-500 dark:text-red-400 text-xs font-medium mt-1 ml-1">
              {errors.username?.message}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <input
              className="w-full h-12 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-950/50 rounded-xl px-4 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-violet-500 dark:focus:border-fuchsia-500 focus:ring-1 focus:ring-violet-500 dark:focus:ring-fuchsia-500 transition-all shadow-inner"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })} 
            />
            <p className="h-5 text-red-500 dark:text-red-400 text-xs font-medium mt-1 ml-1">
              {errors.password?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white rounded-xl font-bold tracking-wide shadow-lg dark:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all transform active:scale-95 cursor-pointer">
            Login to Dashboard
          </button> 
        </div>

        <div className="flex justify-between items-center mt-6">
          <Link to="/pforgot-password" className="text-sm text-violet-600 dark:text-cyan-400 font-medium hover:underline">
            Forgot Password?
          </Link>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400 pb-2">
            Don&apos;t have an account?
            <Link to="/psignup" className="text-violet-600 dark:text-cyan-400 font-bold ml-1 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
