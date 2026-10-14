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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [navSearch, setNavSearch] = useState('');

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

    // Close mobile menu on page navigation
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

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

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const term = navSearch.trim();
        if (term) {
            navigate(`/products?search=${encodeURIComponent(term)}`);
        } else {
            navigate('/products');
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                
                {/* Main Top Header Bar */}
                <div className="flex items-center justify-between h-14 sm:h-16 gap-3">

                    {/* Left: Mobile Hamburger Toggle + Brand Logo */}
                    <div className="flex items-center gap-2.5">
                        {/* Hamburger Button (Mobile only) */}
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="sm:hidden p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 focus:outline-none transition-colors cursor-pointer"
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>

                        {/* Brand Logo - Amazon Two-Tone Style */}
                        <Link to="/home" className="flex items-center gap-2 group select-none">
                            <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-900 flex items-center justify-center font-bold shadow-xs transition-transform duration-200 group-hover:scale-105">
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </div>
                            <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                                Shop<span className="text-amber-400">Kart</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Global Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-3">
                        <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                            <input
                                type="text"
                                value={navSearch}
                                onChange={(e) => setNavSearch(e.target.value)}
                                placeholder="Search products in ShopKart..."
                                className="w-full pl-9 pr-10 py-1.5 rounded-lg bg-zinc-800/95 border border-zinc-700 text-white placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                title="Search"
                                className="absolute inset-y-0 right-0 px-3 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-r-lg transition-colors flex items-center justify-center cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden sm:flex items-center gap-1 text-[13px] font-semibold">
                        <Link
                            to="/home"
                            className={`cursor-pointer transition-colors px-2.5 py-1.5 rounded-md ${
                                location.pathname === '/home'
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className={`cursor-pointer transition-colors px-2.5 py-1.5 rounded-md ${
                                location.pathname.startsWith('/products')
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                            }`}
                        >
                            Products
                        </Link>
                        <Link
                            to="/wishlist"
                            className={`cursor-pointer transition-colors inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md ${
                                location.pathname.startsWith('/wishlist')
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                            }`}
                        >
                            <span>Wishlist</span>
                            {user && wishlistCount > 0 && (
                                <span className="bg-amber-400 text-zinc-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/cart"
                            className={`cursor-pointer transition-colors inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md ${
                                location.pathname.startsWith('/cart')
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                            }`}
                        >
                            <span>Cart</span>
                            {user && totalItems > 0 && (
                                <span className="bg-amber-400 text-zinc-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/orders"
                            className={`cursor-pointer transition-colors px-2.5 py-1.5 rounded-md ${
                                location.pathname.startsWith('/orders')
                                    ? 'text-amber-400 bg-zinc-800 font-bold'
                                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                            }`}
                        >
                            Orders
                        </Link>
                    </nav>

                    {/* Right Side: Quick Action Badges & User Profile */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Quick Wishlist Link */}
                        <Link
                            to="/wishlist"
                            className="sm:hidden relative p-1.5 text-zinc-300 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-colors"
                            title={user ? `Wishlist (${wishlistCount})` : "Wishlist"}
                            aria-label="Wishlist"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-zinc-900 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Quick Cart Link */}
                        <Link
                            to="/cart"
                            className="sm:hidden relative p-1.5 text-zinc-300 hover:text-amber-400 rounded-lg hover:bg-zinc-800 transition-colors"
                            title={user ? `Cart (${totalItems})` : "Cart"}
                            aria-label="Cart"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            {user && totalItems > 0 && (
                                <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-zinc-900 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Profile Badge (Desktop) */}
                        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-800/90 border border-zinc-700/60">
                            <div className="w-5.5 h-5.5 rounded-full bg-amber-400 text-zinc-900 font-extrabold text-[11px] flex items-center justify-center shadow-xs">
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[9px] text-zinc-400 leading-none">Hello,</span>
                                <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">
                                    {user?.fullName || "User"}
                                </span>
                            </div>
                        </div>

                        {/* Logout Button (Desktop only) */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-zinc-700 hover:border-amber-400 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer transition-all active:scale-95"
                        >
                            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>

                </div>

                {/* Mobile Search Bar Row (Always clearly visible on Mobile & Tablet) */}
                <div className="md:hidden pb-3 pt-0.5">
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={navSearch}
                            onChange={(e) => setNavSearch(e.target.value)}
                            placeholder="Search products in ShopKart..."
                            className="w-full pl-9.5 pr-11 py-2 rounded-lg bg-zinc-800/90 border border-zinc-700 text-white placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <button
                            type="submit"
                            title="Search"
                            className="absolute inset-y-0 right-0 px-3 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-r-lg transition-colors flex items-center justify-center cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </form>
                </div>

            </div>

            {/* Mobile Dropdown Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-3 space-y-1 shadow-xl animate-fadeIn">
                    <div className="pb-2 mb-2 border-b border-zinc-800/80 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-zinc-900 font-extrabold text-xs flex items-center justify-center">
                            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <span className="text-[10px] text-zinc-400 block leading-tight">Signed in as</span>
                            <span className="text-xs font-bold text-white block leading-tight">{user?.fullName || "User"}</span>
                        </div>
                    </div>

                    <Link
                        to="/home"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            location.pathname === '/home' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/products"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            location.pathname.startsWith('/products') ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <span>Products Catalog</span>
                    </Link>

                    <Link
                        to="/wishlist"
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            location.pathname.startsWith('/wishlist') ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            <span>My Wishlist</span>
                        </div>
                        {wishlistCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-zinc-800 text-amber-400 border border-zinc-700">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/cart"
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            location.pathname.startsWith('/cart') ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <span>Shopping Cart</span>
                        </div>
                        {totalItems > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-zinc-800 text-amber-400 border border-zinc-700">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/orders"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            location.pathname.startsWith('/orders') ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                        <span>My Orders</span>
                    </Link>

                    {/* Mobile Sign Out / Logout */}
                    <div className="pt-2 mt-2 border-t border-zinc-800/80">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                            <span>Sign Out / Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
