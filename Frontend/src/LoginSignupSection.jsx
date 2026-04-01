import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
const LoginSignupSection = (props) => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row relative bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-50 transition-colors duration-500">
      
      {/* Background Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-violet-500/20 dark:bg-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-cyan-500/20 dark:bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Home Button */}
      <div className="absolute left-6 top-6 z-50">
        <Link to="/">
          <div className="group flex items-center justify-center p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-md cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all hover:-translate-y-1">
            <GoHome size={28} className="text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-fuchsia-400 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex justify-center items-center p-8 lg:p-16 relative z-10 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-slate-950/30 backdrop-blur-sm">
        <div className="max-w-md w-full lg:h-[70vh] flex flex-col justify-between items-center text-center bg-white/70 dark:bg-slate-900/50 p-10 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-sm font-bold tracking-wide border border-violet-200 dark:border-violet-500/20">
              {props.t1}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
              {props.h2}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {props.c1}
            </p>
          </div>
          
          <div className="w-full mt-8">
            <Link to={props.rout1} className="w-full">
              <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 rounded-xl text-white font-bold text-lg shadow-lg dark:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all transform active:scale-95 group flex items-center justify-center gap-2 mt-4">
                {props.btn1}
              </button>
            </Link>
            
            <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-6"></div>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium pb-2">
              {props.bottomText}{" "}
              <Link to={props.rout3} className="text-violet-600 dark:text-fuchsia-400 font-bold ">
                {props.btn2}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex justify-center items-center p-8 lg:p-16 relative z-10 bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-md w-full lg:h-[70vh] flex flex-col justify-between items-center text-center bg-white/70 dark:bg-slate-900/50 p-10 rounded-3xl border border-white/40 dark:border-white/10 shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-sm font-bold tracking-wide border border-cyan-200 dark:border-cyan-500/20">
              {props.t2}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
              {props.h1}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {props.c2}
            </p>
          </div>
          
          <div className="w-full mt-8">
            <Link to={props.rout2} className="w-full">
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-xl text-white font-bold text-lg shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all transform active:scale-95 group flex items-center justify-center gap-2 mt-4">
                {props.btn1}
              </button>
            </Link>
            
            <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-6"></div>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium pb-2">
              {props.bottomText}{" "}
              <Link to={props.rout4} className="text-blue-600 dark:text-cyan-400 font-bold ">
                {props.btn2}
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginSignupSection;