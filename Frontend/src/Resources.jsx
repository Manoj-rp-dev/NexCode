import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoHome, GoLinkExternal } from "react-icons/go";
import { FiCode, FiFramer, FiBookOpen, FiTool, FiDatabase, FiCpu } from "react-icons/fi";
import Navbar from "./Navbar";
import Footer from "./Footer";

const resourcesData = [
  {
    category: "APIs & Data",
    icon: <FiDatabase />,
    color: "violet",
    items: [
      { name: "OpenAI API", desc: "Industry-leading LLMs for text, vision, and audio.", link: "https://openai.com/api/" },
      { name: "Supabase", desc: "Open source Firebase alternative with Postgres.", link: "https://supabase.com/" },
      { name: "Hugging Face", desc: "The AI community building the future.", link: "https://huggingface.co/" },
      { name: "Stripe API", desc: "Payment infrastructure for the internet.", link: "https://stripe.com/docs/api" }
    ]
  },
  {
    category: "UI & Design",
    icon: <FiFramer />,
    color: "fuchsia",
    items: [
      { name: "Tailwind CSS", desc: "Utility-first CSS framework for rapid UI dev.", link: "https://tailwindcss.com/" },
      { name: "Framer Motion", desc: "Production-ready animation library for React.", link: "https://www.framer.com/motion/" },
      { name: "Lucide Icons", desc: "Beautiful & consistent icon toolkit.", link: "https://lucide.dev/" },
      { name: "Shadcn UI", desc: "Beautifully designed components that you can copy and paste.", link: "https://ui.shadcn.com/" }
    ]
  },
  {
    category: "Tools & Hosting",
    icon: <FiTool />,
    color: "cyan",
    items: [
      { name: "Vercel", desc: "Develop. Preview. Ship. For the best frontend teams.", link: "https://vercel.com/" },
      { name: "GitHub", desc: "Where the world builds software.", link: "https://github.com/" },
      { name: "Postman", desc: "An API platform for building and using APIs.", link: "https://www.postman.com/" },
      { name: "Figma", desc: "The collaborative interface design tool.", link: "https://www.figma.com/" }
    ]
  },
  {
    category: "Learning Paths",
    icon: <FiBookOpen />,
    color: "emerald",
    items: [
      { name: "React Docs", desc: "The library for web and native user interfaces.", link: "https://react.dev/" },
      { name: "Next.js Learn", desc: "The React Framework for the Web.", link: "https://nextjs.org/learn" },
      { name: "MDN Web Docs", desc: "Resources for developers, by developers.", link: "https://developer.mozilla.org/" },
      { name: "Python for Beginners", desc: "Start learning Python from scratch.", link: "https://www.python.org/about/gettingstarted/" }
    ]
  }
];

export default function Resources() {
  const [activeTab, setActiveTab] = useState("All");
  
  const tabs = ["All", "APIs & Data", "UI & Design", "Tools & Hosting", "Learning Paths"];

  const filteredData = activeTab === "All" 
    ? resourcesData 
    : resourcesData.filter(d => d.category === activeTab);

  const getColorClasses = (color) => {
    switch(color) {
      case "violet": return "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-500/20";
      case "fuchsia": return "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-500/20";
      case "cyan": return "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/20";
      case "emerald": return "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20";
      default: return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/20";
    }
  };

  const getBorderHoverClasses = (color) => {
    switch(color) {
      case "violet": return "group-hover:border-violet-500/50";
      case "fuchsia": return "group-hover:border-fuchsia-500/50";
      case "cyan": return "group-hover:border-cyan-500/50";
      case "emerald": return "group-hover:border-emerald-500/50";
      default: return "group-hover:border-slate-500/50";
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen font-sans transition-colors duration-500 overflow-hidden relative pb-10">
      
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-violet-500/10 dark:bg-violet-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <Navbar />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 mt-16 md:mt-24 text-center z-10 relative"
      >
        <div className="inline-block mb-6 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          Developer Toolkit
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 drop-shadow-sm">
          Hackathon Resources
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Everything you need to build, deploy, and win your next hackathon. Curated APIs, design assets, and learning paths.
        </p>
      </motion.div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6 mt-16 flex flex-wrap justify-center gap-4 z-10 relative">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
              activeTab === tab
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform -translate-y-1"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RESOURCE GRIDS */}
      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-24 z-10 relative">
        {filteredData.map((section, idx) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/20 dark:border-white/5 ${getColorClasses(section.color)}`}>
                {section.icon}
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {section.category}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {section.items.map((item, itemIdx) => (
                <a 
                  key={itemIdx} 
                  href={item.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 p-6 rounded-[2rem] shadow-sm hover:shadow-xl dark:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] transition-[transform,shadow,border-color] duration-300 hover:-translate-y-2 flex flex-col justify-between min-h-[180px] will-change-transform ${getBorderHoverClasses(section.color)}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                        {item.name}
                      </h3>
                      <GoLinkExternal className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-32 mb-16 relative z-10">
        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 dark:from-slate-900 dark:to-slate-900 border border-transparent dark:border-white/10 rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full pointer-events-none"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight relative z-10">Missing a great tool?</h2>
          <p className="text-violet-100 dark:text-slate-400 text-lg mb-8 max-w-lg mx-auto font-medium relative z-10">Help the community by submitting your favorite APIs, datasets, or UI kits.</p>
          <button className="bg-white text-violet-600 dark:bg-violet-600 dark:text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-black/20 hover:shadow-black/30 dark:shadow-violet-600/30 transition-all hover:-translate-y-1 active:scale-95 relative z-10">
            Suggest a Resource
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
