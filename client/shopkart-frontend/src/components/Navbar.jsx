import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        if (!user) {
            setWishlistCount(0);
            return;
        }

        const update = async () => {
            try {
                const res = await api.get('/wishlist');
                setWishlistCount(res.data.count || 0);
            } catch {
                setWishlistCount(0);
            }
        };

        update();
        window.addEventListener('wishlistUpdated', update);
        return () => window.removeEventListener('wishlistUpdated', update);
    }, [user]);


    const handleLogout = async () => {
        try {
            await api.post('/customers/logout'); // Clears cookie on backend
            setUser(null); // Clear context state
            setWishlistCount(0);
            navigate('/login');
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };


    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 gap-4">

                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Shop<span className="text-violet-600">Kart</span>
                        </span>
                    </Link>

                    {/* Simple Nav Links */}
                    <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
                        <Link
                            to="/home"
                            className={`cursor-pointer transition-colors ${location.pathname === '/home'
                                    ? 'text-violet-600 font-semibold'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className={`cursor-pointer transition-colors ${location.pathname.startsWith('/products')
                                    ? 'text-violet-600 font-semibold'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Products
                        </Link>
                        <Link
                            to="/wishlist"
                            className={`cursor-pointer transition-colors inline-flex items-center gap-1.5 ${location.pathname.startsWith('/wishlist')
                                    ? 'text-violet-600 font-semibold'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <span>Wishlist {user ? `(${wishlistCount})` : ''}</span>
                        </Link>
                    </nav>

                    {/* Right Side: User Info & Logout Button */}
                    <div className="flex items-center gap-3">
                        {/* Mobile Wishlist Link with Badge */}
                        <Link
                            to="/wishlist"
                            className="sm:hidden relative p-2 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                            title={user ? `Wishlist (${wishlistCount})` : "Wishlist"}
                            aria-label="Wishlist"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            {wishlistCount > 0 ? (
                                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            ) : null}
                        </Link>
                        {/* User Badge */}
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
                            <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center">
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                                {user?.fullName || "User"}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 text-rose-600 text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Navbar;
