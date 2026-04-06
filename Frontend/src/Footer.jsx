import React from "react";
import { FaTwitter, FaFacebookF } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
    return (
        <div className="w-full mt-10 lg:mt-20 flex justify-center items-center pb-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <footer className="bg-white dark:bg-slate-950 border flex justify-center items-center border-slate-200 dark:border-white/5 rounded-3xl text-slate-800 dark:text-white py-12 lg:py-16 w-[95vw] shadow-lg relative overflow-hidden transition-colors duration-500">
                <div className="absolute top-[-20%]  left-[-10%] w-[300px] h-[300px] bg-violet-500/10 dark:bg-violet-500/10 blur-[80px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
                
                <div className="w-full max-w-7xl mx-auto px-6 flex flex-col sm:px-10 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 lg:gap-20 text-sm sm:text-base text-left">
                        {/* Column 1 */}
                        <div>
                            <div className="text-xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400">NexCode</div>
                            <div className="flex flex-col space-y-4 text-slate-600 dark:text-slate-400 font-medium">
                                <a href="/about" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">About</a>
                                <div className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Careers</div>
                                <div className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Contact</div>
                                <div className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Help</div>
                            </div>
                        </div>
                        
                        {/* Column 2 */}
                        <div>
                            <div className="text-lg font-bold mb-6 text-slate-900 dark:text-white drop-shadow-sm">Hackathons</div>
                            <div className="flex flex-col space-y-4 text-slate-600 dark:text-slate-400 font-medium overflow-hidden">
                                <a href="/join" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Browse hackathons</a>
                                <div className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Explore projects</div>
                                <a href="/hsignup" className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Host a hackathon</a>
                                <div className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Hackathon guides</div>
                            </div>
                        </div>
                        
                        {/* Column 3 */}
                        <div>
                            <div className="text-lg font-bold mb-6 text-slate-900 dark:text-white drop-shadow-sm">Portfolio</div>
                            <div className="flex flex-col space-y-4 text-slate-600 dark:text-slate-400 font-medium">
                                <div className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Your projects</div>
                                <div className="hover:text-violet-600 dark:hover:text-fuchsia-400 transition-colors cursor-pointer w-max block">Your hackathons</div>
                            </div>
                        </div>
                        
                        {/* Column 4 - Socials */}
                        <div>
                            <div className="text-lg font-bold mb-6 text-slate-900 dark:text-white drop-shadow-sm">Connect</div>
                            <div className="space-y-4 text-slate-600 dark:text-slate-400 font-medium">
                                <div className="flex items-center justify-start gap-4 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer group w-max">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:bg-cyan-50 dark:group-hover:bg-slate-800 transition-colors"><FaTwitter size={18} /></div>
                                    Twitter
                                </div>
                                <div className="flex items-center justify-start gap-4 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer group w-max">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:bg-violet-50 dark:group-hover:bg-slate-800 transition-colors"><BsDiscord size={18} /></div>
                                    Discord
                                </div>
                                <div className="flex items-center justify-start gap-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group w-max">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors"><FaFacebookF size={18} /></div>
                                    Facebook
                                </div>
                                <div className="flex items-center justify-start gap-4 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer group w-max">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors"><FaLinkedinIn size={18} /></div>
                                    LinkedIn
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-medium w-full">
                        <p>© 2026 NexCode. All rights reserved.</p>
                        <div className="flex gap-6">
                            <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors">Privacy Policy</span>
                            <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;