import { FiCalendar, FiUsers, FiBookOpen, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Shield, Zap } from "lucide-react";
import Navbar from "./Navbar";
import { getUserRole } from "./utils/auth";
import Card from "./Card";

export default function App() {
  const navigate = useNavigate();
   const role = getUserRole();

  const handleExplore = () => {
    if (role === 'participant') {
      navigate('/Hero');
    } else if (role === 'host') {
      navigate('/host');
    } else {
      navigate('/join');
    }
  };

  const handleJoinCommunity = () => {
    if (!role) {
      navigate('/signup');
    } else {
      navigate('/about');
    }
  };

  const handleApply = () => {
    if (!role) {
      navigate('/signup');
    } else if (role === 'participant') {
      navigate('/Hero');
    } else {
      // For hosts or other roles, navigate to their dashboard or appropriate page
      navigate('/host');
    }
  };

  const features = [
    { icon: <FiTrendingUp />, title: "Real-Time Updates", text: "Track hackathons worldwide instantly." },
    { icon: <FiCalendar />, title: "Event Calendar", text: "Explore upcoming competitions easily." },
    { icon: <FiBookOpen />, title: "Resource Hub", text: "Access APIs, tutorials and developer tools." },
    { icon: <FiUsers />, title: "Developer Community", text: "Find teammates and collaborate." }
  ];

  const stats = [
    { number: "500+", label: "Hackathons" },
    { number: "10K+", label: "Developers" },
    { number: "120+", label: "Countries" },
    { number: "Growing", label: "Community Network" }
  ];

  const featuredTasks = [
    { title: "AI Revolution 2026", organizer: "TechForward", date: "April 15-17, 2026", prize: "$50,000", tags: ["AI/ML", "Python"] },
    { title: "EcoTech Challenge", organizer: "GreenInno", date: "May 5-7, 2026", prize: "$30,000", tags: ["Sustainability", "IoT"] },
    { title: "Web3 Future Summit", organizer: "CryptoCore", date: "June 20-22, 2026", prize: "20 ETH", tags: ["Blockchain", "Solidity"] }
  ];

  const steps = [
    { id: "01", title: "Discover", text: "Browse through hundreds of verified hackathons from around the globe." },
    { id: "02", title: "Build", text: "Join teams, brainstorm ideas, and start building your innovation." },
    { id: "03", title: "Succeed", text: "Submit your project, win amazing prizes, and scale your career." }
  ];

  const testimonials = [
    { name: "Alex Rivera", role: "Winning Hacker @ AI Global", text: "NexCode transformed the way I find and participate in hackathons. The dashboard is a lifesaver." },
    { name: "Sarah Chen", role: "Director of Innovation, GreenInno", text: "As a host, NexCode provides the tools to organize at scale while building a real community." }
  ];

  return (<>


    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500 font-sans">
      <Navbar />
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden pt-20">

        {/* Background Video */}

        <video
          autoPlay
          loop
          muted
          playsInline
          src="/bgVideo.mp4"
          className="absolute inset-0 w-full h-full object-cover"
        ></video>
        {/* Overlay (optional dark layer for readability) */}
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] z-0 transition-colors duration-500"></div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-5xl"
        >
          <div className="mb-4 px-5 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 mx-auto w-fit transition-transform hover:scale-105 duration-300 cursor-default whitespace-nowrap">
            <Globe size={18} className="text-fuchsia-500" strokeWidth={2.5} /> <span>Join 10K+ Hackers</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight text-white dark:text-white drop-shadow-md">
            Discover Global
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 drop-shadow-sm mt-2">
              Hackathons
            </span>
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Find competitions, developer events, and winning projects worldwide. Build your portfolio and accelerate your career.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <button
              onClick={handleExplore}
              className="group cursor-pointer flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-1">
              Explore Events <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleJoinCommunity}
              className="px-8 cursor-pointer py-4 rounded-xl border-2 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-lg transition-all hover:-translate-y-1">
              Join Community
            </button>
          </div>
        </motion.div>

      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white dark:bg-slate-900 px-6 transition-colors duration-500 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              Platform Features
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to discover, participate, and win at top-tier hackathons.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-violet-500/30 dark:hover:border-violet-500/50 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-cyan-400 text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-slate-50">
                  {f.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  {f.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-white/5 px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <h3 className="text-3xl lg:pb-5 pb-2   md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400 drop-shadow-sm mb-3">
                {s.number}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-lg tracking-wide uppercase">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED HACKATHONS */}
      <section className="py-24 bg-white dark:bg-slate-900 px-6 transition-colors duration-500 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-500/5 dark:bg-violet-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              Featured Competitions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Explore some of the most prestigious events currently live on our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredTasks.map((h, i) => (
              <Card
                key={i}
                title={h.title}
                company={h.organizer}
                eventDate={h.date}
                duration={h.prize}
                subtitle="prize pool"
                tags={h.tags}
                onViewDetails={() => navigate('/Hero')}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-100 dark:bg-slate-950 px-6 transition-colors duration-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-violet-300 dark:via-white/10 to-transparent"></div>
            
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 border-2 border-violet-500 dark:border-violet-400 text-violet-600 dark:text-violet-400 text-3xl font-black flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform relative z-10">
                  {s.id}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-wider">{s.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-[280px] mx-auto font-medium">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white dark:bg-slate-900 px-6 transition-colors duration-500 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-16 uppercase tracking-widest">Community Voice</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[3rem] text-left border border-slate-200 dark:border-white/5 relative"
              >
                <div className="text-violet-500 text-5xl font-serif absolute top-6 right-8 opacity-20">"</div>
                <p className="text-lg italic text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                  "{t.text}"
                </p>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-black text-xl">{t.name}</h4>
                  <p className="text-violet-600 dark:text-violet-400 text-sm font-bold tracking-tight uppercase">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-white/5 py-16 px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="md:col-span-2">
            <h3 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400 mb-6">
              NexCode
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-base max-w-sm leading-relaxed">
              The premier destination for discovering hackathons, connecting with developers, and accelerating innovation worldwide.
            </p>
            <div className="flex gap-6 text-2xl text-slate-400 dark:text-slate-500 mt-8">
              <a href="#" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-violet-500 dark:hover:text-violet-400 transition-colors"><FaDiscord /></a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"><FaGithub /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 tracking-wide">PLATFORM</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Events & Hackathons</a></li>
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Winner Showcases</a></li>
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Developer Resources</a></li>
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Community Hub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 tracking-wide">ORGANIZERS</h4>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Host a Hackathon</a></li>
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Pricing & Plans</a></li>
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Sponsorships</a></li>
              <li><a href="#" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors">Contact Sales</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between text-slate-500 dark:text-slate-500 text-sm font-medium">
          <p>© {new Date().getFullYear()} NexCode. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>


    </div>
  </>

  );
}