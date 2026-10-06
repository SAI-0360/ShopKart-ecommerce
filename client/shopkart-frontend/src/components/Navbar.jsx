import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, setUser } = useAuth();
    const { totalItems } = useCart();
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
        <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 text-white shadow-sm outline-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14 gap-4">

                    {/* Logo - Amazon Two-Tone Style (Compact) */}
                    <Link to="/home" className="flex items-center gap-2 cursor-pointer group select-none outline-none focus:outline-none">
                        <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-900 flex items-center justify-center font-bold shadow-xs transition-transform duration-200 group-hover:scale-105">
                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">
                            Shop<span className="text-amber-400">Kart</span>
                        </span>
                    </Link>

                    {/* Simple Nav Links */}
                    <nav className="hidden sm:flex items-center gap-1 text-[13px] font-semibold">
                        <Link
                            to="/home"
                            className={`cursor-pointer transition-colors px-3 py-1.5 rounded-md ${location.pathname === '/home'
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className={`cursor-pointer transition-colors px-3 py-1.5 rounded-md ${location.pathname.startsWith('/products')
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                                }`}
                        >
                            Products
                        </Link>
                        <Link
                            to="/wishlist"
                            className={`cursor-pointer transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md ${location.pathname.startsWith('/wishlist')
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                                }`}
                        >
                            <span>Wishlist</span>
                            {user && wishlistCount > 0 ? (
                                <span className="bg-amber-400 text-zinc-900 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                                    {wishlistCount}
                                </span>
                            ) : null}
                        </Link>
                        <Link
                            to="/cart"
                            className={`cursor-pointer transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md ${location.pathname.startsWith('/cart')
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                                }`}
                        >
                            <span>Cart</span>
                            {user && totalItems > 0 ? (
                                <span className="bg-amber-400 text-zinc-900 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                                    {totalItems}
                                </span>
                            ) : null}
                        </Link>
                    </nav>

                    {/* Right Side: User Info & Logout Button */}
                    <div className="flex items-center gap-2.5">
                        {/* Mobile Cart Link with Badge */}
                        <Link
                            to="/cart"
                            className="sm:hidden relative p-1.5 text-zinc-300 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-colors"
                            title={user ? `Cart (${totalItems})` : "Cart"}
                            aria-label="Cart"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            {user && totalItems > 0 ? (
                                <span className="absolute top-0 right-0 min-w-3.5 h-3.5 px-1 rounded-full bg-amber-400 text-zinc-900 text-[9px] font-extrabold flex items-center justify-center">
                                    {totalItems}
                                </span>
                            ) : null}
                        </Link>
                        {/* Mobile Wishlist Link with Badge */}
                        <Link
                            to="/wishlist"
                            className="sm:hidden relative p-1.5 text-zinc-300 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-colors"
                            title={user ? `Wishlist (${wishlistCount})` : "Wishlist"}
                            aria-label="Wishlist"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            {wishlistCount > 0 ? (
                                <span className="absolute top-0 right-0 min-w-3.5 h-3.5 px-1 rounded-full bg-amber-400 text-zinc-900 text-[9px] font-extrabold flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            ) : null}
                        </Link>
                        {/* User Badge - Amazon "Hello, User" Style */}
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-800/90 border border-zinc-700/60">
                            <div className="w-5.5 h-5.5 rounded-full bg-amber-400 text-zinc-900 font-extrabold text-[11px] flex items-center justify-center">
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex flex-col text-left hidden sm:flex">
                                <span className="text-[9px] text-zinc-400 leading-none">Hello,</span>
                                <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[110px]">
                                    {user?.fullName || "User"}
                                </span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-zinc-700 hover:border-amber-400 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold cursor-pointer transition-all active:scale-95"
                        >
                            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
