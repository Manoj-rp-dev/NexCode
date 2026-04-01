import React, { useState, useEffect } from 'react'
import { Bookmark, Globe } from 'lucide-react'

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
    // Notify other components (like Profile) to re-check saved hackathons
    window.dispatchEvent(new Event('savedHackathonsChanged'));
  };

  const openWebsite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.websiteLink) {
      window.open(props.websiteLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className='flex justify-center group'>
      <div className='w-full sm:w-[320px] h-[26rem] hover:-translate-y-2 transform transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 rounded-[2rem] border border-slate-200 dark:border-white/10 hover:border-violet-500/50 dark:hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/20 shadow-xl flex flex-col justify-between overflow-hidden relative'>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className='w-full h-20 flex items-center justify-between px-6 pt-6 relative z-10'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-950/50 flex items-center justify-center font-bold text-fuchsia-600 dark:text-fuchsia-400 shadow-inner border border-slate-200 dark:border-white/5'>
              {props.logo ? (
                <img 
                  className='w-full h-full rounded-2xl object-cover' 
                  src={props.logo} 
                  alt={props.company || "Logo"} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(props.company || "Hackathon")}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
                  }}
                />
              ) : 'Logo'}
            </div>

            <div className='leading-tight'>
              <p className='font-bold text-base line-clamp-1 max-w-[120px]'>{props.company || "Google"}</p>
              <p className='text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider'>{props.time || "2 hrs ago"}</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {props.websiteLink && (
              <button 
                onClick={openWebsite}
                title="Visit Website"
                className="w-8 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center cursor-pointer transition text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm"
              >
                <Globe size={16} strokeWidth={2.5} />
              </button>
            )}

            <button 
              onClick={toggleSave}
              className={`w-8 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center cursor-pointer transition ${
                isSaved 
                  ? 'text-violet-600 dark:text-fuchsia-400 shadow-inner' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-fuchsia-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}>
              <Bookmark size={16} strokeWidth={isSaved ? 2 : 2.5} className={isSaved ? "fill-current" : ""} />
            </button>
          </div>
        </div>
        
        <div className='w-full flex-grow flex items-start px-6 pt-6 relative z-10'>
          <h2 className='text-xl lg:text-2xl font-black leading-snug tracking-tight bg-clip-text'>
            {props.title || "Global AI Hackathon 2026"}
          </h2>
        </div>
        
        <div className='w-full flex flex-wrap gap-2 px-6 pb-6 relative z-10'>
          <div className='px-4 py-2 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 rounded-xl flex items-center justify-center text-xs font-bold border border-violet-100 dark:border-violet-500/20'>
            {props.mode || "Online"}
          </div>
          <div className='px-4 py-2 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 rounded-xl flex items-center justify-center text-xs font-bold border border-cyan-100 dark:border-cyan-500/20'>
            {props.type || "AI/ML Focus"}
          </div>
          {props.participationType && (
            <div className='px-4 py-2 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 rounded-xl flex items-center justify-center text-xs font-bold border border-fuchsia-100 dark:border-fuchsia-500/20'>
              {props.participationType}
            </div>
          )}
        </div>

        <div className='w-full h-px bg-slate-200 dark:bg-white/10 relative z-10' />
        
        <div className='w-full h-24 flex items-center justify-between px-6 bg-slate-50/50 dark:bg-slate-950/50 relative z-10'>
          <div>
            <p className='text-lg font-black'>{props.duration || "$50k Pool"}</p>
            <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1'>{props.subtitle || "Prize Money"}</p>
          </div>

          <button 
            onClick={props.onApply} 
            disabled={props.disabled}
            className={`px-6 py-3 rounded-xl shadow-lg transition-all text-white font-bold tracking-wide ${
              props.disabled 
                ? 'bg-emerald-500 dark:bg-emerald-600 cursor-default opacity-90' 
                : 'bg-slate-900 dark:bg-violet-600 hover:bg-slate-800 dark:hover:bg-violet-500 cursor-pointer active:scale-95 dark:shadow-violet-600/30'
            }`}
          >
            {props.actionText || "Apply"}
          </button>
        </div>

      </div>
    </div>
  )
}
export default Card
