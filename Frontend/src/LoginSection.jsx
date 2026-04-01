import React from 'react'
import LoginSignupSection from './LoginSignupSection'
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
const LoginSection = () => {
    const title1 = "Participate Hackathon"
    const title2 = "Host Hackathon"
    const content1 = 'Join our hackathon and build amazing projects with your team,improve your technical skills, collaborate with developers,and create innovative solutions that can impact the real world.'
    const content2 = 'Share your project with mentors and developers, receive valuable feedback, improve your presentation skills, and showcase your creativity to a global audience.'
    const bt1 = 'Login'
    const bt2 = 'SignUp'
    const bg1 = 'bg-white'
    const bg2 = 'bg-gray-900'
    const txt1 = 'text-white'
    const txt2 = 'text-black'
    const h1 = 'Enter the Challenge'
    const h2 = 'Welcome Back, Organizer'
    const r1='/plogin'
    const r2='/hlogin'
    const r3='/psignup'
    const r4='/hsignup'
    const homecol='black' 
    return (
        <>
            
            <LoginSignupSection t1={title2} t2={title1} c1={content2} c2={content1} btn1={bt1} btn2={bt2} bg1={bg1} bg2={bg2} txt1={txt1} txt2={txt2} h1={h1} h2={h2} rout1={r2} rout2={r1} rout3={r4} rout4={r3} homecol={homecol} bottomText="Don't have an account?"/>
        </>
    )
}

export default LoginSection