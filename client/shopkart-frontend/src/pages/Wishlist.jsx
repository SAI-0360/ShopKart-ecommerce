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
        <div className="min-h-screen bg-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">

                {/* Header Card */}
                <div className="bg-white rounded-lg border border-zinc-300 p-4 sm:p-5 shadow-xs mb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
                                    Your Wishlist
                                </h1>
                                {!loading && !error && (
                                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
                                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Saved products are stored with your account for easy future checkout.
                            </p>
                        </div>

                        {/* Continue Shopping Link */}
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs transition-all active:scale-95"
                        >
                            <span>Continue Shopping</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-3 border-zinc-200 border-t-amber-400 rounded-full animate-spin mb-2.5"></div>
                        <p className="text-xs text-zinc-600 font-medium">Loading your wishlist items...</p>
                    </div>
                )}

                {/* 2. Error State */}
                {error && !loading && (
                    <div className="text-center py-14 bg-white rounded-lg border border-red-300 shadow-sm p-6 max-w-md mx-auto">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2.5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900">Failed to load wishlist</h3>
                        <p className="text-xs text-zinc-600 mt-1 mb-4">{error}</p>
                        <button
                            onClick={loadWishlist}
                            className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* 3. Empty State */}
                {!loading && !error && wishlist.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg border border-zinc-300 shadow-xs p-6 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 stroke-zinc-400 fill-none" viewBox="0 0 24 24" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900">Your Wishlist is empty</h3>
                        <p className="text-xs text-zinc-500 mt-1 mb-5 max-w-xs mx-auto leading-relaxed">
                            Explore the store and click the heart icon on any product to save it here for later.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs font-bold border border-amber-500 shadow-xs transition-all active:scale-95"
                        >
                            <span>Explore Products</span>
                        </Link>
                    </div>
                )}

                {/* 4. Wishlist Grid */}
                {!loading && !error && wishlist.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
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
            <footer className="bg-zinc-900 border-t border-zinc-800 py-5 text-center text-xs text-zinc-400 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p>© 2026 ShopKart, Inc. or its affiliates. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Wishlist;
