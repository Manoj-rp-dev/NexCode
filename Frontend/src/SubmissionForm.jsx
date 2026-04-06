import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Trophy, Users, Globe, FileText, Tag, Rocket } from "lucide-react";
import { MdCloudUpload } from "react-icons/md";
import toast from 'react-hot-toast';
import { api } from "./services/api";
import { getUserId } from "./utils/auth";

export default function SubmissionForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        type: "",
        mode: "",
        participation: "",
        teamSize: "",
        prize: "",
        date: "",
        registrationStartDate: "",
        registrationEndDate: "",
        photo: "",
        description: "",
        websiteLink: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [close, setClose] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const newState = { ...prev, [name]: value };
            // If participation changed to Team and teamSize is empty, set default to 2
            if (name === "participation" && value === "Team" && !prev.teamSize) {
                newState.teamSize = "2";
            }
            return newState;
        });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.type || !form.mode || !form.date || !form.photo) {
            setError("Please fill all required fields");
            toast.error("Please fill all required fields");
            return;
        }

        if (form.participation === "Team" && (!form.teamSize || parseInt(form.teamSize) < 2)) {
            setError("Team size must be at least 2");
            toast.error("Team size must be at least 2");
            return;
        }

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("HostID", getUserId());
            data.append("HackathonName", form.name);
            data.append("HackathonType", form.type);
            data.append("Mode", form.mode);
            data.append("ParticipationType", form.participation);
            
            if (form.participation === "Team" && form.teamSize) {
                data.append("TeamSize", form.teamSize);
            }
            
            data.append("PrizePool", form.prize);
            
            // Format dates as ISO strings (YYYY-MM-DD) to prevent backend parsing errors
            const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : "";
            
            data.append("RegistrationStartDate", formatDate(form.registrationStartDate));
            data.append("RegistrationEndDate", formatDate(form.registrationEndDate));
            data.append("EventDate", formatDate(form.date));
            
            data.append("Description", form.description);
            data.append("WebsiteLink", form.websiteLink);
            data.append("Photo", form.photo);

            await api.hackathons.create(data);
            
            setError("");
            toast.success("Hackathon submitted successfully! Redirecting to dashboard...", {
                duration: 4000,
                icon: <Rocket size={20} className="text-violet-500" />
            });
            
            // Clear form
            handleclear();
            
            // Navigate after 3 seconds
            setTimeout(() => {
                navigate("/host-profile");
            }, 3000);

        } catch (err) {
            console.error(err);
            setError(err.message || "Submission failed");
            toast.error(err.message || "An error occurred during submission.");
        } finally {
            setSubmitting(false);
        }
    };
    const handleclear = () => {
        setForm({
            name: "",
            type: "",
            mode: "",
            participation: "",
            teamSize: "",
            prize: "",
            date: "",
            registrationStartDate: "",
            registrationEndDate: "",
            photo: "",
            description: "",
            websiteLink: "",
        });

        setPreview(null);

    };
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // max 5MB validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }
        // store file in form state
        setForm((prev) => ({
            ...prev,
            photo: file,
        }));
        // preview image
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };


    return (
        <div className="w-full max-w-7xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.3)] p-5 lg:p-12 border border-slate-200 dark:border-white/10 transition-colors duration-500" >
            <div className="mb-8 lg:mb-12">
                <h1 className="text-3xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400">
                    Hackathon Submission
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm lg:text-lg font-medium">
                    Fill in the details below to publish your hackathon event.
                </p>
            </div>
            
            <div className="relative">
                
                {!close &&
                    (
                        <div className={`flex flex-col gap-8 ${submitting ? "blur-[2px] pointer-events-none opacity-80" : ""}`}>
                            
                            {/* BASIC INFORMATION */}
                            <div className="bg-white/80 dark:bg-slate-900/50 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                                <h2 className="text-slate-800 dark:text-white text-lg lg:text-xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center">1</div>
                                    Basic Information
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-violet-500 transition-all">
                                        <Tag className="text-slate-400 flex-shrink-0" size={20} />
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Hackathon Name"
                                            className="bg-transparent w-full text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-violet-500 transition-all">
                                        <FileText className="text-slate-400 flex-shrink-0" size={20} />
                                        <input
                                            name="type"
                                            value={form.type}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Type of Hackathon (eg: AI/ML, Cybersecurity)"
                                            className="bg-transparent w-full text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* EVENT SETTINGS */}
                            <div className="bg-white/80 dark:bg-slate-900/50 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                                <h2 className="text-slate-800 dark:text-white text-lg lg:text-xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 flex items-center justify-center">2</div>
                                    Event Settings
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-fuchsia-500 transition-all">
                                        <Globe className="text-slate-900 dark:text-slate-400 flex-shrink-0" size={20} />
                                        <select
                                            name="mode"
                                            value={form.mode}
                                            onChange={handleChange}
                                            className="w-full text-slate-900 dark:text-white outline-none bg-transparent cursor-pointer font-medium" >
                                            <option value="" disabled className="text-slate-400">Select Mode</option>
                                            <option value="Online">Online</option>
                                            <option value="Offline">Offline</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-fuchsia-500 transition-all">
                                        <Users className="text-slate-900 dark:text-slate-400 flex-shrink-0" size={20} />
                                        <select
                                            name="participation"
                                            value={form.participation}
                                            onChange={handleChange}
                                            className="w-full text-slate-900 dark:text-white outline-none bg-transparent cursor-pointer font-medium" >
                                            <option value="" disabled className="text-slate-400">Select Participation</option>
                                            <option value="Team">Team</option>
                                            <option value="Individual">Individual</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-fuchsia-500 transition-all">
                                        <Trophy className="text-slate-900 dark:text-slate-400 flex-shrink-0" size={20} />
                                        <input
                                            name="prize"
                                            value={form.prize}
                                            onChange={handleChange}
                                            type="number"
                                            placeholder="Prize Pool ($)"
                                            className="bg-transparent w-full text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
                                        />
                                    </div>
                                    {form.participation === "Team" && (
                                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-fuchsia-500 transition-all">
                                            <Users className="text-slate-400 flex-shrink-0" size={20} />
                                            <input
                                                name="teamSize"
                                                value={form.teamSize}
                                                onChange={handleChange}
                                                type="number"
                                                placeholder="Team Size"
                                                className="bg-transparent w-full text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
                                                min="2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SCHEDULE & UPLOAD */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white/80 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
                                    <h2 className="text-slate-800 dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center">3</div>
                                        Schedule
                                    </h2>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-cyan-500 transition-all">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-slate-900 dark:text-white flex-shrink-0" size={20} />
                                                <span className="text-slate-700 dark:text-slate-300 text-sm font-bold tracking-tight pointer-events-none">Registration Starts</span>
                                            </div>
                                            <input
                                                name="registrationStartDate"
                                                value={form.registrationStartDate}
                                                onChange={handleChange}
                                                type="date"
                                                className="bg-transparent text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] outline-none cursor-pointer w-full sm:w-auto mt-2 sm:mt-0"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-cyan-500 transition-all">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-slate-900 dark:text-white flex-shrink-0" size={20} />
                                                <span className="text-slate-700 dark:text-slate-300 text-sm font-bold tracking-tight pointer-events-none">Registration Ends</span>
                                            </div>
                                            <input
                                                name="registrationEndDate"
                                                value={form.registrationEndDate}
                                                onChange={handleChange}
                                                type="date"
                                                className="bg-transparent text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] outline-none cursor-pointer w-full sm:w-auto mt-2 sm:mt-0"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-cyan-500 transition-all">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-slate-900 dark:text-white flex-shrink-0" size={20} />
                                                <span className="text-slate-700 dark:text-slate-300 text-sm font-bold tracking-tight pointer-events-none">Event Date</span>
                                            </div>
                                            <input
                                                name="date"
                                                value={form.date}
                                                onChange={handleChange}
                                                type="date"
                                                className="bg-transparent text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] outline-none cursor-pointer w-full sm:w-auto mt-2 sm:mt-0"
                                            />
                                        </div>
                                    </div>
                            </div>
                                <div className="bg-white/80 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
                                    <h2 className="text-slate-800 dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 flex items-center justify-center">4</div>
                                        Upload Logo
                                    </h2>
                                    <label className="relative block cursor-pointer group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <div className="w-full h-32 bg-slate-50 dark:bg-slate-950/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/20 group-hover:border-violet-500 transition-colors flex justify-center items-center flex-col overflow-hidden">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="preview"
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            ) : (
                                                <>
                                                    <MdCloudUpload className="text-slate-400 group-hover:text-violet-500 transition-colors mb-2" size={32} />
                                                    <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Browse your file</h5>
                                                    <h6 className="text-xs text-slate-500 mt-1">Max size 5MB</h6>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="bg-white/80 dark:bg-slate-900/50 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                                <h2 className="text-slate-800 dark:text-white text-lg lg:text-xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">5</div>
                                    Description
                                </h2>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Provide details about the rules, themes, and expectations..."
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 p-5 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-white/10 outline-none resize-none focus:ring-2 focus:ring-violet-500 transition-all font-medium mb-6 custom-scrollbar"
                                />

                                <h2 className="text-slate-800 dark:text-white text-lg lg:text-xl font-bold mb-6 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center">6</div>
                                    External Links
                                </h2>
                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 focus-within:ring-2 ring-indigo-500 transition-all">
                                    <Globe className="text-slate-400 flex-shrink-0" size={20} />
                                    <input
                                        name="websiteLink"
                                        value={form.websiteLink}
                                        onChange={handleChange}
                                        type="url"
                                        placeholder="Hackathon Website Link"
                                        className="bg-transparent w-full text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 dark:text-red-400 font-medium px-2">{error}</p>}

                            {/* SUBMIT BUTTON */}
                            <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-4 border-t border-slate-200 dark:border-white/10">
                                <button
                                    onClick={handleclear}
                                    className="cursor-pointer bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition-all px-8 py-3.5 rounded-xl text-slate-700 dark:text-slate-300 font-bold w-full sm:w-auto"
                                >
                                    Clear Form
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="cursor-pointer bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 active:scale-95 transition-all shadow-lg dark:shadow-[0_0_20px_rgba(124,58,237,0.3)] px-8 py-3.5 rounded-xl text-white font-bold w-full sm:w-auto flex justify-center items-center gap-2"
                                >
                                    Submit Hackathon <Trophy size={18} />
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}