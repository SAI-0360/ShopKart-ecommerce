import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: ""
    });
    const [loader, setLoader] = useState(false)

    const handleChange = (e) => {
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setLoader(true)
        try {
            const res = await api.post('/customers/register', form)
            setLoader(false)

            navigate('/home') // Redirect to home page after successful registration
            console.log('User registered !')
        } catch (error) {
            setLoader(false)
            console.log(error.message)
        }

    }

    return (
        <div className="relative min-h-screen bg-slate-50/60 flex items-center justify-center p-4 overflow-hidden selection:bg-violet-500 selection:text-white">
            {/* Ambient Background Light Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[340px] bg-gradient-to-tr from-violet-200/50 via-purple-100/40 to-indigo-100/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-24 w-72 h-72 bg-violet-100/40 rounded-full blur-3xl"></div>
            </div>

            {/* Main Card */}
            <div className="relative w-full max-w-[390px] bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_16px_40px_-12px_rgba(99,102,241,0.12)] border border-slate-100/80 ring-1 ring-slate-900/[0.03] p-6 sm:p-7">

                {/* Logo & Heading */}
                <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 ring-4 ring-violet-50 mb-3 transition-transform duration-300 hover:scale-105">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h1>
                    <p className="text-xs text-slate-500 mt-1">Join ShopKart to get started.</p>
                </div>

                {/* Pill Tabs */}
                <div className="flex bg-slate-100/80 p-1 rounded-xl mb-5 border border-slate-200/50">
                    <div className="flex-1 py-1.5 text-center text-xs font-semibold rounded-lg bg-white text-slate-900 shadow-sm border border-slate-200/60 transition-all">
                        Sign up
                    </div>
                    <Link to="/login" className="flex-1 py-1.5 text-center text-xs font-medium rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
                        Log in
                    </Link>
                </div>

                {/* Form */}
                <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">

                    {/* Full Name */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-200">
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <input
                            id="fullName"
                            name='fullName'
                            type="text"
                            placeholder="Full Name"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 text-xs sm:text-sm font-normal"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-200">
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            name='email'
                            type="email"
                            placeholder="Email Address"
                            readOnly
                            onFocus={(e) => e.target.readOnly = false}
                            autoComplete="off"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 text-xs sm:text-sm font-normal"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-200">
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            name='password'
                            type="password"
                            placeholder="Password (min 6 chars)"
                            readOnly
                            onFocus={(e) => e.target.readOnly = false}
                            autoComplete="new-password"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 text-xs sm:text-sm font-normal"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-200">
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                        </div>
                        <input
                            id="phone"
                            name='phone'
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200 text-xs sm:text-sm font-normal"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-xs sm:text-sm shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        disabled={loader}
                    >
                        {loader ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </>
                        ) : 'Create Account'}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default Register;