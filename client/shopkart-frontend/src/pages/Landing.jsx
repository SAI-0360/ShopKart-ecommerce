import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Top Navigation Bar - Amazon Dark Style */}
            <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-sm outline-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 select-none outline-none focus:outline-none">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-900 flex items-center justify-center font-bold shadow-xs">
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">
                            Shop<span className="text-amber-400">Kart</span>
                        </span>
                    </Link>

                    {/* Auth Nav Buttons */}
                    <div className="flex items-center gap-2.5">
                        <Link
                            to="/login"
                            className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs sm:text-sm font-bold border border-amber-500 shadow-xs transition-all active:scale-95"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Hero Section */}
            <main className="flex-1 flex flex-col justify-center max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight max-w-3xl mx-auto leading-tight">
                    Online Shopping Made Simple, Fast & Reliable
                </h1>

                {/* Subtitle */}
                <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
                    Explore high quality electronics, wearables, audio gear, and everyday lifestyle essentials with instant ordering and saved wishlists.
                </p>

                {/* CTA Buttons - Amazon Theme */}
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm sm:max-w-md mx-auto w-full">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs sm:text-sm font-bold border border-amber-500 shadow-xs hover:shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                        <span>Start Shopping — Register</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-white hover:bg-zinc-50 text-zinc-900 text-xs sm:text-sm font-bold border border-zinc-300 shadow-xs transition-all active:scale-95"
                    >
                        Sign in to Account
                    </Link>
                </div>

                {/* Feature Cards - High Readability */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs hover:border-amber-400 transition-colors">
                        <div className="w-9 h-9 rounded-md bg-zinc-900 text-amber-400 flex items-center justify-center mb-3">
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900">Secure Account</h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Protected with encrypted session cookies so your data and account stay safe.</p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs hover:border-amber-400 transition-colors">
                        <div className="w-9 h-9 rounded-md bg-zinc-900 text-amber-400 flex items-center justify-center mb-3">
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900">Real-Time Wishlist</h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Save items with one click and see counters update automatically without page refresh.</p>
                    </div>

                    <div className="p-5 rounded-lg bg-white border border-zinc-200 shadow-xs hover:border-amber-400 transition-colors">
                        <div className="w-9 h-9 rounded-md bg-zinc-900 text-amber-400 flex items-center justify-center mb-3">
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900">Stock Availability</h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Live stock tracking ensures you always know when products are ready to ship.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-zinc-900 border-t border-zinc-800 py-5 text-center text-xs text-zinc-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p>© 2026 ShopKart. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;