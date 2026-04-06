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
      className='bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 hover:border-violet-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:-translate-y-2 w-full sm:w-[350px] min-h-[420px] relative'
    >
      {/* Top Actions: Bookmark & Website */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
        {props.websiteLink && (
          <button 
            onClick={openWebsite}
            className="w-8 h-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center cursor-pointer transition text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 shadow-sm"
          >
            <Globe size={14} strokeWidth={2.5} />
          </button>
        )}
        <button 
          onClick={toggleSave}
          className={`w-8 h-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center cursor-pointer transition ${
            isSaved 
              ? 'text-violet-600 dark:text-fuchsia-400 shadow-inner' 
              : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-400'
          }`}>
          <Bookmark size={14} strokeWidth={isSaved ? 2 : 2.5} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      <div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {props.mode && (
            <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider border border-violet-200/50 dark:border-violet-500/20">
              {props.mode}
            </span>
          )}
          {props.type && (
            <span className="px-3 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-[10px] font-bold uppercase tracking-wider border border-fuchsia-200/50 dark:border-fuchsia-500/20">
              {props.type}
            </span>
          )}
          {props.tags && props.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider border border-cyan-200/50 dark:border-cyan-500/20">
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Host */}
        <h3 className="text-2xl font-extrabold mb-1 text-slate-900 dark:text-white leading-tight tracking-tight">
          {props.title || "Global AI Hackathon 2026"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-8">
          by {props.company || "NexCode Host"}
        </p>
        
        {/* Info Rows */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
              <Calendar size={16} className="text-violet-500" />
            </div>
            <span className="text-sm font-bold tracking-tight">{formatDate(props.eventDate || props.time)}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-500/10 flex items-center justify-center">
              <Zap size={16} className="text-fuchsia-500" />
            </div>
            <span className="text-sm font-black">{props.duration || "No Prize"} {props.subtitle && <span className="font-medium text-slate-500 ml-1">{props.subtitle}</span>}</span>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <button 
        onClick={props.onApply}
        disabled={props.disabled}
        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
        props.disabled 
          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default' 
          : 'bg-slate-900 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-white dark:text-slate-300 hover:bg-violet-600 dark:hover:bg-violet-600 hover:text-white hover:border-violet-500 active:scale-[0.98]'
      }`}>
        {props.actionText || "View Details"}
      </button>
    </motion.div>
  )
}

export default Card

