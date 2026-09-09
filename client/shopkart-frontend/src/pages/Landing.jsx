import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-50/70 flex flex-col selection:bg-violet-500 selection:text-white relative overflow-hidden">
            {/* Ambient Background Light Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-gradient-to-tr from-violet-200/50 via-purple-100/40 to-indigo-100/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-24 w-72 h-72 bg-violet-100/40 rounded-full blur-3xl"></div>
            </div>

            {/* Top Navigation */}
            <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Shop<span className="text-violet-600">Kart</span>
                        </span>
                    </div>

                    {/* Auth Nav Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-medium shadow-sm shadow-violet-500/20 hover:shadow transition-all active:scale-95"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 self-center px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/70 text-violet-700 text-xs font-semibold mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
                    Next-Gen E-Commerce Experience
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight sm:leading-tight">
                    Shop Smarter, Faster & Better with <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">ShopKart</span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                    Explore curated tech, audio, and everyday lifestyle essentials with seamless customer authentication and instant access.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xs sm:max-w-md mx-auto w-full">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium shadow-md shadow-violet-500/25 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Get Started — Register</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50/90 text-slate-800 text-sm font-medium border border-slate-200 shadow-sm hover:border-slate-300 transition-all active:scale-95"
                    >
                        Log In to Account
                    </Link>
                </div>

                {/* Showcase Cards (Clean & Simple) */}
                <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
                    <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Secure Sessions</h3>
                        <p className="text-xs text-slate-500 mt-1">HttpOnly cookie authentication keeping your credentials and tokens safe.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Instant Access</h3>
                        <p className="text-xs text-slate-500 mt-1">Protected customer dashboards that verify sessions without page reloads.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Curated Catalog</h3>
                        <p className="text-xs text-slate-500 mt-1">Explore popular electronics, wearables, and audio gear in real time.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200/80 bg-white/60 py-4 text-center">
                <p className="text-xs text-slate-500">
                    © 2026 ShopKart. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Landing;