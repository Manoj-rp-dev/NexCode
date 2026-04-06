import React, { useState } from 'react'
import { Bookmark, Globe, Calendar, Zap } from 'lucide-react'
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
    e.preventDefault();
    e.stopPropagation();
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='bg-white dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-violet-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:-translate-y-2 w-full sm:w-[350px] min-h-[460px] relative overflow-hidden'
    >
      {/* Premium Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-violet-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-violet-500/10 transition-colors"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-fuchsia-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-fuchsia-500/10 transition-colors"></div>

      {/* Top Actions: Bookmark & Website */}
      <div className="absolute top-6 right-6 flex gap-2.5 z-20">
        {props.websiteLink && (
          <button 
            onClick={openWebsite}
            className="w-9 h-9 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 shadow-sm hover:scale-110 active:scale-90"
          >
            <Globe size={16} strokeWidth={2.5} />
          </button>
        )}
        <button 
          onClick={toggleSave}
          className={`w-9 h-9 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-90 ${
            isSaved 
              ? 'text-violet-600 dark:text-fuchsia-400 shadow-inner border-violet-500/30' 
              : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-400'
          }`}>
          <Bookmark size={16} strokeWidth={isSaved ? 2 : 2.5} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div className="relative z-10">
        {/* Logo & Tags Row */}
        <div className="flex items-start justify-between mb-8">
           {/* Branding Logo */}
           <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 p-2 shadow-inner group-hover:border-violet-500/30 transition-colors overflow-hidden flex items-center justify-center">
             <img 
               src={props.logo || `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(props.company || 'Host')}`} 
               alt={props.company} 
               className="w-full h-full object-contain"
             />
           </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {props.mode && (
            <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest border border-violet-200/50 dark:border-violet-500/20">
              {props.mode}
            </span>
          )}
          {props.type && (
            <span className="px-3 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-black uppercase tracking-widest border border-fuchsia-200/50 dark:border-fuchsia-500/20">
              {props.type}
            </span>
          )}
          {props.tags && props.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest border border-cyan-200/50 dark:border-cyan-500/20">
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Host */}
        <h3 className="text-2xl font-black mb-1 text-slate-900 dark:text-white leading-tight tracking-tight group-hover:text-violet-600 dark:group-hover:text-fuchsia-400 transition-colors">
          {props.title || "Global AI Hackathon 2026"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-8 flex items-center gap-2">
          by <span className="text-slate-800 dark:text-slate-200">{props.company || "NexCode Host"}</span>
        </p>
        
        {/* Info Rows */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center border border-violet-100 dark:border-violet-500/20">
              <Calendar size={18} className="text-violet-500" />
            </div>
            <span className="text-sm font-bold tracking-tight">{formatDate(props.eventDate || props.time)}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-100 dark:border-fuchsia-500/20">
              <Zap size={18} className="text-fuchsia-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-black text-slate-900 dark:text-white">{props.duration || "No Prize"}</span>
               {props.subtitle && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{props.subtitle}</span>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <button 
        onClick={props.onApply}
        disabled={props.disabled}
        className={`w-full py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
        props.disabled 
          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default shadow-none' 
          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-violet-600 dark:hover:bg-violet-500 hover:text-white dark:hover:text-white hover:shadow-violet-500/20 active:translate-y-0.5'
      }`}>
        {props.actionText || "View Details"}
      </button>
    </motion.div>
  )
}

export default Card
