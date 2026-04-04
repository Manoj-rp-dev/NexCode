import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from "react-router-dom";
import Logo from "./Forparticipants/Logo";
import { 
  IoNotificationsOutline, 
  IoClose,
  IoSearchOutline, 
  IoSettingsOutline,
  IoPeopleOutline,
  IoGlobeOutline,
  IoLocationOutline,
  IoCopyOutline,
  IoFilterOutline,
  IoMailOutline,
  IoAddOutline,
  IoTrashOutline,
  IoRocketOutline,
  IoPulseOutline,
  IoShieldCheckmarkOutline,
  IoFolderOpenOutline,
  IoLogoGithub,
  IoTrophyOutline,
  IoSparklesOutline
} from "react-icons/io5";
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Plus, 
  LogOut, 
  Globe, 
  MapPin, 
  Edit3, 
  DollarSign,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Building2,
  Settings,
  ArrowRight,
  Target,
  BarChart3,
  Clock,
  Briefcase,
  Layers,
  Activity,
  UserCheck,
  MoreVertical,
  ExternalLink,
  ChevronDown,
  PieChart,
  FileText,
  Github,
  Award,
  Zap,
  Users2,
  User,
  ShieldAlert,
  Trash2,
  Terminal,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import toast from 'react-hot-toast';
import { api } from "./services/api";

const HostProfile = () => {
  const navigate = useNavigate();
  const hostId = localStorage.getItem("HostID");
  
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [myHackathons, setMyHackathons] = useState([]);
  const [stats, setStats] = useState({ totalHackathons: 0, totalApplicants: 0, totalPrizePool: 0 });
  const [loading, setLoading] = useState(true);
  
  // Notifications Engine
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Selection Engine
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Global Talent Nexus Registry
  const [globalTalent, setGlobalTalent] = useState([]);
  const [loadingTalent, setLoadingTalent] = useState(false);

  // Applicant Dossier Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [openTeamId, setOpenTeamId] = useState(null);

  // Edit Drawer State
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    HostName: "",
    OrganizationName: "",
    Bio: "",
    Website: "",
    Industry: "",
    City: "",
    Country: ""
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    if (!hostId) {
      navigate("/");
      return;
    }
    fetchDashboardData();
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hostId]);

  useEffect(() => {
    if (activeTab === 'talent') {
      fetchGlobalTalent();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [data, hackathons, s] = await Promise.all([
        api.host.getProfile(hostId),
        api.host.getMyHackathons(hostId),
        api.host.getDashboardStats(hostId)
      ]);

      if (data) {
        setProfile(data);
        setEditForm({
            HostName: data.hostName || "",
            OrganizationName: data.organizationName || "",
            Bio: data.bio || "",
            Website: data.website || "",
            Industry: data.industry || "",
            City: data.city || "",
            Country: data.country || ""
        });
        if (data.profileImage) {
          setImagePreview(`data:image/jpeg;base64,${data.profileImage}`);
        }
      }

      if (hackathons) {
        setMyHackathons(hackathons);
      }

      if (s) {
        setStats({
          totalHackathons: s.totalHackathons || 0,
          totalApplicants: s.totalApplicants || 0,
          totalPrizePool: parseFloat(s.totalPrizePool || 0)
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalTalent = async () => {
    setLoadingTalent(true);
    try {
      const data = await api.host.getAllApplicants(hostId);
      setGlobalTalent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTalent(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.host.getNotifications(hostId);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearNotifications = async () => {
    try {
      await api.host.clearNotifications(hostId);
      setNotifications([]);
      toast.success("Intelligence logs cleared");
    } catch (err) {
      console.error(err);
    }
  };

  const selectHackathon = async (hackathon) => {
    setSelectedHackathon(hackathon);
    setLoadingApplicants(true);
    try {
      const data = await api.host.getApplicants(hackathon.hackathonID);
      setApplicants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const toggleWinner = async (app) => {
    const appId = app.applicationId || app.ApplicationId || app.ApplicationID;
    const currentStatus = app.isWinner || app.IsWinner || false;
    const newStatus = !currentStatus;
    
    try {
      await api.host.updateWinnerStatus({ applicationId: appId, status: newStatus });
      setApplicants(prev => prev.map(a => {
        const aId = a.applicationId || a.ApplicationId || a.ApplicationID;
        if (aId === appId) {
          return { ...a, isWinner: newStatus, IsWinner: newStatus };
        }
        return a;
      }));
      toast.success(newStatus ? "Champion Identity Verified" : "Victory Revoked");
    } catch (err) {
      console.error(err);
      toast.error(`Terminal Error: ${err.message}`);
    }
  };

  const toggleParticipation = async (app) => {
    const appId = app.applicationId || app.ApplicationId || app.ApplicationID;
    const currentStatus = app.hasParticipated || app.HasParticipated || false;
    const newStatus = !currentStatus;

    try {
      await api.host.updateParticipationStatus({ applicationId: appId, status: newStatus });
      setApplicants(prev => prev.map(a => {
        const aId = a.applicationId || a.ApplicationId || a.ApplicationID;
        if (aId === appId) {
          return { ...a, hasParticipated: newStatus, HasParticipated: newStatus };
        }
        return a;
      }));
      toast.success(newStatus ? "Participation Logged" : "Participation Reset");
    } catch (err) {
      console.error(err);
      toast.error(`Terminal Error: ${err.message}`);
    }
  };

  const updateStatus = async (app, newStatus) => {
    const appId = app.applicationId || app.ApplicationId || app.ApplicationID;
    try {
      await api.host.updateApplicationStatus({ applicationId: appId, status: newStatus });
      setApplicants(prev => prev.map(a => {
        const aId = a.applicationId || a.ApplicationId || a.ApplicationID;
        if (aId === appId) {
          return { ...a, status: newStatus, Status: newStatus };
        }
        return a;
      }));
      toast.success(`Application ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error(`Terminal Error: ${err.message}`);
    }
  };

  const deleteHackathon = (id) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteHackathon = async () => {
    if (!idToDelete) return;
    try {
      await api.hackathons.delete(idToDelete);
      setMyHackathons(prev => prev.filter(h => h.hackathonID !== idToDelete));
      toast.success("Protocol Terminated Successfully");
    } catch (err) {
      toast.error(err.message || "Deletion Sequence Failed");
    } finally {
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  const toggleBlock = async (h) => {
    const newStatus = !h.isBlocked;
    try {
      await api.hackathons.toggleBlock(h.hackathonID, newStatus);
      setMyHackathons(prev => prev.map(item => item.hackathonID === h.hackathonID ? { ...item, isBlocked: newStatus } : item));
      toast.success(newStatus ? "Protocol Hiden from Public Grid" : "Protocol Restored to Public Grid");
    } catch (err) {
      toast.error(err.message || "Status Update Failed");
    }
  };

  const renderManagementArea = () => (
    <div className='flex flex-col h-full bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl'>
      <div className='p-8 border-b border-slate-200 dark:border-white/5 bg-gradient-to-r from-red-600/10 to-transparent'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-red-600/20 rounded-2xl text-red-500'><ShieldAlert size={28}/></div>
          <div>
            <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tighter uppercase'>Management Hub</h2>
            <p className='text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase'>Control and regulate protocols</p>
          </div>
        </div>
      </div>
      
      <div className='flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4'>
        {myHackathons.length > 0 ? myHackathons.map((h, i) => (
          <div key={i} className='p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-red-500/30 transition-all group'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
              <div className='flex items-center gap-4 sm:gap-5 flex-1 min-w-0'>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border ${h.isBlocked ? 'bg-red-950/40 border-red-500/20 text-red-400' : 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'}`}>
                  {h.isBlocked ? <ShieldAlert size={24}/> : <Globe size={24}/>}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-1'>
                    <h3 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-red-400 transition-colors uppercase tracking-tight'>{h.hackathonName}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${h.isBlocked ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {h.isBlocked ? "Hidden" : "Public"}
                    </span>
                  </div>
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest'>
                    <span className='flex items-center gap-1.5'><Target size={12}/> {h.hackathonType}</span>
                    <span className='flex items-center gap-1.5'><Calendar size={12}/> {new Date(h.eventDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className='flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0'>
                <button 
                  onClick={() => toggleBlock(h)}
                  className={`flex-1 md:flex-none px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${h.isBlocked ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {h.isBlocked ? "Restore to Grid" : "Hide from Grid"}
                </button>
                <button 
                  onClick={() => deleteHackathon(h.hackathonID)}
                  className='p-3 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-600/0 hover:shadow-red-600/20'
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className='h-[400px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-4 opacity-50'>
            <ShieldAlert size={64} strokeWidth={1}/>
            <p className='text-xs font-black uppercase tracking-[0.3em]'>No deployment protocols found</p>
          </div>
        )}
      </div>
    </div>
  );

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("HostID", hostId);
    Object.keys(editForm).forEach(key => formData.append(key, editForm[key]));
    if (profileImageFile) formData.append("profileImage", profileImageFile);

    try {
      await api.host.updateProfile(formData);
      toast.success("Security Policy Updated");
      setIsEditDrawerOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Profile update failed");
    }
  };

  const Logout = () => {
    localStorage.removeItem("HostID");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    toast.success("Identity Disconnected");
    navigate("/");
  };

  const activeHackathonsCount = myHackathons.filter(h => new Date(h.eventDate) >= new Date()).length;
  
  // Categorization Logic for specialized sections
  const soloHackathons = myHackathons.filter(h => {
    const type = h.participationType?.trim().toLowerCase();
    return type === 'solo' || type === 'individual';
  });
  const teamHackathons = myHackathons.filter(h => h.participationType?.trim().toLowerCase() === 'team');

  // Unified Section Handler
  const renderRegistryArea = (title, list, typeIcon, colorClass, showStatusControls = false) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col flex-1 space-y-8 min-h-0 min-w-0 overflow-hidden'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
                <h2 className='text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tighter break-words'>{title}</h2>
                <p className='text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest'>{list.length} ACTIVE DEPLOYMENTS</p>
            </div>
            <div className='flex items-center gap-4 w-full sm:w-auto'>
                <div className='relative flex items-center w-full sm:w-auto'>
                    <IoSearchOutline className='absolute left-4 text-slate-400' size={16} />
                    <input 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        type="text" placeholder="FILTER TARGETS..." 
                        className='bg-slate-100 dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 rounded-2xl pl-11 pr-6 py-2.5 text-[10px] font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all w-full sm:w-64 uppercase tracking-widest' 
                    />
                </div>
            </div>
        </div>

        <div className='bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-[2.5rem] overflow-hidden flex flex-col flex-1 min-h-[400px] sm:min-h-[500px] shadow-2xl'>
            <div className='flex-1 flex flex-col md:flex-row overflow-hidden'>
                <div className='w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 flex flex-col shrink-0 bg-slate-50 dark:bg-black/10 max-h-[250px] md:max-h-none'>
                    <div className='flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-3'>
                        {list.length > 0 ? list.map((h, i) => {
                            const isSelected = selectedHackathon?.hackathonID === h.hackathonID;
                            const isPast = new Date(h.eventDate) < new Date();
                            return (
                                <div 
                                    key={i} onClick={() => selectHackathon(h)}
                                    className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border ${isSelected ? `bg-${colorClass}-600/5 border-${colorClass}-600/50 shadow-inner` : 'bg-transparent border-transparent hover:bg-slate-200/50 dark:hover:bg-white/5 group'}`}
                                >
                                    <div className='flex items-center justify-between mb-3'>
                                        <h4 className={`text-xs font-black uppercase truncate flex-1 pr-3 tracking-tighter ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-300'}`}>{h.hackathonName}</h4>
                                        <div className={`w-2 h-2 rounded-full ${isPast ? 'bg-slate-300 dark:bg-slate-700' : `bg-${colorClass}-500 shadow-lg shadow-${colorClass}-500/30`}`}></div>
                                    </div>
                                    <div className='flex items-center justify-between text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest'>
                                        <span className='flex items-center gap-2'><Calendar size={12}/> {new Date(h.eventDate).toLocaleDateString()}</span>
                                        <span>{h.mode}</span>
                                    </div>
                                </div>
                            )
                        }) : (
                            <div className='py-20 md:py-40 text-center opacity-20'>
                                <Activity size={40} className='mx-auto mb-4' />
                                <p className='text-[9px] font-black uppercase tracking-widest'>No Data Streams</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex-1 bg-slate-50/30 dark:bg-black/30 flex flex-col overflow-hidden'>
                    <div className='p-4 sm:p-8 border-b border-slate-200 dark:border-white/5 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                        <div>
                            <h2 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter'>{selectedHackathon ? 'Transmission stream' : 'Awaiting sync'}</h2>
                            <p className='text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-1 break-words'>{selectedHackathon ? `${selectedHackathon.hackathonName} • ${applicants.length} PARTICIPANTS` : 'SELECT AN ENTITY FROM THE REGISTRY'}</p>
                        </div>
                        {selectedHackathon && (
                            <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 bg-${colorClass}-600/10 border-${colorClass}-600/30 text-${colorClass}-400`}>
                                {typeIcon} {selectedHackathon.participationType} MODEL
                            </div>
                        )}
                    </div>

                    <div className='flex-1 overflow-y-auto custom-scrollbar p-0'>
                        {loadingApplicants ? (
                            <div className='h-full flex flex-col items-center justify-center py-20'>
                                <div className={`w-8 h-8 border-2 border-${colorClass}-600 border-t-transparent rounded-full animate-spin mb-6`} />
                                <p className='text-slate-600 text-[10px] font-black uppercase tracking-widest'>FETCHING REPOSITORY...</p>
                            </div>
                        ) : applicants.length > 0 ? (
                            <table className='w-full text-left'>
                                <thead>
                                    <tr className='text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-tighter border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]'>
                                        <th className='px-3 sm:px-4 py-5'>CANDIDATE SIGNATURE</th>
                                        <th className='px-3 sm:px-4 py-5 hidden lg:table-cell'>IDENTITY TOKEN</th>
                                        {selectedHackathon?.participationType?.trim().toLowerCase() === 'team' && <th className='px-3 sm:px-4 py-5'>TEAM PARTNERS</th>}
                                        {showStatusControls && <th className='px-3 sm:px-4 py-5 text-center'>STATUS</th>}
                                        <th className='px-3 sm:px-4 py-5 text-right'>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.filter(a => a.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map((app, idx) => (
                                        <tr key={idx} className='group hover:bg-slate-50 dark:hover:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5'>
                                            <td className='px-3 sm:px-4 py-4 sm:py-6'>
                                                <div className='flex items-center gap-2 sm:gap-3'>
                                                    <div className='w-7 h-7 sm:w-9 sm:h-9 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10 group-hover:border-violet-600 transition-all shrink-0'>
                                                        {app.profileImage ? (
                                                            <img src={`data:image/jpeg;base64,${app.profileImage}`} className="w-full h-full object-cover" alt="avatar" />
                                                        ) : (
                                                            <span className='font-bold text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'>{app.fullName.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                      <span className='text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter block truncate max-w-[80px] sm:max-w-none'>{app.fullName}</span>
                                                      <span className='text-[8px] text-slate-500 dark:text-slate-400 font-bold lg:hidden truncate max-w-[70px] block'>{app.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-3 sm:px-4 py-4 sm:py-6 hidden lg:table-cell'>
                                              <div className="text-xs text-slate-400 font-bold truncate max-w-[100px] lg:max-w-[180px]" title={app.email}>{app.email}</div>
                                            </td>
                                            {selectedHackathon?.participationType?.trim().toLowerCase() === 'team' && (
                                              <td className='px-3 sm:px-4 py-4 sm:py-6'>
                                                {(() => {
                                                  try {
                                                    const members = app.teamMembers ? JSON.parse(app.teamMembers) : [];
                                                    if (members.length === 0) return <span className="text-[10px] text-slate-600 italic">No Partners</span>;
                                                    
                                                    const appId = app.applicationId || app.ApplicationId || app.ApplicationID;
                                                    const isOpen = openTeamId === appId;

                                                    return (
                                                      <div className="relative">
                                                        <button 
                                                          onClick={() => setOpenTeamId(isOpen ? null : appId)}
                                                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${isOpen ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-600/30' : 'bg-white/5 border-white/5 text-slate-400 hover:border-violet-600/30 hover:text-white'}`}
                                                        >
                                                          <Users2 size={14}/>
                                                          <span className="text-[10px] font-black uppercase tracking-widest">{members.length} Partners</span>
                                                          <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
                                                        </button>

                                                        <AnimatePresence>
                                                          {isOpen && (
                                                            <>
                                                              <div className="fixed inset-0 z-[190]" onClick={() => setOpenTeamId(null)}></div>
                                                              <motion.div 
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute left-0 mt-2 w-64 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden p-4"
                                                              >
                                                                <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-2">Team Consortium</div>
                                                                <div className="space-y-3">
                                                                  {members.map((m, i) => (
                                                                    <div key={i} className="flex flex-col gap-0.5 group/m">
                                                                      <div className="flex items-center gap-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 group-hover/m:scale-125 transition-transform"></div>
                                                                        <span className="text-[10px] font-bold uppercase tracking-tighter">{m.name}</span>
                                                                      </div>
                                                                      <span className="text-[9px] text-slate-500 font-bold pl-3.5 break-all">{m.email}</span>
                                                                    </div>
                                                                  ))}
                                                                </div>
                                                              </motion.div>
                                                            </>
                                                          )}
                                                        </AnimatePresence>
                                                      </div>
                                                    );
                                                  } catch (e) {
                                                    return <span className="text-[10px] text-red-500/50">Data Corrupted</span>;
                                                  }
                                                })()}
                                              </td>
                                            )}
                                            {showStatusControls && (
                                              <td className='px-3 sm:px-4 py-4 sm:py-6'>
                                                  <div className='flex items-center justify-center gap-4'>
                                                      {(() => {
                                                        const isJoined = app.hasParticipated || app.HasParticipated || false;
                                                        const isWin = app.isWinner || app.IsWinner || false;
                                                        const currentStatus = app.status || app.Status || 'Pending';
                                                        
                                                        // For non-winners tab, show Approve/Reject if not already decided
                                                        if (activeTab !== 'winners') {
                                                          return (
                                                            <div className="flex gap-2">
                                                              <button 
                                                                onClick={() => updateStatus(app, 'Approved')}
                                                                className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${currentStatus === 'Approved' ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:border-emerald-600/30'}`}
                                                              >
                                                                Approve
                                                              </button>
                                                              <button 
                                                                onClick={() => updateStatus(app, 'Rejected')}
                                                                className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${currentStatus === 'Rejected' ? 'bg-red-600/20 border-red-600/50 text-red-400' : 'bg-white/5 border-white/10 text-slate-500 hover:border-red-600/30'}`}
                                                              >
                                                                Reject
                                                              </button>
                                                            </div>
                                                          );
                                                        }

                                                        // For winners tab, show Joined/Winner toggle
                                                        return (
                                                          <>
                                                            <button 
                                                                onClick={() => toggleParticipation(app)}
                                                                className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${isJoined ? 'bg-emerald-600/20 border-emerald-600/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:border-emerald-600/30'}`}
                                                            >
                                                                {isJoined ? <IoShieldCheckmarkOutline size={14}/> : <IoPulseOutline size={14}/>}
                                                                <span className='hidden lg:inline'>{isJoined ? 'JOINED' : 'MARK JOINED'}</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => toggleWinner(app)}
                                                                className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-[8px] font-black uppercase tracking-widest ${isWin ? 'bg-amber-600/20 border-amber-600/50 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-white/5 border-white/10 text-slate-500 hover:border-amber-600/30'}`}
                                                            >
                                                                {isWin ? <IoTrophyOutline size={14}/> : <IoSparklesOutline size={14}/>}
                                                                <span className='hidden lg:inline'>{isWin ? 'WINNER' : 'MARK WINNER'}</span>
                                                            </button>
                                                          </>
                                                        );
                                                      })()}
                                                  </div>
                                              </td>
                                            )}
                                            <td className='px-3 sm:px-4 py-4 sm:py-6 text-right'>
                                                <div className='flex items-center justify-end gap-3'>
                                                    <button 
                                                      onClick={() => { setSelectedApp(app); setIsDetailsModalOpen(true); }}
                                                      className='px-4 py-2 bg-violet-600/10 text-violet-400 border border-violet-600/20 rounded-xl hover:bg-violet-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2'
                                                    >
                                                      <FileText size={14}/>
                                                      <span className="hidden lg:inline">Dossier</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className='h-full flex flex-col items-center justify-center py-40 opacity-20'>
                                <UserCheck size={80} strokeWidth={1} className='text-slate-700 mb-8' />
                                <p className='text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]'>VOID DETECTED</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  );

  if (loading) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Nexus Terminal...</p>
    </div>
  );

  return (
    <div className='w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-violet-500/30 flex overflow-x-hidden transition-colors duration-500'>

      {/* MOBILE MENU IS NOW HANDLED VIA THE HEADER FOR BETTER RESPONSIVENESS */}

      {/* MOBILE SIDEBAR (rendered only when open) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <div onClick={() => setMobileMenuOpen(false)} className='fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]'></div>
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className='w-72 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] flex flex-col h-screen fixed inset-y-0 left-0 z-[100] lg:hidden shadow-2xl'
            >
              <div className='p-6 h-20 flex items-center border-b border-slate-200 dark:border-white/5 mb-6 shadow-sm'>
                <Logo/>
              </div>
              <nav className='flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-10'>
                <div className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600 px-4 mb-4 mt-2'>Grid Command</div>
                <button onClick={() => { setActiveTab("overview"); setSelectedHackathon(null); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                  <div className='flex items-center gap-3 font-bold text-sm'><LayoutDashboard size={18} strokeWidth={2.5}/> Dashboard</div>
                </button>
                <button onClick={() => { setActiveTab("winners"); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'winners' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                  <div className='flex items-center gap-3 font-bold text-sm'><IoTrophyOutline size={18}/> Victory Control</div>
                </button>
                <div className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600 px-4 mb-4 mt-8'>Mission Zones</div>
                <button onClick={() => { setActiveTab("team_hackathons"); setSelectedHackathon(null); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'team_hackathons' ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                  <div className='flex items-center gap-3 font-bold text-sm'><Users2 size={18}/> Team Protocols</div>
                </button>
                <button onClick={() => { setActiveTab("solo_hackathons"); setSelectedHackathon(null); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'solo_hackathons' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                  <div className='flex items-center gap-3 font-bold text-sm'><User size={18}/> Solo Protocols</div>
                </button>
                <button onClick={() => { setActiveTab("management"); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'management' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                  <div className='flex items-center gap-3 font-bold text-sm'><ShieldAlert size={18}/> Management Hub</div>
                </button>
                <button onClick={() => { setIsEditDrawerOpen(true); setMobileMenuOpen(false); }} className='w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-bold text-sm transition-all'>
                  <IoShieldCheckmarkOutline size={18}/> Identity terminal
                </button>
              </nav>
              <div className='p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0a0a0a]'>
                <button onClick={Logout} className='w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 font-bold text-[10px] transition-all uppercase tracking-widest'>
                  <LogOut size={16} /> Secure Termination
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className='w-72 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] flex-col h-screen sticky top-0 shrink-0 hidden lg:flex'>
        <div className='p-6 h-20 flex items-center border-b border-slate-200 dark:border-white/5 mb-6 shadow-sm'>
          <Logo/>
        </div>

        <nav className='flex-1 px-4 space-y-1 overflow-y-hidden  pb-10'>
          <div className='text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-4 mb-4 mt-2'>Grid Command</div>
          
          <button onClick={() => { setActiveTab("overview"); setSelectedHackathon(null); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
             <div className='flex items-center gap-3 font-bold text-sm'><LayoutDashboard size={18} strokeWidth={2.5}/> Dashboard</div>
             {activeTab === 'overview' && <div className='w-1.5 h-1.5 rounded-full bg-white'></div>}
          </button>
          <button onClick={() => { setActiveTab("winners"); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'winners' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
             <div className='flex items-center gap-3 font-bold text-sm'><IoTrophyOutline size={18} strokeWidth={2.5}/> Victory Control</div>
             <span className='text-[9px] bg-white/10 px-2 py-0.5 rounded-full'>ELITE</span>
          </button>

          <div className='text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-4 mb-4 mt-8'>Mission Zones</div>

          <button onClick={() => { setActiveTab("team_hackathons"); setSelectedHackathon(null); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'team_hackathons' ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
             <div className='flex items-center gap-3 font-bold text-sm'><Users2 size={18} strokeWidth={2.5}/> Team Protocols</div>
          </button>

          <button onClick={() => { setActiveTab("solo_hackathons"); setSelectedHackathon(null); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'solo_hackathons' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
             <div className='flex items-center gap-3 font-bold text-sm'><User size={18} strokeWidth={2.5}/> Solo Protocols</div>
          </button>

          <div className='text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-4 mb-4 mt-8'>Registry Controls</div>

          <button onClick={() => { setActiveTab("talent"); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'talent' ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
             <div className='flex items-center gap-3 font-bold text-sm'><Users size={18} strokeWidth={2.5}/> Talent Nexus</div>
          </button>

          <button onClick={() => { setActiveTab("management"); setApplicants([]); setMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'management' ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'hover:bg-white/5 text-slate-400'}`}>
             <div className='flex items-center gap-3 font-bold text-sm'><ShieldAlert size={18} strokeWidth={2.5}/> Management Hub</div>
          </button>
          <button onClick={() => setIsEditDrawerOpen(true)} className='w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-white/5 text-slate-400 font-bold text-sm transition-all'>
             <IoShieldCheckmarkOutline size={18} strokeWidth={2.5} /> Identity terminal
          </button>
        </nav>

        <div className='p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0a0a0a]'>
          <div className='flex items-center gap-3 p-3 bg-white dark:bg-white/5 rounded-2xl mb-4 border border-slate-200 dark:border-white/5 group hover:border-violet-600/40 transition-all shadow-sm dark:shadow-none'>
             <div className='w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-black text-white text-sm shadow-lg'>{profile?.hostName?.charAt(0)}</div>
             <div className='flex-1 min-w-0'>
                <p className='text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter'>{profile?.hostName}</p>
                <p className='text-[9px] font-bold text-slate-500 dark:text-slate-400 truncate uppercase tracking-widest'>{profile?.organizationName}</p>
             </div>
          </div>
          <button onClick={Logout} className='w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 font-bold text-[10px] transition-all uppercase tracking-widest'>
             <LogOut size={16} /> Secure Termination
          </button>
        </div>
      </aside>

      {/* EDIT DRAWER */}
      <AnimatePresence>
        {isEditDrawerOpen && (
          <div className='active z-[110] fixed inset-0 flex justify-end bg-slate-900/60 dark:bg-black/80 backdrop-blur-md'>
            <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: "spring", stiffness: 300, damping: 35 }}
               className='h-screen w-full md:w-[500px] bg-white dark:bg-[#0f0f0f] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col'
            >
              <div className='p-10 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-black/20'>
                <div>
                    <h2 className='text-2xl font-bold uppercase tracking-tighter text-slate-900 dark:text-white'>Security Configuration</h2>
                    <p className='text-[10px] text-violet-500 font-bold tracking-widest uppercase'>IDENTITY TERMINAL</p>
                </div>
                <button onClick={() => setIsEditDrawerOpen(false)} className='w-12 h-12 flex items-center justify-center bg-slate-200/50 dark:bg-white/5 text-slate-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm'><IoClose size={24}/></button>
              </div>
              <form onSubmit={handleUpdateProfile} className='p-10 space-y-8 flex-1 overflow-y-auto custom-scrollbar pb-32'>
                {/* Form fields same as before... */}
                <div className='space-y-6'>
                  <div className='flex flex-col gap-3'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1'>Account Avatar</label>
                    <div className='flex items-center gap-6 p-4 bg-slate-50 dark:bg-black/40 rounded-3xl border border-slate-200 dark:border-white/5'>
                       <div className='w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-violet-600/30'>
                          <img src={imagePreview || `https://api.dicebear.com/9.x/shapes/svg?seed=${profile?.hostName}`} className="w-full h-full object-cover" alt="org" />
                       </div>
                       <label className='px-6 py-3 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-500 cursor-pointer shadow-lg transition-all'>
                          Sync New Visual
                          <input type="file" className='hidden' accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if (file) { setProfileImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                          }} />
                       </label>
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1'>Representative Name</label>
                    <input type="text" value={editForm.HostName} onChange={e => setEditForm({...editForm, HostName: e.target.value})} className='w-full px-6 py-4 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all'/>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1'>Organization / Consortium</label>
                    <input type="text" value={editForm.OrganizationName} onChange={e => setEditForm({...editForm, OrganizationName: e.target.value})} className='w-full px-6 py-4 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all'/>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-3'>
                      <label className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1'>Industry Sector</label>
                      <input type="text" value={editForm.Industry} onChange={e => setEditForm({...editForm, Industry: e.target.value})} className='w-full px-6 py-4 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all'/>
                    </div>
                    <div className='flex flex-col gap-3'>
                      <label className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1'>Digital Domain</label>
                      <input type="text" value={editForm.Website} onChange={e => setEditForm({...editForm, Website: e.target.value})} className='w-full px-6 py-4 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all'/>
                    </div>
                  </div>
                  <div className='flex flex-col gap-3'>
                    <label className='text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1'>Mission Statement (Bio)</label>
                    <textarea value={editForm.Bio} onChange={e => setEditForm({...editForm, Bio: e.target.value})} rows={4} className='w-full px-6 py-4 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all resize-none shadow-inner'></textarea>
                  </div>
                </div>
                <button type="submit" className='w-full py-5 bg-violet-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-violet-500 transition-all shadow-xl shadow-violet-600/30'>SYNCHRONIZE CORE IDENTITY</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className='flex-1 flex flex-col h-screen overflow-hidden relative min-w-0'>
        
        {/* HEADER */}
        <header className='min-h-[5rem] border-b border-slate-200 dark:border-white/10 px-4 sm:px-10 flex items-center justify-between bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl z-[60] shrink-0 py-4 sm:py-0 w-full relative'>
           <div className='flex items-center gap-4'>
              {/* INTEGRATED MOBILE TOGGLE */}
              <button 
                onClick={() => setMobileMenuOpen(true)} 
                className='lg:hidden p-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/30 active:scale-95 transition-all'
              >
                <Terminal size={18}/>
              </button>

              <div className='flex flex-col'>
                <h1 className='text-sm sm:text-xl font-bold uppercase tracking-tighter text-slate-900 dark:text-white'>Workspace Analytics</h1>
                <p className='text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest'>Admin Terminal</p>
              </div>
           </div>

           <div className='flex items-center gap-2 sm:gap-6 shrink-0'>
              {/* NOTIFICATION HUB */}
              <div className='relative' ref={notificationRef}>
                  <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2.5 sm:p-3 rounded-2xl border transition-all ${notifications.length > 0 ? 'bg-violet-600/10 text-violet-400 border-violet-600/50 animate-pulse' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                    <IoNotificationsOutline size={18} className="sm:w-5 sm:h-5"/>
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                     <motion.div initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.98 }} className='fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-24 sm:top-auto sm:mt-4 w-auto sm:w-96 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[200] overflow-hidden origin-top-right transition-colors duration-300'>
                         <div className='p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.03]'>
                            <span className='text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest'>Intelligence Log ({notifications.length})</span>
                            {notifications.length > 0 && (
                              <button onClick={clearNotifications} className='p-2 bg-slate-200/50 dark:bg-white/5 rounded-lg text-slate-500 hover:text-red-400 transition-colors'><IoTrashOutline size={16}/></button>
                            )}
                         </div>
                         <div className='max-h-[350px] sm:max-h-[450px] overflow-y-auto custom-scrollbar p-0'>
                            {notifications.length > 0 ? notifications.map((n, idx) => (
                              <div key={idx} className='p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-default border-l-4 border-l-transparent hover:border-l-violet-600'>
                                 <div className='flex items-center justify-between mb-1'>
                                    <span className='text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest'>Transmission Alert</span>
                                    <span className='text-[9px] font-mono text-slate-400 dark:text-slate-600'>{new Date(n.appliedAt).toLocaleTimeString()}</span>
                                 </div>
                                 <p className='text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed'><span className='text-slate-900 dark:text-white'>{n.participantName}</span> expanded into <span className='text-violet-600 dark:text-violet-400'>{n.hackathonName}</span></p>
                              </div>
                            )) : (
                              <div className='p-10 sm:p-16 flex flex-col items-center justify-center opacity-30'>
                                 <IoPulseOutline size={48} className='text-slate-700 mb-4 animate-pulse' />
                                 <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600'>Sector Quiet</p>
                              </div>
                            )}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              <Link to="/host" className='px-4 sm:px-6 py-2.5 sm:py-3 bg-violet-600 text-white rounded-2xl text-[10px] font-bold flex items-center gap-2 hover:bg-violet-500 shadow-xl shadow-violet-600/30 transition-all active:scale-95 uppercase tracking-widest'>
                 <IoAddOutline size={18} /> <span className='hidden sm:inline'>Host New Event</span><span className='sm:hidden'>New</span>
              </Link>
           </div>
        </header>

        <main className='p-4 sm:p-8 flex-1 flex flex-col min-h-0 min-w-0 space-y-6 sm:space-y-8 overflow-y-auto overflow-x-hidden custom-scrollbar'>
          
          {/* TAB: OVERVIEW (TOTAL HUD) */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col flex-1 space-y-8 min-h-0'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 shrink-0'>
                    <div className='p-6 sm:p-8 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm dark:shadow-none relative overflow-hidden group hover:border-violet-600/30 transition-all'>
                        <div className='absolute top-0 right-0 w-24 h-24 bg-violet-600/10 blur-[50px] rounded-full'></div>
                        <p className='text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3 sm:mb-4'>Host Protocols</p>
                        <h3 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter'>{stats.totalHackathons}</h3>
                    </div>
                    <div className='p-6 sm:p-8 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm dark:shadow-none relative overflow-hidden group hover:border-violet-600/30 transition-all'>
                        <div className='absolute bottom-0 right-0 w-24 h-24 bg-emerald-600/10 blur-[50px] rounded-full'></div>
                        <p className='text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3 sm:mb-4'>Grid Online</p>
                        <h3 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter'>{activeHackathonsCount}</h3>
                    </div>
                    <div className='p-6 sm:p-8 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm dark:shadow-none relative overflow-hidden group hover:border-violet-600/30 transition-all'>
                        <div className='absolute top-0 left-0 w-24 h-24 bg-indigo-600/10 blur-[50px] rounded-full'></div>
                        <p className='text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3 sm:mb-4'>Global Talent</p>
                        <h3 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter'>{stats.totalApplicants}</h3>
                    </div>
                    <div className='p-6 sm:p-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-violet-600/20'>
                        <p className='text-[9px] sm:text-[10px] font-semibold text-violet-200 uppercase tracking-[0.2em] mb-3 sm:mb-4 opacity-70'>Nexus Prize Pool</p>
                        <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-none tracking-tighter'>${(stats.totalPrizePool || 0).toLocaleString()}</h3>
                        <div className='mt-4 sm:mt-6 w-full h-1.5 bg-black/30 rounded-full overflow-hidden'><div className='w-[82%] h-full bg-white rounded-full'></div></div>
                    </div>
                </div>

                {/* VISUAL HUB BREAKDOWN */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-6'>
                    <div onClick={() => setActiveTab("team_hackathons")} className='h-60 sm:h-80 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 flex flex-col justify-between hover:border-violet-600/50 hover:bg-violet-600/[0.02] cursor-pointer transition-all group relative overflow-hidden shadow-xl dark:shadow-2xl'>
                        <div className='absolute -right-10 -top-10 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-full group-hover:bg-violet-600/20 transition-all'></div>
                        <div className='flex items-center justify-between relative z-10'>
                            <div className='p-3 sm:p-5 bg-violet-600/10 text-violet-500 rounded-2xl'><Users2 size={24} className='sm:w-8 sm:h-8' /></div>
                            <span className='text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase'>{teamHackathons.length} DEPLOYMENTS</span>
                        </div>
                        <div className='relative z-10'>
                            <h3 className='text-xl sm:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter'>Consortium Registry</h3>
                            <p className='text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-widest'>MULTI-DEVELOPER TEAM OPERATIONS</p>
                        </div>
                        <div className='flex items-center gap-2 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:gap-4 transition-all'>ACCESS REGISTRY <ArrowRight size={14}/></div>
                    </div>

                    <div onClick={() => setActiveTab("solo_hackathons")} className='h-60 sm:h-80 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/5 rounded-2xl sm:rounded-[3rem] p-6 sm:p-10 flex flex-col justify-between hover:border-blue-600/50 hover:bg-blue-600/[0.02] cursor-pointer transition-all group relative overflow-hidden shadow-xl dark:shadow-2xl'>
                        <div className='absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all'></div>
                        <div className='flex items-center justify-between relative z-10'>
                            <div className='p-3 sm:p-5 bg-blue-600/10 text-blue-500 rounded-2xl'><User size={24} className='sm:w-8 sm:h-8' /></div>
                            <span className='text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase'>{soloHackathons.length} DEPLOYMENTS</span>
                        </div>
                        <div className='relative z-10'>
                            <h3 className='text-xl sm:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter'>Unit Roster</h3>
                            <p className='text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-widest'>INDIVIDUAL STACK DEPLOYMENTS</p>
                        </div>
                        <div className='flex items-center gap-2 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:gap-4 transition-all'>ACCESS REGISTRY <ArrowRight size={14}/></div>
                    </div>
                </div>
            </motion.div>
          )}

          {/* TEAM SECTION */}
          {activeTab === 'team_hackathons' && renderRegistryArea("Consortium Registry", teamHackathons, <Users2 size={14}/>, "violet", true)}

          {/* SOLO SECTION */}
          {activeTab === 'solo_hackathons' && renderRegistryArea("Solo Unit Roster", soloHackathons, <User size={14}/>, "blue", true)}

          {/* VICTORY CONTROL SECTION */}
            {activeTab === 'winners' && renderRegistryArea(
              "Victory Control Center", 
              myHackathons.filter(h => new Date(h.eventDate) <= new Date()), 
              <IoTrophyOutline size={14}/>, 
              "amber", 
              true
            )}
            {activeTab === 'management' && renderManagementArea()}

          {/* TALENT NEXUS */}
          {activeTab === 'talent' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className='flex-1 flex flex-col space-y-10'>
                <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
                    <div>
                        <h2 className='text-2xl sm:text-4xl font-bold uppercase tracking-tighter'>Global Talent Nexus</h2>
                        <p className='text-[10px] text-violet-500 font-bold tracking-widest uppercase'>AGGREGATED CANDIDATE INTELLIGENCE LOGS</p>
                    </div>
                    <div className='relative flex items-center w-full lg:w-auto'>
                        <IoSearchOutline className='absolute left-5 text-slate-500' size={18} />
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="GLOBAL IDENTITY SEARCH..." className='bg-[#0f0f0f] border border-white/5 rounded-3xl pl-14 pr-8 py-4 text-[11px] font-black text-white outline-none focus:border-violet-600/50 transition-all w-full lg:w-[450px] uppercase tracking-[0.2em] shadow-2xl' />
                    </div>
                </div>
                <div className='flex-1 overflow-y-auto custom-scrollbar pb-20'>
                    {loadingTalent ? (
                        <div className='h-full flex flex-col items-center justify-center py-60'><div className='w-14 h-14 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-8' /><p className='text-slate-600 text-[12px] font-black uppercase tracking-[0.4em]'>DECRYPTING REGISTRY...</p></div>
                    ) : globalTalent.length > 0 ? (
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
                            {globalTalent.filter(a => {
                                const s = (searchTerm || "").toLowerCase().trim();
                                const name = (a.fullName || "").toLowerCase().trim();
                                const email = (a.email || "").toLowerCase().trim();
                                return name.includes(s) || email.includes(s);
                            }).map((app, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className='bg-[#0f0f0f] border border-white/5 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 flex flex-col relative group overflow-hidden shadow-2xl hover:border-violet-600/40 transition-all'>
                                    <div className='flex items-start gap-6 relative z-10'>
                                        <div className='w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-[2rem] bg-black border-2 border-white/5 overflow-hidden flex items-center justify-center shadow-lg group-hover:border-violet-600 transition-all shrink-0'>
                                            {app.profileImage ? <img src={`data:image/jpeg;base64,${app.profileImage}`} className="w-full h-full object-cover" alt="avatar" /> : <span className='text-3xl font-black text-slate-700 group-hover:text-white'>{app.fullName.charAt(0)}</span>}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center justify-between'><h3 className='text-2xl font-bold uppercase tracking-tighter truncate'>{app.fullName}</h3><div className='flex items-center gap-1.5 px-3 py-1 bg-violet-600/10 text-violet-400 rounded-full border border-violet-600/20'><Zap size={10} className='fill-current'/><span className='text-[9px] font-black uppercase tracking-widest'>{app.skills}</span></div></div>
                                            <p className='text-sm font-bold text-slate-500 mt-1 truncate'>{app.email}</p>
                                            <div className='flex items-center gap-4 mt-4'>
                                                <a href={app.githubLink} target="_blank" className='p-2.5 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all'><Github size={18}/></a>
                                                <a href={app.portfolioUrl} target="_blank" className='p-2.5 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all'><ExternalLink size={18}/></a>
                                                <button onClick={() => { navigator.clipboard.writeText(app.email); toast.success("ID Copied"); }} className='p-2.5 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-all'><IoMailOutline size={18}/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5'>
                                        <div className='bg-black/40 p-5 rounded-3xl border border-white/5 group-hover:bg-violet-600/5 transition-all mb-4'><div className='flex items-center gap-3 mb-2 opacity-50'><Layers size={14} className='text-violet-400'/><span className='text-[9px] font-black uppercase tracking-widest text-slate-400'>Total Protocols</span></div><p className='text-2xl font-black text-white leading-none'>{app.totalParticipated || app.TotalParticipated || 0} <span className='text-[10px] text-slate-600'>NODES</span></p></div>
                                        <div className='bg-black/40 p-5 rounded-3xl border border-white/5 group-hover:bg-emerald-600/5 transition-all mb-4'><div className='flex items-center gap-3 mb-2 opacity-50'><Award size={14} className='text-emerald-400'/><span className='text-[9px] font-black uppercase tracking-widest text-slate-400'>Victories Secured</span></div><p className='text-2xl font-black text-white leading-none'>{app.totalWins || app.TotalWins || 0} <span className='text-[10px] text-slate-600'>WINS</span></p></div>
                                    </div>
                                    <button 
                                      onClick={() => { setSelectedApp(app); setIsDetailsModalOpen(true); }}
                                      className='w-full py-4 bg-violet-600/10 text-violet-400 border border-violet-600/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-violet-600 hover:text-white transition-all'
                                    >
                                      VIEW DOSSIER
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : <div className='h-full flex flex-col items-center justify-center py-60 opacity-20'><Users size={120} strokeWidth={1} className='text-slate-700 mb-10' /><h3 className='text-4xl font-semibold uppercase tracking-widest text-slate-600'>Zero Talent Nodes Detected</h3></div>}
                </div>
            </motion.div>
          )}

          {/* MISC TABS (Analytics, Submissions) same as before... */}
          {activeTab === 'analytics' && <div className='p-40 text-center opacity-20'><IoPulseOutline size={100} className='mx-auto mb-10' /><p className='text-[10px] font-black uppercase tracking-widest'>Analyzing Sector Metrics...</p></div>}

        </main>
      </div>

      {/* CANDIDATE DOSSIER MODAL */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedApp && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-violet-600/10 to-transparent">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 border-2 border-violet-600/30 rounded-2xl flex items-center justify-center overflow-hidden">
                    {selectedApp.profileImage ? (
                      <img src={`data:image/jpeg;base64,${selectedApp.profileImage}`} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      <span className="text-2xl font-black text-white">{selectedApp.fullName?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">{selectedApp.fullName}</h2>
                    <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">{selectedApp.collegeName || 'Independent Participant'}</p>
                  </div>
                </div>
                <button onClick={() => setIsDetailsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white/5 text-slate-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                  <IoClose size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Left Column: Lead Details */}
                  <div className="lg:col-span-2 space-y-10">
                    <section>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <FileText size={14} className="text-violet-500"/> Mission Motivation
                      </h3>
                      <div className="p-6 bg-white/5 border border-white/5 rounded-3xl text-sm text-slate-300 leading-relaxed italic">
                        "{selectedApp.motivation || 'No motivation statement provided.'}"
                      </div>
                    </section>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Primary Stack</p>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{selectedApp.skills || 'Generalist'}</p>
                      </div>
                      <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Applied At</p>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{new Date(selectedApp.appliedAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {selectedApp.githubLink && (
                        <a href={selectedApp.githubLink} target="_blank" className="flex-1 py-4 bg-[#171515] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                          <IoLogoGithub size={18}/> GitHub Repository
                        </a>
                      )}
                      {selectedApp.portfolioUrl && (
                        <a href={selectedApp.portfolioUrl} target="_blank" className="flex-1 py-4 bg-violet-600 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20">
                          <IoGlobeOutline size={18}/> Project Portfolio
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Team Roster */}
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Users size={14} className="text-violet-500"/> Team Consortium
                      </h3>
                      <div className="space-y-4">
                        <div className="p-5 bg-violet-600/5 border border-violet-600/20 rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 text-[8px] font-black bg-violet-600 text-white rounded-bl-xl uppercase tracking-widest">LEAD</div>
                          <p className="text-xs font-bold uppercase tracking-tighter">{selectedApp.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-bold break-all mt-1">{selectedApp.email}</p>
                        </div>

                        {(() => {
                          try {
                            const partners = selectedApp.teamMembers ? JSON.parse(selectedApp.teamMembers) : [];
                            return partners.map((m, i) => (
                              <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-violet-600/30 transition-all">
                                <p className="text-xs font-black text-slate-300 uppercase tracking-tighter group-hover:text-white transition-colors">{m.name}</p>
                                <p className="text-[10px] text-slate-600 font-bold break-all mt-1 group-hover:text-slate-400 transition-colors">{m.email}</p>
                              </div>
                            ));
                          } catch (e) {
                            return <p className="text-[10px] text-red-500/50">Partners Data Unavailable</p>;
                          }
                        })()}
                      </div>
                    </section>

                    <section className="p-6 bg-black/40 border border-white/5 rounded-3xl">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">Status Log</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${selectedApp.status === 'Approved' ? 'bg-emerald-600/20 text-emerald-400' : (selectedApp.status === 'Rejected' ? 'bg-red-600/20 text-red-400' : 'bg-orange-600/20 text-orange-400')}`}>
                          {selectedApp.status || 'Pending'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-600">Total Protocols</span>
                          <span className="text-white">{selectedApp.totalParticipated}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-600">Victories</span>
                          <span className="text-emerald-500">{selectedApp.totalWins}</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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
              className="w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 text-center border-b border-white/5">
                <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white uppercase tracking-tighter mb-2">Confirm Termination</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Are you sure you want to permanently delete this protocol? This action cannot be undone.
                </p>
              </div>
              <div className="p-8 flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={confirmDeleteHackathon}
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
  )
}

export default HostProfile
