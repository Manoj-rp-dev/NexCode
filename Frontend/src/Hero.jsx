import React, { useState, useEffect } from 'react';
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import Card from './Card';
import Footer from "./Footer";
import ApplicationForm from './ApplicationForm';
import { Sparkles, Trophy, Rocket, Globe, Zap, Search, LayoutGrid, List } from 'lucide-react';
import { api } from "./services/api";
import { getUserId } from "./utils/auth";

const Hero = () => {
  const [hackathons, setHackathons] = useState([]);
  const [appliedIds, setAppliedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAppliedOnly, setShowAppliedOnly] = useState(false);

  const [modeFilter, setModeFilter] = useState('Mode');
  const [teamSizeFilter, setTeamSizeFilter] = useState('Team Size');
  const [prizeFilter, setPrizeFilter] = useState('Prize Pool');
  const [activeCheckboxes, setActiveCheckboxes] = useState([]);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const data = await api.hackathons.getAll();
        setHackathons(data);
      } catch (err) {
        setError('Failed to fetch hackathons.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAppliedIds = async () => {
      const id = getUserId();
      if (!id) return;
      try {
        const data = await api.participant.getAppliedHackathons(id);
        const ids = data.map(h => Number(h.hackathonId || h.hackathonID || h.HostHackathonID));
        setAppliedIds(ids);
      } catch (err) {
        console.error('Failed to fetch applied IDs', err);
      }
    };

    fetchHackathons();
    fetchAppliedIds();
  }, []);

  const toggleCheckbox = (item) => {
    setActiveCheckboxes(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const filteredHackathons = hackathons.filter(h => {
    const matchesSearch = h.hackathonName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.organizationName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === 'Mode' || h.mode === modeFilter;
    const matchesTeamSize = teamSizeFilter === 'Team Size' || h.participationType === teamSizeFilter;
    
    let matchesPrize = true;
    if (prizeFilter === 'Low') matchesPrize = h.prizePool < 10000;
    if (prizeFilter === 'Medium') matchesPrize = h.prizePool >= 10000 && h.prizePool <= 50000;
    if (prizeFilter === 'High') matchesPrize = h.prizePool > 50000;

    let matchesCheckboxes = true;
    if (activeCheckboxes.includes('Online') && !activeCheckboxes.includes('Offline')) {
        if (h.mode !== 'Online') matchesCheckboxes = false;
    } else if (activeCheckboxes.includes('Offline') && !activeCheckboxes.includes('Online')) {
        if (h.mode !== 'Offline') matchesCheckboxes = false;
    }

    if (activeCheckboxes.includes('Upcoming') && new Date(h.eventDate) <= new Date()) {
        matchesCheckboxes = false;
    }

    return matchesSearch && matchesMode && matchesTeamSize && matchesPrize && matchesCheckboxes;
  });

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-slate-950 pt-5 text-slate-900 dark:text-slate-50 transition-colors duration-500 font-sans pb-10 relative overflow-hidden'>
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-500/10 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-fuchsia-500/10 dark:bg-violet-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
            
            <Navbar />
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='w-[90vw] min-h-[45vh] lg:h-[45vh] mt-10 md:mt-20 flex flex-col justify-center items-center mx-auto text-center z-10'
            >
                <div className="mb-6 px-5 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.2)] flex items-center justify-center gap-2 mx-auto w-fit transition-transform hover:scale-105 duration-300 cursor-default whitespace-nowrap">
                  <Globe size={18} className="text-fuchsia-500" strokeWidth={2.5} /> <span>Join 10K+ Hackers</span>
                </div>
                <h2 className='text-6xl lg:text-8xl font-extrabold tracking-tighter bg-linear-to-r from-fuchsia-600 via-violet-600 to-cyan-500 dark:from-fuchsia-400 dark:via-violet-500 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-sm mb-6'>
                    Find Your Next Hackathon
                </h2>
                <p className='text-slate-600 dark:text-slate-400 font-light text-xl md:text-2xl max-w-3xl leading-relaxed'>
                    Explore the best developer events around the world. Compete, build, innovate, and win exciting prizes while expanding your network.
                </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='w-[90vw] max-w-6xl mx-auto pb-16 z-10 relative'
            >
                <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 transition-colors duration-500'>

                    <h3 className='text-3xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400'>
                        Filter Events
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-semibold text-slate-700 dark:text-slate-300'>
                        {[
                            'By HackerNews',
                            'Online',
                            'Offline',
                            'Upcoming',
                            '1 Day',
                            '2-3 Weeks',
                            '1 Month+',
                        ].map((item) => (
                            <label
                                key={item}
                                className='flex items-center gap-3 font-semibold transition hover:text-violet-600 dark:hover:text-cyan-400 cursor-pointer group'
                            >
                                <div className={`relative flex items-center justify-center w-5 h-5 rounded border ${activeCheckboxes.includes(item) ? 'bg-violet-600 border-violet-600' : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800'} transition-colors group-hover:border-violet-500`}>
                                  <input 
                                    type='checkbox' 
                                    className='cursor-pointer opacity-0 absolute inset-0' 
                                    checked={activeCheckboxes.includes(item)}
                                    onChange={() => toggleCheckbox(item)}
                                  />
                                  {activeCheckboxes.includes(item) && (
                                    <svg className="w-3.5 h-3.5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                {item}
                            </label>
                        ))}
                        <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className='bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 rounded-xl px-4 py-3 cursor-pointer focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition font-medium appearance-none shadow-sm'>
                            <option>Mode</option>
                            <option>Online</option>
                            <option>Offline</option>
                        </select>
                        <select value={prizeFilter} onChange={(e) => setPrizeFilter(e.target.value)} className='bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 rounded-xl px-4 py-3 cursor-pointer focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition font-medium appearance-none shadow-sm'>
                            <option>Prize Pool</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                        <select value={teamSizeFilter} onChange={(e) => setTeamSizeFilter(e.target.value)} className='bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 rounded-xl px-4 py-3 cursor-pointer focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition font-medium appearance-none shadow-sm'>
                            <option>Team Size</option>
                            <option>Individual</option>
                            <option>Team</option>
                        </select>
                    </div>
                    <div className='flex flex-col md:flex-row gap-4 mt-10'>
                        <div className="relative flex-1 group">
                          <input
                              type='text'
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder='Search hackathons, technologies, locations...'
                              className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 rounded-xl px-6 py-4 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition shadow-inner font-medium text-lg'
                          />
                        </div>
                        <button className='px-12 py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl cursor-pointer font-bold text-xl shadow-lg shadow-violet-600/30 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap'>
                            Find Events
                        </button>
                    </div>
                </div>
            </motion.div>
            <div className="bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-white/5 py-20 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center">
                   {loading && <div className="py-20 text-center col-span-full">Loading hackathons...</div>}
                   {error && <div className="py-20 text-center text-red-500 font-bold col-span-full">{error}</div>}
                   {!loading && !error && filteredHackathons.length === 0 && (
                       <div className="py-20 text-center col-span-full text-slate-500 dark:text-slate-400 font-medium text-xl">No hackathons found matching your criteria.</div>
                   )}
                   {!loading && !error && filteredHackathons.map((h, index) => {
                       const isRecent = new Date(h.eventDate) > new Date() ? "UPCOMING" : "ENDED";
                       const companyName = h.organizationName || h.hostName || "Host";
                       
                       let domain = "";
                       try { domain = new URL(h.websiteLink).hostname; } catch (e) { domain = h.websiteLink ? h.websiteLink.replace(/^https?:\/\//i,'').split('/')[0] : ""; }
                       
                       const formatBase64 = (data) => {
                         if (!data || data.length < 10) return null;
                         if (data.startsWith('data:')) return data;
                         let mime = "image/jpeg";
                         if (data.startsWith('iVBORw')) mime = "image/png";
                         else if (data.startsWith('PHN2Zw')) mime = "image/svg+xml";
                         else if (data.startsWith('R0lGOD')) mime = "image/gif";
                         return `data:${mime};base64,${data}`;
                       };

                       const imageData = h.imageData || h.ImageData;
                       const hostLogo = h.hostLogo || h.HostLogo;

                       const logoSrc = formatBase64(imageData) || 
                                       formatBase64(hostLogo) || 
                                       (domain ? `https://logo.clearbit.com/${domain}` : `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`);
                       
                       const formatPrize = h.prizePool ? `$${(h.prizePool / 1000).toFixed(0)}k Pool` : "No Prize";
                       const isApplied = appliedIds.includes(Number(h.hackathonId || h.hackathonID));
                       return (
                         <Card 
                           key={index}
                           hackathonId={h.hackathonId || h.hackathonID}
                            logo={logoSrc}
                            company={h.organizationName || h.hostName || "Host"}
                            websiteLink={h.websiteLink}
                           eventDate={h.eventDate}
                           time={isRecent}
                           title={h.hackathonName}
                           mode={h.mode}
                           type={h.hackathonType}
                           participationType={h.participationType}
                           duration={formatPrize}
                           subtitle="Prize Money"
                           disabled={isApplied}
                           onApply={isApplied ? undefined : () => setSelectedHackathon(h)}
                         />
                       );
                   })}
              </div>
            </div>
            {selectedHackathon && (
              <ApplicationForm 
                hackathon={selectedHackathon} 
                onClose={() => {
                  setSelectedHackathon(null);
                  const id = getUserId();
                  if (id) {
                    api.participant.getAppliedHackathons(id)
                      .then(data => setAppliedIds(data.map(a => Number(a.hackathonId || a.hackathonID || a.HostHackathonID))))
                      .catch(err => console.error(err));
                  }
                }} 
              />
            )}
            <Footer/>
        </div>
    );
};

export default Hero;