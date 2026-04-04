import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Logo from "./Forparticipants/Logo";
import { IoNotificationsCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { BiLogOutCircle, BiSolidEdit } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { FaProjectDiagram } from "react-icons/fa";
import './index.css'
import Footer from './Footer';
import { IoClose } from "react-icons/io5";
import defaultProfile from "/defaultProfile.png";
import toast from 'react-hot-toast';
import Card from './Card';
import ApplicationForm from './ApplicationForm';
import { Sparkles, Camera, Trophy, Medal } from 'lucide-react';
import { Link } from "react-router-dom";
import { api } from "./services/api";


const Profile = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [qualification, setQualification] = useState("")
  
  // Display state
  const [skill, setSkill] = useState("")
  const [place, setPlace] = useState("")
  const [github, setGithub] = useState("")
  const [bio, setBio] = useState("")
  const [image, setImage] = useState(null)
  
  // Edit modal state
  const [editSkill, setEditSkill] = useState("")
  const [editPlace, setEditPlace] = useState("")
  const [editGithub, setEditGithub] = useState("")
  const [editBio, setEditBio] = useState("")
  const [editImage, setEditImage] = useState(null)
  const [editImageFile, setEditImageFile] = useState(null)
  
  // Dashboard state
  const [appliedHackathons, setAppliedHackathons] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const clearNotifications = async () => {
    const id = localStorage.getItem("ParticipantsID");
    if (!id) return;
    try {
      await api.participant.clearNotifications(id);
      setAppliedHackathons(prev => prev.map(a => ({ ...a, isNotificationCleared: true })));
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const visibleNotifications = appliedHackathons.filter(a => !a.isNotificationCleared);
  
  // Discover state
  const [allHackathons, setAllHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  
  // Saved hackathons (read from localStorage, keyed by hackathonID)
  const getSavedHackathons = () => {
    const combined = [...allHackathons, ...appliedHackathons];
    const seen = new Set();
    const unique = [];
    combined.forEach(h => {
      const id = h.hackathonID || h.hackathonId || h.HostHackathonID;
      if (id && !seen.has(id)) {
        seen.add(id);
        unique.push(h);
      }
    });
    return unique.filter(h => {
      const id = h.hackathonID || h.hackathonId || h.HostHackathonID;
      return localStorage.getItem(`saved_hackathon_${id}`) === 'true';
    });
  };
  const [savedHackathons, setSavedHackathons] = useState([]);

  const Logout = () => {
    localStorage.removeItem("ParticipantsID");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    
    toast.success("Logged out successfully");
    
    setTimeout(() => {
      navigate("/");
    }, 500);
  }
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(URL.createObjectURL(file));
      setEditImageFile(file);
    }
  };

  const fetchEditedProfileData = async () => {
    const id = localStorage.getItem("ParticipantsID");
    if (!id) return;
    try {
      const data = await api.participant.getEditedProfile(id);
      setSkill(data.skill || "");
      setPlace(data.place || "");
      setGithub(data.github || "");
      setBio(data.bio || "");
      if (data.image) {
        setImage(`data:image/png;base64,${data.image}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitProfile = async () => {
    const formData = new FormData();
    if (editImageFile) formData.append("ImageFile", editImageFile);
    const finalSkill = editSkill.trim() !== "" ? editSkill : skill;
    const finalPlace = editPlace.trim() !== "" ? editPlace : place;
    const finalGithub = editGithub.trim() !== "" ? editGithub : github;
    const finalBio = editBio.trim() !== "" ? editBio : bio;

    formData.append("ParticipantsID", Number(localStorage.getItem("ParticipantsID"))); 
    formData.append("Skill", finalSkill);
    formData.append("Place", finalPlace);
    formData.append("GithubLink", finalGithub);
    formData.append("Bio", finalBio);

    try {
      await api.participant.saveProfile(formData);
      toast.success("Profile Saved Successfully");
      
      setSkill(finalSkill);
      setPlace(finalPlace);
      setGithub(finalGithub);
      setBio(finalBio);
      if (editImage) setImage(editImage);

      setEditSkill("");
      setEditPlace("");
      setEditGithub("");
      setEditBio("");
      setEditImage(null);
      setEditImageFile(null);

      setVisible(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Connection error.");
    }
  };

  useEffect(() => {
    const fetchCoreProfileData = async () => {
      const id = localStorage.getItem("ParticipantsID");
      if (!id) {
        navigate("/");
        return;
      }
      try {
        const data = await api.participant.getProfile(id);
        setName(data.name || "");
        setEmail(data.email || "");
        setQualification(data.qualification || "");
      } catch (err) {
        console.error(err);
      }
    };
    const fetchAppliedHackathons = async () => {
      const id = localStorage.getItem("ParticipantsID");
      if (!id) return;
      setLoadingHistory(true);
      try {
        const data = await api.participant.getAppliedHackathons(id);
        setAppliedHackathons(data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    const fetchAllHackathons = async () => {
      try {
        const data = await api.hackathons.getAll();
        setAllHackathons(data);
      } catch (err) {
        console.error("Failed to fetch all hackathons", err);
      }
    };
    
    fetchCoreProfileData();
    fetchEditedProfileData();
    fetchAppliedHackathons();
    fetchAllHackathons();
  }, []);

  useEffect(() => {
    const update = () => {
      const combined = [...allHackathons, ...appliedHackathons];
      const seen = new Set();
      const unique = [];
      combined.forEach(h => {
        const id = h.hackathonID || h.hackathonId || h.HostHackathonID;
        if (id && !seen.has(id)) {
          seen.add(id);
          unique.push(h);
        }
      });
      setSavedHackathons(unique.filter(h => {
        const id = h.hackathonID || h.hackathonId || h.HostHackathonID;
        return localStorage.getItem(`saved_hackathon_${id}`) === 'true';
      }));
    };
    update();
    window.addEventListener('savedHackathonsChanged', update);
    return () => window.removeEventListener('savedHackathonsChanged', update);
  }, [allHackathons, appliedHackathons]);

  const participatedCount = appliedHackathons.filter(a => a.hasParticipated || a.HasParticipated).length;
  const winsCount = appliedHackathons.filter(a => a.isWinner || a.IsWinner).length;
  
  // Split applications into winners and active/others
  const wonHackathons = appliedHackathons.filter(a => a.isWinner || a.IsWinner);
  const activeApplications = appliedHackathons.filter(a => !(a.isWinner || a.IsWinner));

  const getLinkClass = (path) => {
    return `transition-colors hover:text-fuchsia-400 font-bold text-sm tracking-tight`;
  };

  return (
    <div className='w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans pb-10 transition-colors duration-500'>

      <div className='h-20 w-full fixed top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex justify-between items-center px-4 sm:px-10 shadow-sm dark:shadow-lg transition-all'>
        <div className="flex items-center gap-4 lg:gap-8 flex-1 min-w-0">
          <div className="shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95">
            <Logo />
          </div>
          <div className="hidden lg:flex gap-8">
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/resources" className={getLinkClass('/resources')}>Resources</Link>
            <Link to="/about" className={getLinkClass('/about')}>About</Link>
            <Link to="/Hero" className={getLinkClass('/Hero')}>Explore</Link>
          </div>
        </div>

        <div className='flex items-center gap-3 sm:gap-6 shrink-0'>
          <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                  showNotifications 
                    ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] border-violet-500/50' 
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                } relative cursor-pointer border`}
              >
                <IoNotificationsCircleOutline size={30} className="sm:size-6" />
                {visibleNotifications.length > 0 && !showNotifications && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-[#0a0a0a] rounded-full animate-pulse shadow-sm shadow-red-500/50"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-24 sm:top-auto sm:mt-3 w-auto sm:w-96 bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[100] overflow-hidden origin-top-right transition-colors duration-300"
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                      <h5 className="font-bold text-sm uppercase tracking-widest text-slate-500">Notifications</h5>
                      {visibleNotifications.length > 0 && (
                        <button onClick={clearNotifications} className="text-xs font-bold text-red-500 hover:underline">Clear all</button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2 flex flex-col gap-2 custom-scrollbar">
                      {visibleNotifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-sm font-medium flex flex-col items-center gap-2">
                           <Sparkles size={24} className="text-violet-500/50" />
                           All caught up!
                        </div>
                      ) : (
                        visibleNotifications.map((app, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 flex items-start gap-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            <div className="w-2 h-2 mt-2 rounded-full bg-fuchsia-500 shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                                Your application for <span className="font-bold text-slate-900 dark:text-white">{app.hackathonName}</span> is <span className="text-violet-600 dark:text-fuchsia-400 font-bold">{app.status || app.Status}</span>.
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block font-medium uppercase">{new Date(app.appliedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-white/5 text-center">
                       <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white uppercase tracking-widest">Close</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          <button onClick={() => {
            setEditSkill("");
            setEditPlace("");
            setEditGithub("");
            setEditBio("");
            setEditImage(null);
            setEditImageFile(null);
            setVisible(true);
          }} className="p-2.5 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">
            <BiSolidEdit size={24} className="sm:size-7" />
          </button>

          <button onClick={Logout} className="bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white px-3 sm:px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 font-bold shadow-lg dark:shadow-violet-600/30 transition-all hover:-translate-y-0.5 active:scale-95">
            <BiLogOutCircle size={20} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      <div className='h-20' />
      
      {visible && (
        <div className='fixed inset-0 z-50 flex justify-end bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm transition-all'>
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className='h-full w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto px-6 py-8'
          >
            <div className='flex justify-between items-center mb-10'>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Edit Profile</h2>
              <div className='cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors' onClick={() => setVisible(false)}>
                <IoClose size={28} className="text-slate-600 dark:text-slate-300" />
              </div>
            </div>

            <div className='flex flex-col gap-5'>
              <input value={editSkill} onChange={(e) => setEditSkill(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-slate-100 transition-shadow' type="text" placeholder='Your main skill (e.g., Full Stack Dev)' />
              <input value={editPlace} onChange={(e) => setEditPlace(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-slate-100 transition-shadow' type="text" placeholder='Your location' />
              <input value={editGithub} onChange={(e) => setEditGithub(e.target.value)} className='w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-slate-100 transition-shadow' type="text" placeholder='GitHub Profile URL' />
              <div className="w-full relative group">
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" id="upload" onChange={handleImageUpload} />
                <div className="w-full px-4 py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/50 flex flex-col items-center justify-center gap-2 group-hover:border-violet-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/5 transition-colors text-slate-500 dark:text-slate-400">
                  <Camera size={24} />
                  <p className="font-medium text-slate-600 dark:text-slate-300 text-sm">Click or drag to upload avatar</p>
                </div>
              </div>
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder='Tell us about yourself...' className='w-full px-4 py-3 min-h-[120px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-slate-900 dark:text-slate-100 resize-y transition-shadow'></textarea>
            </div>

            <div className='mt-10'>
              <button onClick={() => submitProfile()} className='w-full py-4 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 shadow-lg shadow-violet-600/20 transform transition-all hover:-translate-y-1 active:scale-95'>Save Changes</button>
            </div>
          </motion.div>
        </div>
      )}

      <div className='relative overflow-hidden w-[95vw] lg:w-full max-w-7xl mx-auto h-32 md:h-40 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex items-center shadow-lg mb-8'>
        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-500/10 dark:bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10 px-8 md:px-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className='text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400'>{name || "Hacker"}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium mt-2 max-w-xl text-sm md:text-base hidden sm:block">
            Build smarter. Collaborate faster. Win bigger. Ready for your next challenge?
          </p>
        </motion.div>
      </div>

      <div className="w-[95vw] lg:w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[auto] gap-6">
        
        <div className='col-span-1 md:col-span-1 lg:col-span-1 border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 rounded-[2rem] p-6 lg:p-8 flex flex-col items-center shadow-lg relative overflow-hidden group'>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 dark:bg-violet-500/10 blur-[50px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
          <div className='w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl mb-6 relative z-10'>
            <img src={image || defaultProfile} className="w-full h-full object-cover" alt="Profile" />
          </div>
          <h3 className='text-2xl font-bold text-slate-900 dark:text-white text-center mb-1 relative z-10'>{name || "Your Name"}</h3>
          <p className='text-sm font-bold text-violet-600 dark:text-fuchsia-400 uppercase tracking-wider mb-6 relative z-10'>{skill || "Developer"}</p>
          <div className='w-full space-y-4 relative z-10'>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Details</span>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"><span className="text-slate-500 dark:text-slate-400">Edu:</span> {qualification || "-"}</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"><span className="text-slate-500 dark:text-slate-400">Loc:</span> {place || "-"}</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between"><span className="text-slate-500 dark:text-slate-400">Mail:</span> <span className="truncate ml-2">{email || "-"}</span></div>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 lg:p-8 flex-1 shadow-lg relative overflow-hidden'>
            <h4 className='text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4'>About Me</h4>
            <div className="prose prose-slate dark:prose-invert text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {bio ? <p>{bio}</p> : <p className="text-slate-400 italic">This user hasn't added a bio yet.</p>}
            </div>
          </div>
          <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 shadow-lg flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"><FaProjectDiagram size={24} /></div>
              <div>
                <h4 className='text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight'>GitHub</h4>
                <a href={github} target="_blank" rel="noopener noreferrer" className="text-slate-900 dark:text-white font-bold hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors truncate block max-w-[200px] sm:max-w-xs">{github || "Link Account"}</a>
              </div>
            </div>
            <a href={github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">View</a>
          </div>
        </div>

        <div className='col-span-1 md:col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col shadow-lg'>
          <h4 className='text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6'>Hackathon Stats</h4>
          <div className="flex-1 flex flex-col justify-around gap-4 gap-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
              <div className="text-slate-600 dark:text-slate-400 font-medium text-lg">Participated</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{participatedCount}</div>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
              <div className="text-slate-600 dark:text-slate-400 font-medium text-lg">Wins</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{winsCount}</div>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-4">
              <div className="text-slate-600 dark:text-slate-400 font-medium text-lg">Applied</div>
              <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{appliedHackathons.length}</div>
            </div>
          </div>
        </div>

        {/* Winned Hackathons Section */}
        {wonHackathons.length > 0 && (
          <div className='col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-200 dark:border-amber-500/20 rounded-[2rem] p-6 lg:p-8 shadow-lg transition-transform hover:shadow-xl'>
            <div className="flex items-center gap-3 mb-6 border-b border-amber-100 dark:border-amber-500/10 pb-4">
              <Trophy size={24} className="text-amber-500" />
              <h4 className='text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest'>Winned Hackathons</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wonHackathons.map((win, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-amber-100 dark:border-amber-500/10 flex items-center gap-4 hover:scale-[1.02] transition-all cursor-default shadow-sm hover:shadow-md">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner border border-amber-200/50">
                    <Medal size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-slate-900 dark:text-white truncate">{win.hackathonName}</h5>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1 uppercase tracking-wider">{win.organizationName || win.hostName}</p>
                    <div className="mt-2 flex items-center gap-2">
                       <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-md">WINNER</span>
                       <span className="text-[10px] font-bold text-slate-400 italic">#{idx + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
      <div className='max-w-7xl mx-auto px-6 lg:px-0 mt-16 '>
        <div className="w-full flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your Applications</h3>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="h-12 text-violet-600 dark:text-cyan-400 text-sm font-bold px-4 cursor-pointer rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-violet-500 dark:hover:border-cyan-500/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none pr-10 relative">
            <option value="" disabled hidden>Filter by Type</option>
            <option value="All">All Applications</option>
            <option value="Individual">Solo Hackathon</option>
            <option value="Team">Team Hackathon</option>
          </select>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {appliedHackathons.filter(h => mode === "" || mode === "All" || (h.participationType && h.participationType.toLowerCase() === mode.toLowerCase())).map((h, index) => {
              const companyName = h.organizationName || h.hostName || "Host";
              const hId = h.hackathonId || h.hackathonID || h.HostHackathonID;
              let domain = "";
              try { domain = h.websiteLink ? new URL(h.websiteLink).hostname : ""; } catch (e) { domain = h.websiteLink ? h.websiteLink.replace(/^https?:\/\//i,'').split('/')[0] : ""; }
              
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
                              (domain ? `https://logo.clearbit.com/${domain}` : `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(companyName)}`);
              const formatPrize = (h.prizePool !== null && h.prizePool !== undefined && h.prizePool !== "") ? `$${Number(h.prizePool).toLocaleString()}` : "TBA";
              return (
                <Card key={index} hackathonId={hId} logo={logoSrc} company={companyName} websiteLink={h.websiteLink} title={h.hackathonName} mode={h.mode} type={h.hackathonType} participationType={h.participationType} duration={formatPrize} subtitle="Prize Money" actionText="Applied" disabled={true} />
              );
            })
          }
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 lg:px-0 mt-16 pb-10'>
        <div className="w-full flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-violet-500" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z"/></svg>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Saved Hackathons</h3>
          <span className="ml-auto px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold">{savedHackathons.length} Saved</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedHackathons.length === 0 ? (
            <div className='col-span-full h-[200px] w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-inner flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-3'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-200 dark:text-slate-700" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z"/></svg>
              <p className="font-medium text-base">No saved hackathons yet.</p>
            </div>
          ) : (
            savedHackathons.map((h, index) => {
              const companyName = h.organizationName || h.hostName || "Host";
              const hId = h.hackathonID || h.hackathonId || h.HostHackathonID;
              
              const isApplied = appliedHackathons.some(a => {
                const aId = a.hackathonId || a.hackathonID || a.HostHackathonID;
                return Number(aId) === Number(hId);
              });

              let domain = "";
              try { domain = h.websiteLink ? new URL(h.websiteLink).hostname : ""; } catch (e) { domain = h.websiteLink ? h.websiteLink.replace(/^https?:\/\//i,'').split('/')[0] : ""; }
              
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
                              (domain ? `https://logo.clearbit.com/${domain}` : `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(companyName)}`);
              
              const formatPrize = (h.prizePool !== null && h.prizePool !== undefined && h.prizePool !== "") ? `$${Number(h.prizePool).toLocaleString()}` : "TBA";
              
              return (
                <Card 
                  key={index} 
                  hackathonId={hId} 
                  logo={logoSrc} 
                  company={companyName} 
                  websiteLink={h.websiteLink} 
                  title={h.hackathonName} 
                  mode={h.mode} 
                  type={h.hackathonType} 
                  participationType={h.participationType} 
                  duration={formatPrize} 
                  subtitle="Prize Money" 
                  actionText={isApplied ? "Applied" : "Apply"}
                  disabled={isApplied}
                  onApply={isApplied ? undefined : () => setSelectedHackathon(h)} 
                />
              );
            })
          )}
        </div>
      </div>

      {selectedHackathon && (
        <ApplicationForm
          hackathon={selectedHackathon}
          onClose={() => {
            setSelectedHackathon(null);
            const id = localStorage.getItem("ParticipantsID");
            api.participant.getAppliedHackathons(id)
              .then(data => setAppliedHackathons(data))
              .catch(err => console.error(err));
          }}
        />
      )}
      <Footer />
    </div>
  )
}

export default Profile