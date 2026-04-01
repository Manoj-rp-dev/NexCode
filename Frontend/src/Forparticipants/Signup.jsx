import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Logo from './Logo';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const res = await fetch("https://localhost:7109/api/ParticipantsSignUp/Signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: data.firstName,
          lastname: data.lastName,
          email: data.email,
          dob: data.dob,
          degree: data.degree,
          collegename: data.college,
          username: data.username,
          password: data.password,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setMessage({ type: 'success', text: result.message || 'Signup successful!' });
        setTimeout(()=>{
          navigate('/')
        },1000);
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };   

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const inputClass =
    'w-full h-12 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-950/50 rounded-xl px-4 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-violet-500 dark:focus:border-fuchsia-500 focus:ring-1 focus:ring-violet-500 dark:focus:ring-fuchsia-500 transition-all shadow-inner';
  const errorClass =
    'h-5 text-red-500 dark:text-red-400 text-xs font-medium mt-1 ml-1 text-left';

  return (
    <div className='w-full min-h-screen flex justify-center flex-col items-center relative bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500 overflow-hidden py-10'>
      
      {/* Background Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-violet-500/20 dark:bg-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-cyan-500/20 dark:bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className='flex justify-center mb-8 cursor-pointer z-10 hover:scale-105 transition-transform duration-300'>
        <Logo className='h-20' />
      </div>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className='z-10 w-[95vw] lg:w-full max-w-md lg:max-w-3xl flex flex-col border border-slate-200 dark:border-white/10 rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl p-8 lg:p-12'>
        
        <div className='text-3xl text-center font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-cyan-400'>
          Participant SignUp
        </div>
        
        {message.text && (
          <div className={`mb-6 p-3 rounded-lg text-sm font-semibold text-center border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
            {message.text}
          </div>
        )}
        
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4'>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
            <input
              className={inputClass}
              placeholder='Enter your first name'
              {...register('firstName', { required: 'First name is required' })} />
            <p className={errorClass}>{errors.firstName?.message}</p>
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
            <input
              className={inputClass}
              placeholder='Enter your last name'
              {...register('lastName', { required: 'Last name is required' })} />
            <p className={errorClass}>{errors.lastName?.message}</p>
          </div>
        
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-2 lg:mt-0">Email Address</label>
            <input
              type='email'
              className={inputClass}
              placeholder='name@example.com'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email',
                },
              })} />
            <p className={errorClass}>{errors.email?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-2 lg:mt-0">Date of Birth</label>
            <input
              type='date'
              className={`${inputClass} cursor-pointer`}
              {...register('dob', { required: 'Date of birth is required' })} />
            <p className={errorClass}>{errors.dob?.message}</p>
          </div>
       
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-2 lg:mt-0">Degree</label>
            <input
              className={inputClass}
              placeholder='e.g. B.Tech Computer Science'
              {...register('degree', { required: 'Degree is required' })} />
            <p className={errorClass}>{errors.degree?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-2 lg:mt-0">College Name</label>
            <input
              className={inputClass}
              placeholder='Enter your college name'
              {...register('college', { required: 'College name is required' })} />
            <p className={errorClass}>{errors.college?.message}</p>
          </div>
       
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-2 lg:mt-0">Username</label>
            <input
              className={inputClass}
              placeholder='Choose a username'
              {...register('username', { required: 'Username is required' })} />
            <p className={errorClass}>{errors.username?.message}</p>
          </div>
          <div>
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-2 lg:mt-0">Password</label>
            <input
              type='password'
              className={inputClass}
              placeholder='Create a strong password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 characters',
                },
              })}
            />
            <p className={errorClass}>{errors.password?.message}</p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-white font-bold tracking-wide shadow-lg transition-all transform active:scale-95 cursor-pointer ${
              isLoading 
                ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500 dark:shadow-[0_0_20px_rgba(124,58,237,0.3)]'
            }`}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <div className='flex justify-center items-center text-sm font-medium text-slate-600 dark:text-slate-400 mt-6 pb-2'>
          Already have an account?
          <Link to="/pLogin" className='text-violet-600 dark:text-cyan-400 font-bold ml-1 hover:underline'>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;