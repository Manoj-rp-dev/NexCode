import React from 'react'
import LoginSignupSection from './LoginSignupSection'
import Navbar from './Navbar'

const SignupSection = () => {
  const title1 = "Participate Hackathon"
  const title2 = "Host Hackathon"
  const content1 = 'Build projects, improve your skills, collaborate with developers, and showcase your ideas in exciting hackathons.'
  const content2 = 'Create and manage hackathons, discover new talent, share challenges, and inspire innovation in the tech community.'
  const bt1 = 'Login'
  const bt2 = 'SignUp'
  const bg1 = 'bg-white'
  const bg2 = 'bg-gray-900'
  const txt1 = 'text-white'
  const txt2 = 'text-black'
  const h1 = 'Join Hackathons & Build Your Future'
  const h2 = 'Host a Hackathon & Inspire Innovation'
  const r1 = '/plogin'
  const r2 = '/hlogin'
  const r3 = '/psignup'
  const r4 = '/hsignup'
  const homecol='white' 
  return (
    <>
      <LoginSignupSection t1={title2} t2={title1} c1={content2} c2={content1} btn1={bt2} btn2={bt1} bg1={bg2} bg2={bg1} txt1={txt2} txt2={txt1} h1={h1} h2={h2} rout1={r4} rout2={r3} rout3={r2} rout4={r1} homecol={homecol} bottomText="Already have an account?"/>
    </>
  )
}

export default SignupSection