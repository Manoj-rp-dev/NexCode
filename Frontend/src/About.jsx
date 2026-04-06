import React from "react";
import { motion } from "framer-motion";
import { GoHome } from "react-icons/go";
import { Link } from "react-router-dom";
import Footer from "./Footer.jsx"
import Navbar from "./Navbar.jsx";
import { Check } from "lucide-react";
export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500 font-sans">
      <Navbar/>
      <div className="lg:absolute absolute lg:left-10 left-3 lg:top-8 top-6 z-50">
      </div>
      {/* HERO SECTION */}
      <section className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white py-32 px-6 lg:px-24 border-b border-slate-200 dark:border-white/5 transition-colors duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto relative z-10"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 font-bold text-sm tracking-widest uppercase shadow-sm">
            About Us
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-violet-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400">
            We Cover Innovation.
            <br />
            We Build Community.
          </h1>

          <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-xl font-medium leading-relaxed">
            NexCode is a digital-first platform dedicated to driving the future of tech. We deliver curated hackathon listings, competition updates, and powerful community-driven innovation stories from around the globe.
          </p>
        </motion.div>
      </section>

      {/* STORY SECTION */}
      <section className="py-32 px-6 lg:px-24 bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight">The Vision</h2>

            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6 font-medium">
              NexCode was created to solve one simple problem — discovering authentic and verified hackathons should not be difficult. We bring organizers and participants together in one beautifully streamlined platform.
            </p>

            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
              From student challenges to global enterprise-scale innovation competitions, our goal is to empower creators to connect, collaborate, and compete seamlessly.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-50 dark:bg-slate-900 p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen transition-opacity group-hover:opacity-100 opacity-50"></div>
            
            <h3 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">Highlights</span></h3>
            <ul className="space-y-6 text-slate-700 dark:text-slate-300 font-semibold text-lg">
              <li className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400"><Check size={16} /></div> Verified Hackathon Listings</li>
              <li className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400"><Check size={16} /></div> Real-time Event Updates</li>
              <li className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><Check size={16} /></div> Host & Participant Dashboards</li>
              <li className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400"><Check size={16} /></div> Innovation-Focused Community</li>
            </ul>
          </motion.div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-24 border-y border-slate-200 dark:border-white/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-12 text-center">
          <Stat number="2026" label="Founded" />
          <Stat number="500+" label="Hackathons Covered" />
          <Stat number="10K+" label="Global Hackers" />
          <Stat number="Growing" label="Community Network" />
        </div>
      </section>

      {/* JOURNEY SECTION */}
      <section className="py-32 px-6 lg:px-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
        {/* Glowing Background Elements for Timeline */}
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-violet-500/10 dark:bg-violet-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-cyan-500/10 dark:bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-black mb-24 text-center text-slate-900 dark:text-white tracking-tight"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400">Journey</span>
          </motion.h2>

          <div className="relative">
            {/* Glowing Center Line */}
            <div className="absolute left-[20px] md:left-1/2 md:-ml-[2px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-violet-500/20 via-fuchsia-500/50 to-cyan-500/20 dark:from-violet-500/20 dark:via-fuchsia-400/50 dark:to-cyan-400/20 rounded-full shadow-[0_0_15px_rgba(217,70,239,0.3)]"></div>

            <div className="space-y-24">
              
              {/* Timeline Item 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="relative md:w-1/2 md:pr-16 md:text-right group flex flex-col md:block"
              >
                {/* Node */}
                <div className="absolute top-6 left-[6px] md:-right-[17px] md:left-auto w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-[4px] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] z-10 transition-transform duration-300 group-hover:scale-125 group-hover:bg-violet-500"></div>
                
                {/* Content Card */}
                <div className="ml-12 md:ml-0 bg-white/70 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl group-hover:border-violet-500/50 dark:group-hover:border-violet-400/50 transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    The Beginning
                  </h4>
                  <div className="inline-block px-3 py-1 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 rounded-lg text-sm font-bold mb-4 tracking-wider uppercase">
                    2026
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    NexCode was officially launched with a vision to centralize hackathon discovery and provide structured, reliable event information to millions of developers worldwide.
                  </p>
                </div>
              </motion.div>

              {/* Timeline Item 2 */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative md:w-1/2 md:ml-auto md:pl-16 group flex flex-col md:block"
              >
                {/* Node */}
                <div className="absolute top-6 left-[6px] md:-left-[17px] w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-[4px] border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.6)] z-10 transition-transform duration-300 group-hover:scale-125 group-hover:bg-cyan-500"></div>
                
                {/* Content Card */}
                <div className="ml-12 md:ml-0 bg-white/70 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl group-hover:border-cyan-500/50 dark:group-hover:border-cyan-400/50 transition-colors duration-300 relative overflow-hidden text-left">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    Platform Expansion
                  </h4>
                  <div className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-lg text-sm font-bold mb-4 tracking-wider uppercase">
                    Growth
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    Introduced dedicated, beautifully engineered dashboards for hosts and participants, allowing seamless event publishing and streamlined team building.
                  </p>
                </div>
              </motion.div>

              {/* Timeline Item 3 */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative md:w-1/2 md:pr-16 md:text-right group flex flex-col md:block"
              >
                {/* Node */}
                <div className="absolute top-6 left-[6px] md:-right-[17px] md:left-auto w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-[4px] border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.6)] z-10 transition-transform duration-300 group-hover:scale-125 group-hover:bg-fuchsia-500"></div>
                
                {/* Content Card */}
                <div className="ml-12 md:ml-0 bg-white/70 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-xl group-hover:border-fuchsia-500/50 dark:group-hover:border-fuchsia-400/50 transition-colors duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    Global Community
                  </h4>
                  <div className="inline-block px-3 py-1 bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 rounded-lg text-sm font-bold mb-4 tracking-wider uppercase">
                    Scale
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    Focused on scaling a strong innovation-driven community, connecting students, senior engineers, and enterprise sponsors across borders.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-white py-32 text-center px-6 border-t border-slate-200 dark:border-white/5 transition-colors duration-500 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/10 dark:bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
            Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">Movement</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-xl font-medium mb-12">
            Whether you're hosting an event or forging the next big idea, NexCode connects you to the future.
          </p>

          <button className="bg-slate-900 dark:bg-violet-600 text-white px-10 py-5 hover:bg-slate-800 dark:hover:bg-violet-500 cursor-pointer rounded-2xl font-bold text-xl hover:-translate-y-1 shadow-2xl dark:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all">
            Start Building Today
          </button>
        </div>
      </section>

      <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <Footer />
      </div>
    </div>
  );
}

function Stat({ number, label }) {
  const isLong = number.length > 5;
  return (
    <div className="p-4 sm:p-8 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl dark:shadow-none transition-all flex flex-col justify-center items-center group overflow-hidden">
      <h3 className={`${isLong ? 'text-xl sm:text-3xl lg:text-4xl' : 'text-2xl sm:text-4xl lg:text-5xl'} font-black mb-1 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400 drop-shadow-sm leading-tight transition-transform group-hover:scale-105 duration-300 whitespace-nowrap`}>
        {number}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 font-extrabold tracking-widest uppercase text-[10px] sm:text-xs mt-1 sm:mt-2 opacity-80 text-center">
        {label}
      </p>
    </div>
  );
}