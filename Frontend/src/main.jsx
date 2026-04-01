import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import Card from './Card.jsx';
import Footer from './Footer.jsx';
import { FaAmericanSignLanguageInterpreting } from 'react-icons/fa';
import Signup from './Forparticipants/Signup.jsx';
import LoginSignupSection from './LoginSignupSection.jsx';
import LoginSection from './LoginSection.jsx';
import SignupSection from './SignupSection.jsx';
import HostSignup from './HostSignup.jsx';
import Profile from './Profile.jsx';
import Host from './Host.jsx';
import Resources from './Resources .jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import { Toaster } from 'react-hot-toast';
import Demo from './Demo.jsx';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--tw-prose-body)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          },
          className: '!bg-white/90 dark:!bg-slate-900/90 !backdrop-blur-xl !text-slate-900 dark:!text-white !font-bold !rounded-2xl !shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:!shadow-[0_0_40px_-10px_rgba(124,58,237,0.2)] !border !border-slate-200/50 dark:!border-white/10 !px-6 !py-4',
          success: {
            iconTheme: {
              primary: '#8b5cf6', // violet-500
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }} 
      />
      {/* <Demo/> */}
      <App />
      {/* <Resources/> */}
        {/* <Profile/> */}
    </BrowserRouter>
  </ThemeProvider>
)
  