import React, { useState } from "react";
import SubForm from "./SubmissionForm.jsx";
import { GoHome } from "react-icons/go";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
const Host = () => {
  const [agreed, setAgreed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden transition-colors duration-500 font-sans">
      <Navbar/>
      {/* HEADER */}
      <div className="w-full py-6 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-around items-center gap-7 px-4">
          {/* Title Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400 tracking-tight">
              Host Your Hackathon
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm lg:text-lg font-medium">
              Create • Innovate • Inspire Developers Worldwide
            </p>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center px-4 pb-20 mt-5">

        {!agreed && (
          <>
            {/* Welcome Card */}
            <div
              className="w-full max-w-4xl mt-12 rounded-3xl
              bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10
              shadow-xl dark:shadow-2xl p-8 lg:p-12 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

              <h2 className="text-violet-600 dark:text-fuchsia-400 text-3xl lg:text-4xl font-bold text-center mb-8 tracking-tight relative z-10">
                Welcome to NexCode
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-base lg:text-lg leading-relaxed text-center font-medium relative z-10">
                Welcome to NexCode — your ultimate source for the latest
                updates, insights, and stories from the world of innovation and
                technology competitions. Stay informed about global hackathons,
                developer challenges, startup events, winning projects and
                emerging technologies shaping innovation.
              </p>
            </div>

            {/* Terms Card */}
            <div
              className="w-full max-w-4xl mt-8 rounded-3xl
              bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10
              shadow-xl dark:shadow-2xl p-8 lg:p-12 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 dark:bg-violet-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>

              <h2 className="text-slate-900 dark:text-fuchsia-400 text-3xl lg:text-4xl font-bold text-center mb-8 tracking-tight relative z-10">
                Terms & Services
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-base lg:text-lg leading-relaxed text-center font-medium relative z-10 mb-10">
                By accessing NexCode, users agree to comply with platform
                policies. All submitted information must remain accurate and
                lawful. Unauthorized use or distribution of platform content is
                prohibited. Administrators may update or manage content to
                maintain security and reliability.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                <button
                  onClick={() => setAgreed(true)}
                  className="bg-violet-600 hover:bg-violet-700 dark:hover:bg-violet-500 text-white
                  px-10 py-4 rounded-xl cursor-pointer font-bold text-lg
                  shadow-lg shadow-violet-600/30 hover:-translate-y-1 transition active:scale-95"
                >
                  I Agree
                </button>

                <button
                  onClick={() => setShowPopup(true)}
                  className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200
                  px-10 py-4 rounded-xl cursor-pointer font-bold text-lg
                  transition hover:-translate-y-1 active:scale-95 border border-slate-300 dark:border-white/5"
                >
                  Disagree
                </button>
              </div>
            </div>
          </>
        )}

        {/* FORM */}
        {agreed && (
          <div className="w-full max-w-7xl mt-10">
            <SubForm />
          </div>
        )}

        {/* DISAGREE POPUP */}
        {showPopup && (
          <div
            className="fixed inset-0 flex justify-center items-center
            bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 transition-all"
          >
            <div
              className="bg-white dark:bg-slate-900 
              border border-slate-200 dark:border-white/10 rounded-3xl
              p-10 w-[90%] max-w-md text-center shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">
                Please agree to continue
              </h2>

              <button
                onClick={() => setShowPopup(false)}
                className="bg-violet-600 hover:bg-violet-700 dark:hover:bg-violet-500 text-white
                px-8 py-3 rounded-xl cursor-pointer font-bold text-lg w-full
                shadow-lg shadow-violet-600/30 transition active:scale-95"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </div>

  );
};

export default Host;