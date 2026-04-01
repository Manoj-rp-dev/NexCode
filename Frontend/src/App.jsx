import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import Login from "./Forparticipants/Login";
import Signup from "./Forparticipants/Signup";
import ForgotPassword from "./Forparticipants/ForgotPassword";
import JoinHackathon from "./Forparticipants/JoinHackathon";
import Hero from "./Hero.jsx";
import Profile from "./Profile.jsx";
import Resources from "./Resources.jsx";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import LoginSection from "./LoginSection.jsx";
import SignupSection from "./SignupSection.jsx";
import HostLogin from "./HostLogin.jsx";
import HostSignup from "./HostSignup.jsx";
import Host from "./Host.jsx";
import About from "./About.jsx";
import HostProfile from "./HostProfile.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminLogin from "./AdminLogin.jsx";

function App() {
  return (
    <>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<LoginSection />} />
          <Route path="/signup" element={<SignupSection />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/join" element={<JoinHackathon />} />
          <Route path="/plogin" element={<Login/>} />
          <Route path="/psignup" element={<Signup/>} />
          <Route path="/pforgot-password" element={<ForgotPassword/>} />
          <Route path="/hlogin" element={<HostLogin/>} />
          <Route path="/hsignup" element={<HostSignup/>} />
          <Route path="/host" element={<Host/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/host-profile" element={<HostProfile/>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
    </>
  );
}

export default App;
