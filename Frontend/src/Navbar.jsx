import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon, Terminal } from "lucide-react";
import Logo from "./Forparticipants/Logo";
import Hero from "./Hero.jsx";
import { useTheme } from "./ThemeContext.jsx";
import { getUserRole } from "./utils/auth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const role = getUserRole();
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname.toLowerCase() === path.toLowerCase();
    return `transition-colors ${isActive ? 'text-fuchsia-500 dark:text-fuchsia-400' : 'hover:text-fuchsia-400'}`;
  };

  return (
    <div className='w-full text-slate-900 dark:text-slate-50 transition-colors duration-300'>
      <div className="max-w-7xl mx-auto px-5 h-20 flex items-center gap-2 justify-between">
        <div className="pr-5 flex items-center">
          <Logo className="h-20 w-auto" />
        </div>
        <div className="hidden lg:flex gap-10 font-bold text-[17px] tracking-tight">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/resources" className={getLinkClass('/resources')}>Resources</Link>
          <Link to="/about" className={getLinkClass('/about')}>About</Link>
          {
            role == "host" ? (
              <>
                <Link to="/host" className={getLinkClass('/host')}>Host Hackathon</Link>
                <Link to="/host-profile" className={getLinkClass('/host-profile')}><Terminal size={30} /></Link>
              </>
            ) : role == "participant" ? (
              <>
                <Link to="/Hero" className={getLinkClass('/Hero')}>Join Hackathon</Link>
                <Link to="/profile" className={getLinkClass('/profile')}><Terminal size={30} /></Link>
              </>
            ) : (
              <>
                <Link to="/login" className={getLinkClass('/login')}>Login</Link>
                <Link to="/signup" className={getLinkClass('/signup')}>Sign Up</Link>
              </>
            )
          }
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full cursor-pointer bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            className="lg:hidden cursor-pointer  text-slate-900 dark:text-slate-50"
            onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden absolute z-50 flex flex-col top-20 right-0 w-64 bg-white dark:bg-slate-900 px-6 py-6 space-y-6 font-bold tracking-tight border-l border-b border-slate-200 dark:border-white/5 shadow-xl rounded-bl-xl transition-colors duration-300">
          <Link onClick={() => setOpen(false)} to="/" className={`block w-full py-2 ${getLinkClass('/')}`}>Home</Link>
          <Link onClick={() => setOpen(false)} to="/resources" className={`block w-full py-2 ${getLinkClass('/resources')}`}>Resources</Link>
          <Link onClick={() => setOpen(false)} to="/about" className={`block w-full py-2 ${getLinkClass('/about')}`}>About</Link>
          {
            role == "host" ? (
              <>
                <Link onClick={() => setOpen(false)} to="/host" className={`block w-full py-2 ${getLinkClass('/host')}`}>Host Hackathon</Link>
                <Link onClick={() => setOpen(false)} to="/host-profile" className={`flex items-center gap-2 w-full py-2 ${getLinkClass('/host-profile')}`}><Terminal size={24} /> <span>Profile</span></Link>
              </>
            ) : role == "participant" ? (
              <>
                <Link onClick={() => setOpen(false)} to="/Hero" className={`block w-full py-2 ${getLinkClass('/Hero')}`}>Join Hackathon</Link>
                <Link onClick={() => setOpen(false)} to="/profile" className={`flex items-center gap-2 w-full py-2 ${getLinkClass('/profile')}`}><Terminal size={24} /> <span>Profile</span></Link>
              </>
            ) : (
              <>
                <Link onClick={() => setOpen(false)} to="/login" className={`block w-full py-2 ${getLinkClass('/login')}`}>Login</Link>
                <Link onClick={() => setOpen(false)} to="/signup" className={`block w-full py-2 ${getLinkClass('/signup')}`}>Sign Up</Link>
              </>
            )
          }
        </div>
      )}
    </div>
  );
};

export default Navbar;