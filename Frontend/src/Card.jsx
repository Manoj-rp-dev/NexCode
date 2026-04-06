import React, { useState } from 'react'
import { Bookmark, Globe, Calendar, Zap, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Card = (props) => {
  const hId = props.hackathonId || props.hackathonID;
  const storageKey = hId ? `saved_hackathon_${hId}` : null;
  const [isSaved, setIsSaved] = useState(() => {
    if (!storageKey) return false;
    return localStorage.getItem(storageKey) === 'true';
  });

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    if (storageKey) localStorage.setItem(storageKey, String(next));
    window.dispatchEvent(new Event('savedHackathonsChanged'));
  };

  const openWebsite = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (props.websiteLink) {
      window.open(props.websiteLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "UPCOMING" || dateStr === "ENDED") return dateStr || "Date TBD";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='bg-[#0f172a] p-8 md:p-10 rounded-[3rem] border border-slate-800 transition-all duration-300 flex flex-col justify-between w-full sm:w-[380px] min-h-[460px] relative group hover:border-violet-500/30 shadow-2xl overflow-hidden'
    >
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-violet-600/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-violet-600/10 transition-colors"></div>

      {/* Top Actions (Hover only) */}
      <div className="absolute top-8 right-8 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={toggleSave}
          className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition bg-slate-900/80 border border-slate-800 ${
            isSaved ? 'text-violet-500' : 'text-slate-500 hover:text-violet-500'
          }`}>
          <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tags Row */}
        <div className="flex flex-wrap gap-2.5">
          {(props.tags || [props.mode, props.type]).filter(Boolean).map((tag, idx) => (
            <span key={idx} className="px-4 py-1.5 rounded-full bg-slate-900/80 text-violet-400 text-[10px] font-black uppercase tracking-widest border border-slate-800/50 scale-95 origin-left">
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Host */}
        <div className='space-y-1.5'>
          <h3 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight group-hover:text-violet-400 transition-colors">
            {props.title || "AI Revolution 2026"}
          </h3>
          <p className="text-slate-400 text-base font-bold flex items-center gap-2">
            by <span className="text-slate-200">{props.company || "TechForward"}</span>
          </p>
        </div>
        
        {/* Info Rows */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
              <Calendar size={18} className="text-violet-500" />
            </div>
            <span className="text-base font-bold tracking-tight">{formatDate(props.eventDate || props.time)}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
              <Zap size={18} className="text-fuchsia-500" />
            </div>
            <div className='flex flex-col'>
              <span className="text-base font-black tracking-tight">{props.duration || "$50,000"}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{props.subtitle || "prize pool"}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dual Action Buttons */}
      <div className='mt-8 pt-6 border-t border-slate-800/50 flex flex-col gap-3'>
        <div className='flex gap-3'>
          <button 
            onClick={openWebsite}
            className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white hover:border-violet-500/40 flex items-center justify-center gap-2"
          >
            View Details <ArrowUpRight size={14} className="opacity-60" />
          </button>
          
          <button 
            onClick={props.onApply}
            disabled={props.disabled}
            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border shadow-lg ${
            props.disabled 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default shadow-none' 
              : 'bg-white text-slate-950 border-white hover:bg-violet-600 hover:text-white hover:border-violet-500 active:scale-[0.98]'
          }`}>
            {props.disabled ? "Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Card
