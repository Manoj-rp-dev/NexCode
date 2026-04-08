import React, { useState } from 'react'
import { Bookmark, Globe, Calendar, Zap, Info } from 'lucide-react'
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
      className='bg-white/80 dark:bg-slate-800/40 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] border border-slate-200/60 dark:border-white/20 transition-all duration-300 flex flex-col justify-between w-full sm:w-[380px] min-h-[460px] relative group hover:border-violet-600/50 shadow-xl dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] dark:hover:shadow-violet-600/10 overflow-hidden'
    >
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-violet-600/5 dark:bg-violet-600/15 blur-[50px] rounded-full pointer-events-none group-hover:bg-violet-600/10 dark:group-hover:bg-violet-600/25 transition-colors"></div>

      {/* Top Actions Symbols */}
      <div className="absolute top-8 right-8 flex gap-3 z-30 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
        {props.websiteLink && (
          <button 
            onClick={openWebsite}
            title="Visit Website"
            className="w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)] shadow-lg"
          >
            <Globe size={18} strokeWidth={2.5} />
          </button>
        )}
        <button 
          onClick={toggleSave}
          title={isSaved ? "Unsave" : "Save"}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg ${
            isSaved ? 'text-violet-500 border-violet-500/30 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]' : 'text-slate-400 dark:text-slate-500 hover:text-violet-500 hover:border-violet-500/30'
          }`}>
          <Bookmark size={18} strokeWidth={isSaved ? 2 : 2.5} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Tags Row */}
        <div className="flex flex-wrap gap-2.5">
          {(props.tags || [props.mode, props.type]).filter(Boolean).map((tag, idx) => (
            <span key={idx} className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/80 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800/50 scale-95 origin-left">
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Host */}
        <div className='grow space-y-1.5'>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {props.title || "AI Revolution 2026"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-base font-bold flex items-center gap-2">
            by <span className="text-slate-700 dark:text-slate-200">{props.company || "TechForward"}</span>
          </p>
        </div>
        
        {/* Info Rows */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner">
              <Calendar size={18} className="text-violet-500" />
            </div>
            <span className="text-base font-bold tracking-tight">{formatDate(props.eventDate || props.time)}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner">
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
      <div className='mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex flex-col gap-3'>
        <div className='flex gap-4'>
          <button 
            onClick={props.onViewDetails}
            className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 hover:text-slate-950 dark:hover:text-white hover:border-violet-500/40 flex items-center justify-center gap-2 group/btn whitespace-nowrap"
          >
            <Info size={14} className="text-violet-500 opacity-60 group-hover/btn:opacity-100 transition-opacity flex-shrink-0" /> View Details
          </button>
          
          <button 
            onClick={props.onApply}
            disabled={props.disabled}
            className={`flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border shadow-lg ${
            props.disabled 
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 cursor-default shadow-none translate-y-0 opacity-80' 
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white dark:hover:text-white active:scale-[0.98] hover:-translate-y-1'
          }`}>
            {props.disabled ? "Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Card
