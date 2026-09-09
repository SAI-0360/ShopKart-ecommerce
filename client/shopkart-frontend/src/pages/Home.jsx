import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden">
            {/* Ambient Background Light Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[340px] bg-gradient-to-tr from-violet-200/40 via-purple-100/30 to-indigo-100/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex items-center justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
                
                {/* Big Customer Profile Card */}
                <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-[0_16px_40px_-12px_rgba(99,102,241,0.1)] p-6 sm:p-10">
                    
                    {/* Header: Avatar, Greeting & Status */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-8 border-b border-slate-100">
                        {/* Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-violet-500/25 ring-4 ring-violet-50">
                            {getInitials(user?.fullName)}
                        </div>

                        {/* Welcome & Info */}
                        <div className="text-center sm:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                                <span className="text-[11px] font-semibold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-md border border-violet-100 uppercase tracking-wider">
                                    Customer Dashboard
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Active Session
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Welcome back, <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{user?.fullName || 'Customer'}</span>! 👋
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Successfully authenticated via HttpOnly cookie session.
                            </p>
                        </div>
                    </div>

                    {/* Customer Information Grid */}
                    <div className="mt-8">
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                            Account Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Full Name */}
                            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <span className="text-xs font-medium text-slate-500">Full Name</span>
                                </div>
                                <p className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                                    {user?.fullName || 'Not available'}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                    <span className="text-xs font-medium text-slate-500">Email Address</span>
                                </div>
                                <p className="text-sm sm:text-base font-semibold text-slate-900 truncate" title={user?.email}>
                                    {user?.email || 'Not available'}
                                </p>
                            </div>

                            {/* Phone Number */}
                            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    <span className="text-xs font-medium text-slate-500">Phone Number</span>
                                </div>
                                <p className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                                    {user?.phone || 'Not available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Clean Minimal Footer */}
            <footer className="relative z-10 border-t border-slate-200 bg-white/60 py-4 text-center">
                <p className="text-xs text-slate-500">
                    © 2026 ShopKart. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;
