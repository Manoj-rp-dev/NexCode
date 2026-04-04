import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { api } from "./services/api";

const ApplicationForm = ({ hackathon, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    degree: "",
    college: "",
    portfolio: "",
    motivation: "",
    teamMembers: []
  });

  const participantId = localStorage.getItem("ParticipantsID");
  const isTeam = hackathon?.participationType?.trim().toLowerCase() === "team";
  // The hackathon object might have `teamSize` property, parse as number
  const maxTeamSize = parseInt(hackathon?.teamSize || hackathon?.TeamSize || 1);

  useEffect(() => {
    if (!participantId) return;
    
    // Fetch pre-fill data
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await api.participant.getProfile(participantId);
        setFormData(prev => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          degree: data.qualification || "",
          college: data.college || "" // Now returned by the API
        }));
      } catch (error) {
        console.error("Failed to fetch profile pre-fill data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [participantId]);

  // Adjust team members array based on requirement
  useEffect(() => {
    if (isTeam && maxTeamSize > 1) {
      // we need (maxTeamSize - 1) inputs for partners
      const needed = maxTeamSize - 1;
      // Initialize with correct number of empty member objects
      setFormData(prev => ({ 
        ...prev, 
        teamMembers: Array(needed).fill(null).map(() => ({ name: "", email: "" })) 
      }));
    } else {
      setFormData(prev => ({ ...prev, teamMembers: [] }));
    }
  }, [isTeam, maxTeamSize]);

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!participantId) {
      toast.error("Please login to apply.");
      return;
    }

    if (!formData.college) {
      toast.error("Please provide your College Name.");
      return;
    }

    setSubmitting(true);

    const payload = {
      HackathonID: Number(hackathon.hackathonID || hackathon.hackathonId || hackathon.hostHackathonID || hackathon.id || 0),
      ParticipantsID: Number(participantId),
      CollegeName: formData.college,
      PortfolioUrl: formData.portfolio,
      Motivation: formData.motivation,
      TeamMembers: JSON.stringify(formData.teamMembers)
    };

    console.log("Submitting Application Payload:", payload);

    try {
      await api.hackathons.apply(payload);
      
      toast.success(
        <span>
          <b>Successfully applied!</b><br/>
          For more information, visit the <a 
            href={hackathon.websiteLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-violet-600 dark:text-cyan-400 hover:underline font-bold"
          >
            official website
          </a>.
        </span>,
        { duration: 6000 }
      );
      onClose();
    } catch (err) {
      toast.error(err.message || "Network error. Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Apply for Hackathon</h3>
              <p className="text-sm font-bold text-violet-600 dark:text-cyan-400 mt-1">{hackathon?.hackathonName}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <IoClose size={24} className="text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-40 font-semibold text-slate-500">Loading your profile...</div>
            ) : (
              <form id="application-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Member 1 (Your Details)</h4>
                  {isTeam && <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2 py-1 rounded">Team Lead</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase">Full Name</label>
                    <input type="text" readOnly value={formData.name} className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase">Email</label>
                    <input type="email" readOnly value={formData.email} className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase">Degree</label>
                    <input type="text" readOnly value={formData.degree} className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase">College Name</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={formData.college} 
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase">Github / Portfolio URL</label>
                    <input 
                      type="url" 
                      value={formData.portfolio} 
                      onChange={(e) => setFormData({...formData, portfolio: e.target.value})} 
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase">Why do you want to participate?</label>
                  <textarea 
                    value={formData.motivation} 
                    onChange={(e) => setFormData({...formData, motivation: e.target.value})} 
                    placeholder="Briefly explain what you hope to build or learn..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none custom-scrollbar" 
                  />
                </div>

                {isTeam && formData.teamMembers.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-8">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Additional Team Members</h4>
                      <span className="text-xs font-bold bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 px-3 py-1 rounded-lg">Total Team Size: {maxTeamSize}</span>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.teamMembers.map((member, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Member {idx + 2} Name</label>
                            <input 
                              type="text" 
                              required 
                              value={member.name}
                              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                              placeholder={`Name`}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm" 
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Member {idx + 2} Email</label>
                            <input 
                              type="email" 
                              required
                              value={member.email}
                              onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                              placeholder={`Email address`}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Footer Footer */}
          <div className="px-8 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose} 
              className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="application-form"
              disabled={submitting}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                submitting 
                  ? 'bg-violet-400 dark:bg-violet-800 cursor-not-allowed' 
                  : 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400 dark:shadow-violet-600/30'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplicationForm;
