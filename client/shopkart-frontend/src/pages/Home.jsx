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
        <div className="min-h-screen bg-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
                
                {/* Customer Profile Card - Amazon Your Account Style */}
                <div className="w-full bg-white rounded-lg border border-zinc-300 shadow-xs p-5 sm:p-7">
                    
                    {/* Header: Avatar, Greeting & Status */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-zinc-200">
                        {/* Avatar */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-900 text-amber-400 font-extrabold text-xl sm:text-2xl flex items-center justify-center border-2 border-amber-400 shrink-0 shadow-xs">
                            {getInitials(user?.fullName)}
                        </div>

                        {/* Welcome & Info */}
                        <div className="text-center sm:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
                                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                    Customer Account
                                </span>
                                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Active Session
                                </span>
                            </div>

                            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                                Hello, {user?.fullName || 'Customer'}
                            </h1>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Signed in securely via HttpOnly cookie authentication.
                            </p>
                        </div>
                    </div>

                    {/* Customer Information Grid */}
                    <div className="mt-5">
                        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2.5">
                            Account Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Full Name */}
                            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                                <span className="text-[10px] font-semibold text-zinc-500 block mb-0.5">Full Name</span>
                                <p className="text-sm font-bold text-zinc-900 truncate">
                                    {user?.fullName || 'Not available'}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                                <span className="text-[10px] font-semibold text-zinc-500 block mb-0.5">Email Address</span>
                                <p className="text-sm font-bold text-zinc-900 truncate" title={user?.email}>
                                    {user?.email || 'Not available'}
                                </p>
                            </div>

                            {/* Phone Number */}
                            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                                <span className="text-[10px] font-semibold text-zinc-500 block mb-0.5">Phone Number</span>
                                <p className="text-sm font-bold text-zinc-900 truncate">
                                    {user?.phone || 'Not available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Clean Minimal Footer */}
            <footer className="bg-zinc-900 border-t border-zinc-800 py-5 text-center text-xs text-zinc-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p>© 2026 ShopKart, Inc. or its affiliates. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
