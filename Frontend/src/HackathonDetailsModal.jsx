import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoCalendarOutline, IoLocationOutline, IoPeopleOutline, IoTrophyOutline, IoGlobeOutline } from "react-icons/io5";
import { getLogoSrc } from "./utils/imageUtils";

const HackathonDetailsModal = ({ hackathon, onClose, onApply }) => {
  if (!hackathon) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] relative"
        >
          {/* Header Image Area */}
          <div className="h-40 bg-linear-to-br from-violet-600 to-fuchsia-600 relative overflow-hidden flex items-center justify-center">
            {/* Visual background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-80 h-80 bg-white/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-50%] right-[-20%] w-80 h-80 bg-white/30 rounded-full blur-[100px]"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2 uppercase tracking-tighter drop-shadow-md">
                   {hackathon.hackathonName}
                </h3>
                <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black uppercase tracking-widest leading-none">
                    {hackathon.hackathonType || "Online Event"}
                </div>
            </div>

            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all z-20"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Scrollable Content Container */}
          <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5">
                  <IoCalendarOutline size={20} className="text-violet-600 dark:text-violet-400 mb-2" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{new Date(hackathon.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5">
                  <IoLocationOutline size={20} className="text-fuchsia-600 dark:text-fuchsia-400 mb-2" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mode</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{hackathon.mode || "Global"}</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5">
                  <IoPeopleOutline size={20} className="text-cyan-600 dark:text-cyan-400 mb-2" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Size</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{hackathon.teamSize || "Any"}</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5">
                  <IoTrophyOutline size={20} className="text-amber-500 mb-2" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prize</span>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{hackathon.prizePool ? `$${Number(hackathon.prizePool).toLocaleString()}` : "TBD"}</span>
               </div>
            </div>

            {/* Description Section */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                 <div className="w-6 h-0.5 bg-violet-600/30 rounded-full"></div>
                 About the Hackathon
              </h4>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                {hackathon.hackathonDescription || 
                 `Join the ${hackathon.hackathonName} and showcase your technical skills on a global stage. This event brings together the brightest minds to solve real-world problems through innovation, collaboration, and high-quality software development. Build something extraordinary, win significant prizes, and network with leading industry experts.`}
              </p>
            </div>

            {/* Organizer & Official Link Info */}
            <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                     <img 
                        src={getLogoSrc(hackathon)} 
                        className="w-full h-full object-contain rounded-full" 
                        alt="Organizer" 
                     />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Organized by</span>
                     <span className="text-xl font-black text-white">{hackathon.organizationName || hackathon.hostName || "NexCode Host"}</span>
                  </div>
               </div>
               
               {hackathon.websiteLink && (
                  <a 
                    href={hackathon.websiteLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all group"
                  >
                    <IoGlobeOutline size={20} className="text-violet-400 group-hover:scale-110 transition-transform" />
                    Visit Website
                  </a>
               )}
            </div>
          </div>

          {/* Modal Bottom Footer */}
          <div className="px-8 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ready to join?</span>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
               <button 
                  onClick={onClose} 
                  className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl font-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
               <button 
                  onClick={() => {
                     onClose();
                     if (onApply) onApply(hackathon);
                  }}
                  className="flex-1 sm:flex-none px-10 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all"
                >
                  Apply Now
                </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HackathonDetailsModal;
