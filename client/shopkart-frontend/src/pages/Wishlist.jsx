import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WishlistCard from '../components/WishlistCard';
import { api } from '../services/api';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isMounted = useRef(true);

    const fetchWishlist = async () => {
        const response = await api.get('/wishlist');
        return response.data.wishlist || [];
    };

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError('');

            const items = await fetchWishlist();
            if (!isMounted.current) return; // Prevent state update if component unmounted

            setWishlist(items);
        } catch (err) {
            if (isMounted.current) {
                setError(err.response?.data?.message || 'Failed to fetch wishlist.');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        isMounted.current = true;
        loadWishlist();

        return () => {
            isMounted.current = false; // Cleanup function to prevent memory leaks on unmount
        };
    }, []);

    const handleRemove = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);

            // Instantly remove from local state without extra api refetch
            setWishlist((prev) => prev.filter((item) => item._id !== productId));

            // Dispatch global event to update Navbar count in real time
            window.dispatchEvent(new Event('wishlistUpdated'));
            
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove product.');
        }
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
            <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">

                {/* Header Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-xs">
                                    <svg className="w-4 h-4 fill-rose-500" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                                    My Wishlist
                                </h1>
                                {!loading && !error && (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Save items you're interested in and review them anytime.
                            </p>
                        </div>

                        {/* Continue Shopping Link */}
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer w-fit active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            <span>Explore More Products</span>
                        </Link>
                    </div>
                </div>

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">Loading your wishlist...</p>
                    </div>
                )}

                {/* 2. Error State */}
                {error && !loading && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-rose-100 shadow-sm p-8 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Failed to load wishlist</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
                        <button
                            onClick={loadWishlist}
                            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* 3. Empty State */}
                {!loading && !error && wishlist.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 max-w-md mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3.5 border border-rose-100">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
                        <p className="text-xs text-slate-500 mt-1.5 mb-5 max-w-xs mx-auto leading-relaxed">
                            Explore our product catalog and click the wishlist button to save products you love.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm shadow-violet-500/20 hover:shadow-violet-500/30 transition-all cursor-pointer active:scale-95"
                        >
                            <span>Browse Products</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                )}

                {/* 4. Wishlist Grid */}
                {!loading && !error && wishlist.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {wishlist.map((item) => (
                            <WishlistCard
                                key={item._id}
                                product={item}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200 bg-white/60 py-4 text-center mt-auto">
                <p className="text-xs text-slate-500">
                    © 2026 ShopKart. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Wishlist;
