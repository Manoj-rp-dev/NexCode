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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='bg-[#0f172a] dark:bg-[#0f172a] p-10 rounded-[3rem] border border-slate-800 transition-all duration-300 flex flex-col justify-between w-full sm:w-[380px] min-h-[440px] relative group hover:border-violet-500/30'
    >
      {/* Top Actions: Bookmark & Website (Subtle) */}
      <div className="absolute top-8 right-8 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {props.websiteLink && (
          <button 
            onClick={openWebsite}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition text-slate-500 hover:text-cyan-400"
          >
            <Globe size={16} />
          </button>
        )}
        <button 
          onClick={toggleSave}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition ${
            isSaved ? 'text-violet-500' : 'text-slate-500 hover:text-violet-500'
          }`}>
          <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Tags Row */}
        <div className="flex flex-wrap gap-3">
          {(props.tags || [props.mode, props.type]).filter(Boolean).map((tag, idx) => (
            <span key={idx} className="px-5 py-2 rounded-full bg-slate-900/50 text-violet-400 text-xs font-black uppercase tracking-widest border border-slate-800">
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Host */}
        <div className='space-y-2'>
          <h3 className="text-3xl font-black text-white leading-tight tracking-tight">
            {props.title || "AI Revolution 2026"}
          </h3>
          <p className="text-slate-400 text-lg font-medium">
            by {props.company || "TechForward"}
          </p>
        </div>
        
        {/* Info Rows */}
        <div className="space-y-5">
          <div className="flex items-center gap-4 text-white">
            <Calendar size={22} className="text-violet-500" />
            <span className="text-lg font-bold tracking-tight">{formatDate(props.eventDate || props.time)}</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            <Zap size={22} className="text-violet-500" />
            <span className="text-lg font-black tracking-tight">
              {props.duration || "$50,000"} 
              <span className="font-medium text-slate-400 ml-2">{props.subtitle || "prize pool"}</span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className='mt-10'>
        <button 
          onClick={props.onApply}
          disabled={props.disabled}
          className={`w-full py-5 rounded-3xl font-black text-lg transition-all cursor-pointer border shadow-2xl ${
          props.disabled 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default' 
            : 'bg-transparent border-slate-800 text-white hover:bg-slate-900 hover:border-violet-500/50 active:scale-[0.98]'
        }`}>
          {props.actionText || "View Details"}
        </button>
      </div>
    </motion.div>
  )
}

export default Card
