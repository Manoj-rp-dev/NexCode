import React, { useState, useEffect } from 'react';
import ApplicationForm from '../ApplicationForm';
import { api } from '../services/api';
import { getUserId } from '../utils/auth';
import Card from '../Card';


const JoinHackathon = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Extract unique types for the filter dropdown
  const uniqueTypes = ['All', ...new Set(hackathons.map(h => h.hackathonType).filter(Boolean))];

  const [appliedIds, setAppliedIds] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);


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
        } catch (err) { /* ignore if not logged in */ }
      };

    fetchHackathons();
    fetchAppliedIds();
  }, []);

  // Filter Logic
  const filteredHackathons = hackathons.filter(h => {
    const matchesSearch = h.hackathonName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.organizationName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === 'All' || h.mode === modeFilter;
    const matchesType = typeFilter === 'All' || h.hackathonType === typeFilter;
    
    return matchesSearch && matchesMode && matchesType;
  });

  return (
    <div className='w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-24 px-6 lg:px-24 transition-colors duration-500 font-sans'>
      
      {/* Header Section */}
      <div className='mb-12'>
        <h1 className='text-4xl lg:text-5xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400'>
          Join Hackathons
        </h1>
        <p className='text-lg font-medium text-slate-600 dark:text-slate-400 max-w-2xl'>
          Discover and compete in the world's most innovative hackathons. Join forces with creators globally, build amazing things, and win massive prizes.
        </p>
      </div>

      {/* Filters Section */}
      <div className='mb-12 flex flex-col md:flex-row gap-4 items-center bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-xl'>
        <div className='w-full flex-grow'>
          <input 
            type="text"
            placeholder="Search by name or organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 px-6 bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-fuchsia-500 transition-all text-slate-900 dark:text-white font-medium"
          />
        </div>
        
        <div className='w-full flex gap-4 md:w-auto'>
          <select 
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="flex-1 h-12 px-4 bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-fuchsia-500 text-slate-900 dark:text-white font-medium cursor-pointer"
          >
            <option value="All">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 h-12 px-4 bg-slate-100 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-fuchsia-500 text-slate-900 dark:text-white font-medium cursor-pointer"
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-10 text-red-500 font-bold">
          {error}
        </div>
      )}

      {/* Hackathons Grid */}
      {!loading && !error && (
        <>
          {filteredHackathons.length === 0 ? (
            <div className="text-center py-20 text-slate-600 dark:text-slate-400 font-medium">
              No hackathons found matching your criteria.
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center'>
              {filteredHackathons.map((h, index) => {
                const isRecent = new Date(h.eventDate) > new Date() ? "UPCOMING" : "ENDED";
                
                const companyName = h.organizationName || h.hostName || "Host";
                const hId = h.hackathonID || h.hackathonId;
                
                let domain = "";
                try { domain = h.websiteLink ? new URL(h.websiteLink).hostname : ""; } catch (e) { domain = h.websiteLink ? h.websiteLink.replace(/^https?:\/\//i,'').split('/')[0] : ""; }

                // Helper to format Base64 image data correctly
                const formatBase64 = (data) => {
                  if (!data || data.length < 10) return null;
                  if (data.startsWith('data:')) return data;
                  
                  // Detect mime type from Base64 header
                  let mime = "image/jpeg"; // Default
                  if (data.startsWith('iVBORw')) mime = "image/png";
                  else if (data.startsWith('PHN2Zw')) mime = "image/svg+xml";
                  else if (data.startsWith('R0lGOD')) mime = "image/gif";
                  
                  return `data:${mime};base64,${data}`;
                };

                const imageData = h.imageData || h.ImageData;
                const hostLogo = h.hostLogo || h.HostLogo;
                

                // Organization logo - Prioritize the specific hackathon image (uploaded as 'Logo' in form)
                const logoSrc = formatBase64(imageData) || 
                                formatBase64(hostLogo) || 
                                (domain ? `https://logo.clearbit.com/${domain}` : `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(companyName)}`);
                
                const formatPrize = h.prizePool ? `$${Number(h.prizePool).toLocaleString()}` : "No Prize";
                const isApplied = appliedIds.includes(Number(hId));

                return (
                  <Card 
                    key={hId || index}
                    hackathonId={hId}
                    logo={logoSrc}
                    company={companyName}
                    eventDate={h.eventDate}
                    time={isRecent}
                    title={h.hackathonName}
                    mode={h.mode}
                    type={h.hackathonType}
                    duration={formatPrize}
                    subtitle="Prize Money"
                    actionText={isApplied ? "Applied" : "View Details"}
                    disabled={isApplied}
                    onApply={isApplied ? undefined : () => setSelectedHackathon(h)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
      {selectedHackathon && (
        <ApplicationForm 
          hackathon={selectedHackathon} 
          onClose={() => {
            setSelectedHackathon(null);
            // Re-fetch applied IDs to update the UI
            const id = getUserId();
            if (id) {
              api.participant.getAppliedHackathons(id)
                .then(data => setAppliedIds(data.map(a => Number(a.hackathonId || a.hackathonID || a.HostHackathonID))))
                .catch(err => console.error(err));
            }
          }} 
        />
      )}
    </div>
  );
};

export default JoinHackathon;
