import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Trophy, 
  LayoutDashboard, 
  LogOut, 
  Trash2, 
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  UserCheck,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Logo from './Forparticipants/Logo';
import { useTheme } from './ThemeContext';
import { Sun, Moon, X, Ban, Unlock } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalHosts: 0, totalHackathons: 0, totalApplications: 0, totalPending: 0 });
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, toggleTheme } = useTheme();
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, type: '' });

  useEffect(() => {
    // Basic auth check
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchData();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch('https://localhost:7109/api/Admin/Stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    let endpoint = '';
    if (activeTab === 'users') endpoint = 'Participants';
    else if (activeTab === 'hosts') endpoint = 'Hosts';
    else if (activeTab === 'hackathons') endpoint = 'Hackathons';
    else if (activeTab === 'approvals') endpoint = 'PendingHosts';

    try {
      const res = await fetch(`https://localhost:7109/api/Admin/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setDataList(await res.json());
      }
    } catch (err) {
      toast.error('Failed to sync data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    let type = '';
    if (activeTab === 'users') type = 'Participant';
    else if (activeTab === 'hosts') type = 'Host';
    else if (activeTab === 'hackathons') type = 'Hackathon';
    
    setDeleteTarget({ id, type });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRecord = async () => {
    const { id, type } = deleteTarget;
    if (!id || !type) return;

    try {
      const res = await fetch(`https://localhost:7109/api/Admin/${type}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success(`${type} record terminated`);
        fetchData();
        fetchStats();
      } else {
        toast.error('Termination failed');
      }
    } catch (err) {
      toast.error('Security breach: connection lost');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTarget({ id: null, type: '' });
    }
  };

  const handleBlock = async (id) => {
    try {
      const res = await fetch(`https://localhost:7109/api/Admin/BlockHost/${id}`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Host terminal restricted');
        fetchData();
        fetchStats();
        if (selectedEntity?.id === id) setSelectedEntity({ ...selectedEntity, isBlocked: true });
      } else {
        toast.error('Protocol failed: host still active');
      }
    } catch (err) {
      toast.error('System error during restriction');
    }
  };

  const handleUnblock = async (id) => {
    try {
      const res = await fetch(`https://localhost:7109/api/Admin/UnblockHost/${id}`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Host terminal restored');
        fetchData();
        fetchStats();
        if (selectedEntity?.id === id) setSelectedEntity({ ...selectedEntity, isBlocked: false });
      } else {
        toast.error('Restore failed');
      }
    } catch (err) {
      toast.error('Connection lost');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`https://localhost:7109/api/Admin/ApproveHost/${id}`, { 
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        toast.success('Host identity authorized');
        fetchData();
        fetchStats();
        if (selectedEntity?.id === id) setSelectedEntity({ ...selectedEntity, isApproved: true });
      } else {
        toast.error('Authorization failed');
      }
    } catch (err) {
      toast.error('System bypass: approval sync failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('AdminID');
    localStorage.removeItem('token');
    toast.success('Admin identity disconnected');
    navigate('/');
  };

  const filteredData = dataList.filter(item => {
    const s = searchTerm.toLowerCase();
    return (
      (item.fullName || item.hostName || item.name || '').toLowerCase().includes(s) ||
      (item.email || item.org || item.type || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050505] text-slate-300' : 'bg-slate-50 text-slate-700'} font-sans selection:bg-violet-500/30 flex overflow-hidden transition-colors duration-500`}>
      
      {/* MOBILE MENU TOGGLE (HIDDEN ON DESKTOP) */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
        className='lg:hidden fixed bottom-6 right-6 z-[120] p-4 bg-violet-600 text-white rounded-2xl shadow-2xl shadow-violet-600/40 active:scale-95 transition-all'
      >
        {mobileMenuOpen ? <X size={24}/> : <Zap size={24}/>}
      </button>

      {/* SIDEBAR */}
      <AnimatePresence>
        {(mobileMenuOpen || window.innerWidth >= 1024) && (
          <>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)} 
                className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden'
              />
            )}
            <motion.aside 
              initial={mobileMenuOpen ? { x: '-100%' } : false}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className={`w-72 border-r ${theme === 'dark' ? 'border-white/5 bg-[#0a0a0a]' : 'border-slate-200 bg-white'} flex flex-col h-screen fixed lg:sticky top-0 shrink-0 z-[100] transition-colors duration-500`}
            >
              <div className={`p-8 h-24 flex items-center border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'} mb-8 shadow-sm`}>
                <Logo />
                <span className="ml-3 px-2 py-0.5 bg-violet-600/10 text-violet-400 border border-violet-600/20 rounded text-[9px] font-bold tracking-widest uppercase">Root</span>
              </div>

              <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4 mt-2">Grid Control</div>
                
                <button 
                  onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }} 
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <div className="flex items-center gap-3 font-bold text-sm"><LayoutDashboard size={18} /> System Hub</div>
                </button>

                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4 mt-8">Registry Access</div>

                <button 
                  onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <Users size={18} /> User Repository
                </button>

                <button 
                  onClick={() => { setActiveTab('hosts'); setMobileMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'hosts' ? 'bg-fuchsia-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <Building2 size={18} /> Host Consortium
                </button>

                <button 
                  onClick={() => { setActiveTab('hackathons'); setMobileMenuOpen(false); }} 
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'hackathons' ? 'bg-cyan-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <Trophy size={18} /> Active Protocols
                </button>

                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4 mt-8">Security & Vetting</div>

                <button 
                  onClick={() => { setActiveTab('approvals'); setMobileMenuOpen(false); }} 
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'approvals' ? 'bg-emerald-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <div className="flex items-center gap-3 font-bold text-sm"><ShieldCheck size={18} /> Approval Queue</div>
                  {stats.totalPending > 0 && (
                    <span className="px-2 py-0.5 bg-white/20 text-white rounded-lg text-[9px] font-bold animate-pulse">{stats.totalPending}</span>
                  )}
                </button>
              </nav>

              <div className={`p-6 border-t ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
                <div className={`flex items-center gap-3 p-3 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'} rounded-2xl mb-4 border`}>
                  <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">A</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} truncate uppercase tracking-tighter`}>Admin Root</p>
                    <p className="text-[9px] font-semibold text-slate-500 truncate uppercase tracking-widest">System Overlord</p>
                  </div>
                </div>
                <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 font-bold text-[10px] transition-all uppercase tracking-widest">
                  <LogOut size={16} /> Disconnect Terminal
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className='h-20 sm:h-24 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl px-4 sm:px-10 flex items-center justify-between z-[60] shrink-0 transition-all duration-500 w-full'>
          <div className="flex items-center gap-4">
             {/* INTEGRATED TOGGLE */}
             <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 bg-violet-600 text-white rounded-xl shadow-lg">
                <LayoutDashboard size={18} />
             </button>
             <div>
               <h1 className='text-lg sm:text-2xl font-bold text-white uppercase tracking-tighter'>Mission Control</h1>
               <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global System Registry</p>
             </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              onClick={toggleTheme}
              className={`p-2.5 sm:p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 text-violet-600 hover:bg-slate-200'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden sm:flex px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Grid: Optimized</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-10 flex-1 overflow-y-auto custom-scrollbar">
          
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                  <StatCard title="Global Users" value={stats.totalUsers} icon={<Users size={24}/>} color="indigo" />
                  <StatCard title="Consortium Hosts" value={stats.totalHosts} icon={<Building2 size={24}/>} color="fuchsia" />
                  <StatCard title="Total Protocols" value={stats.totalHackathons} icon={<Trophy size={24}/>} color="cyan" />
                  <StatCard title="Active Signals" value={stats.totalApplications} icon={<Activity size={24}/>} color="violet" />
                </div>

                <div className={`${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-200'} border rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl transition-colors duration-500`}>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full"></div>
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tighter`}>Registry Distribution</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Participant vs. Host Ratio</p>
                    </div>
                    <Activity size={20} className="text-violet-500" />
                  </div>
                  
                  <div className="space-y-12">
                    {/* Users Bar */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Users</span>
                        </div>
                        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tighter`}>{stats.totalUsers}</span>
                      </div>
                      <div className={`h-4 w-full ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'} rounded-full overflow-hidden border`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats.totalUsers / (Math.max(stats.totalUsers + stats.totalHosts, 1))) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                        />
                      </div>
                    </div>

                    {/* Hosts Bar */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]"></div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consortium Hosts</span>
                        </div>
                        <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tighter`}>{stats.totalHosts}</span>
                      </div>
                      <div className={`h-4 w-full ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'} rounded-full overflow-hidden border`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(stats.totalHosts / (Math.max(stats.totalUsers + stats.totalHosts, 1))) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 shadow-[0_0_20px_rgba(192,38,211,0.3)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Total Entities</span>
                      <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats.totalUsers + stats.totalHosts}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">User Dominance</span>
                      <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {((stats.totalUsers / Math.max(stats.totalUsers + stats.totalHosts, 1)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col space-y-8 h-full"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      placeholder={`SEARCH ${activeTab.toUpperCase()}...`} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10 text-white placeholder:text-slate-700' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'} rounded-2xl pl-12 pr-6 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold outline-none focus:border-violet-600 transition-all uppercase tracking-widest shadow-sm`}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{filteredData.length} Records Found</span>
                  </div>
                </div>

                <div className={`${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'} border rounded-[2.5rem] overflow-hidden shadow-2xl flex-1 flex flex-col transition-colors duration-500`}>
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-40">
                      <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-6" />
                      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">Deciphering Registry...</p>
                    </div>
                  ) : filteredData.length > 0 ? (
                    <div className="overflow-x-auto min-h-0">
                      <table className="w-full text-left">
                        <thead>
                          <tr className={`text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/50'}`}>
                            <th className="px-4 sm:px-10 py-6">ID Signature</th>
                            <th className="px-4 sm:px-10 py-6">Identity Info</th>
                            <th className="px-4 sm:px-10 py-6">Mission Data</th>
                            <th className="px-4 sm:px-10 py-6 text-right">Termination</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'}`}>
                          {filteredData.map((item, idx) => (
                            <tr key={idx} className="group hover:bg-white/5 transition-colors">
                              <td className="px-4 sm:px-10 py-6">
                                <span className="text-xs font-mono text-slate-500 group-hover:text-violet-400 transition-colors">#{item.id || item.Id}</span>
                              </td>
                              <td className="px-4 sm:px-10 py-6" onClick={() => { setSelectedEntity(item); setIsModalOpen(true); }}>
                                <div className="flex items-center gap-4 cursor-pointer">
                                  <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-black border-white/5 group-hover:border-violet-600' : 'bg-slate-100 border-slate-200 group-hover:border-violet-600'} rounded-xl flex items-center justify-center font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-xs border transition-all`}>
                                    {(item.fullName || item.hostName || item.name || 'U').charAt(0)}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tighter truncate max-w-[200px]`}>{item.fullName || item.hostName || item.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate max-w-[200px]">
                                      {item.email} {item.city ? `• ${item.city}` : ''}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-10 py-6" onClick={() => { setSelectedEntity(item); setIsModalOpen(true); }}>
                                <div className="flex flex-col gap-1 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'} border rounded-full text-[9px] font-bold uppercase tracking-widest w-max`}>
                                      {item.type || (activeTab === 'users' ? 'Participant' : 'Host')}
                                    </span>
                                    {item.isBlocked && (
                                      <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[9px] font-bold text-red-500 uppercase tracking-widest w-max">Blocked</span>
                                    )}
                                  </div>
                                  {item.org && (
                                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-tight ml-1">{item.org}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 sm:px-10 py-6 text-right">
                                <div className="flex items-center gap-2 justify-end">
                                  {activeTab === 'hosts' && (
                                    item.isBlocked ? (
                                      <button 
                                        onClick={() => handleUnblock(item.id || item.Id)}
                                        className="p-3 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all transform active:scale-90"
                                        title="Unblock Host"
                                      >
                                        <Unlock size={16} />
                                      </button>
                                    ) : (
                                      <button 
                                        onClick={() => handleBlock(item.id || item.Id)}
                                        className="p-3 bg-orange-600/10 text-orange-500 rounded-xl hover:bg-orange-600 hover:text-white transition-all transform active:scale-90"
                                        title="Block Host"
                                      >
                                        <Ban size={16} />
                                      </button>
                                    )
                                  )}
                                  {activeTab === 'approvals' && (
                                    <button 
                                      onClick={() => handleApprove(item.id || item.Id)}
                                      className="p-3 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all transform active:scale-90"
                                      title="Approve Host"
                                    >
                                      <UserCheck size={16} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleDelete(item.id || item.Id)}
                                    className="p-3 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all transform active:scale-90"
                                    title="Reject/Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-40 opacity-20">
                      <ShieldCheck size={80} strokeWidth={1} />
                      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-8">Registry Void Detected</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && selectedEntity && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-2xl ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'} border rounded-[2.5rem] overflow-hidden shadow-2xl transition-colors duration-500`}
            >
              <div className={`p-8 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center font-bold text-white text-xl">
                    {(selectedEntity.fullName || selectedEntity.hostName || selectedEntity.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tight`}>{selectedEntity.fullName || selectedEntity.hostName || selectedEntity.name}</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{activeTab === 'users' ? 'Participant Identity' : 'Host Entity'}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className={`p-3 rounded-xl ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-100'} text-slate-500 transition-all`}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <DetailGroup label="Registered Email" value={selectedEntity.email} />
                    {activeTab === 'users' ? (
                      <>
                        <DetailGroup label="Academic Institution" value={selectedEntity.college} />
                        <DetailGroup label="Degree/Major" value={selectedEntity.degree} />
                      </>
                    ) : (
                      <>
                        <DetailGroup label="Organization" value={selectedEntity.org} />
                        <DetailGroup label="Entity Type" value={selectedEntity.hostType} />
                      </>
                    )}
                  </div>
                  <div className="space-y-6">
                    {activeTab === 'users' ? (
                      <DetailGroup label="Birth Registry" value={selectedEntity.dob ? new Date(selectedEntity.dob).toLocaleDateString() : 'N/A'} />
                    ) : (
                      <>
                        <DetailGroup label="Location" value={`${selectedEntity.city}, ${selectedEntity.country}`} />
                        <DetailGroup label="Access Status" value={selectedEntity.isBlocked ? 'RESTRICTED' : (selectedEntity.isApproved ? 'AUTHORIZED' : 'PENDING')} color={selectedEntity.isBlocked ? 'red' : (selectedEntity.isApproved ? 'emerald' : 'orange')} />
                      </>
                    )}
                  </div>
                </div>

                <div className={`mt-12 pt-8 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} flex items-center gap-4`}>
                    {activeTab === 'hosts' && (
                      selectedEntity.isBlocked ? (
                        <button onClick={() => { handleUnblock(selectedEntity.id); setIsModalOpen(false); }} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">Authorize Terminal</button>
                      ) : (
                        <button onClick={() => { handleBlock(selectedEntity.id); setIsModalOpen(false); }} className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">Restrict Terminal</button>
                      )
                    )}
                    <button onClick={() => { handleDelete(selectedEntity.id); setIsModalOpen(false); }} className="px-8 py-4 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Terminate Record</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-md ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'} border rounded-[2.5rem] overflow-hidden shadow-2xl`}
            >
              <div className="p-8 text-center border-b border-white/5">
                <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Ban size={32} />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} uppercase tracking-tighter mb-2`}>Terminate Record</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Are you sure you want to permanently delete this {deleteTarget.type} record? This action is irreversible.
                </p>
              </div>
              <div className="p-8 flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className={`flex-1 py-4 ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all`}
                >
                  Abort
                </button>
                <button 
                  onClick={confirmDeleteRecord}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/30"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailGroup = ({ label, value, color }) => {
  const { theme } = useTheme();
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-bold ${color === 'red' ? 'text-red-500' : (color === 'emerald' ? 'text-emerald-500' : (color === 'orange' ? 'text-orange-500' : (theme === 'dark' ? 'text-white' : 'text-slate-900')))} uppercase tracking-tight`}>
        {value || 'DATA NOT FOUND'}
      </p>
    </div>
  );
};const StatCard = ({ title, value, icon, color }) => {
  const { theme } = useTheme();
  const colors = {
    indigo: 'from-indigo-600/20 via-indigo-600/5 to-transparent border-indigo-500/30 text-indigo-400',
    fuchsia: 'from-fuchsia-600/20 via-fuchsia-600/5 to-transparent border-fuchsia-500/30 text-fuchsia-400',
    cyan: 'from-cyan-600/20 via-cyan-600/5 to-transparent border-cyan-500/30 text-cyan-400',
    violet: 'from-violet-600/20 via-violet-600/5 to-transparent border-violet-500/30 text-violet-400',
  };
 
  return (
    <div className={`p-6 sm:p-8 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-200'} border rounded-[2rem] shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-all bg-gradient-to-br ${colors[color]}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-current opacity-5 blur-[60px] rounded-full`}></div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{title}</p>
        <div className="opacity-40">{icon}</div>
      </div>
      <div className="flex items-end gap-3">
        <h3 className={`text-3xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} leading-none tracking-tighter`}>{value}</h3>
        <div className="p-1 px-2 bg-emerald-500/10 rounded-lg text-emerald-500 text-[8px] font-bold uppercase tracking-widest mb-1">+12%</div>
      </div>
    </div>
  );
};
;

export default AdminDashboard;
