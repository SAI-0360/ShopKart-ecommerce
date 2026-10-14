import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || 'All';

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);

    const [wishListIds, setWishListIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sync state whenever URL query params change (e.g. user searches via Navbar)
    useEffect(() => {
        const querySearch = searchParams.get('search');
        if (querySearch !== null && querySearch !== search) {
            setSearch(querySearch);
        }
        const queryCategory = searchParams.get('category');
        if (queryCategory !== null && queryCategory !== category) {
            setCategory(queryCategory);
        }
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (search.trim()) {
                params.search = search.trim();
            }
            if (category && category !== 'All') {
                params.category = category;
            }

            const productsData = await api.get('/products', { params });
            setProducts(productsData.data.products || []);

            try {
                const wishListData = await api.get('/wishlist');
                setWishListIds(wishListData.data.wishlist.map(item => item._id));
            } catch {
                setWishListIds([]);
            }
        }
        catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message || 'Something went wrong while fetching products.');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, category]);

    const handleClearSearch = () => {
        setSearch('');
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete('search');
            return next;
        });
    };

    const handleResetAll = () => {
        setSearch('');
        setCategory('All');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Global Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">

                {/* Prominent Search & Category Filter Card */}
                <div className="bg-white rounded-xl border border-zinc-200/90 p-4 sm:p-5 shadow-xs mb-4 sm:mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                                Product Catalog
                            </h1>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Browse all available items with real-time stock
                            </p>
                        </div>

                        {/* Search & Category Filter Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
                            {/* Search Input Box */}
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products by title or keyword..."
                                    className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-zinc-300 bg-zinc-50/70 hover:bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25 transition-all shadow-2xs"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 cursor-pointer text-sm font-bold"
                                        title="Clear search"
                                        aria-label="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Category Dropdown */}
                            <div className="w-full sm:w-52 shrink-0">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full py-2.5 px-3 rounded-lg border border-zinc-300 bg-zinc-50/70 hover:bg-white text-zinc-900 text-xs sm:text-sm font-semibold focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-400/25 transition-all cursor-pointer shadow-2xs"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Wearables">Wearables</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Counter & Active Filter Tags */}
                    <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                        <div className="flex items-center gap-1.5">
                            <span>Showing <strong className="text-zinc-900 font-bold">{products.length}</strong> {products.length === 1 ? 'item' : 'items'}</span>
                            {category !== 'All' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                                    {category}
                                </span>
                            )}
                        </div>

                        {(search || category !== 'All') && (
                            <button
                                onClick={handleResetAll}
                                className="text-amber-600 hover:text-amber-700 font-bold hover:underline cursor-pointer text-xs flex items-center gap-1"
                            >
                                <span>Reset filters</span>
                                <span>✕</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-3 border-zinc-200 border-t-amber-400 rounded-full animate-spin mb-2.5"></div>
                        <p className="text-xs text-zinc-600 font-medium">Loading products catalog...</p>
                    </div>
                )}

                {/* 2. Error State */}
                {error && !loading && (
                    <div className="text-center py-14 bg-white rounded-xl border border-red-200 shadow-xs p-6 max-w-md mx-auto">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2.5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900">Error loading catalog</h3>
                        <p className="text-xs text-zinc-600 mt-1 mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* 3. Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-zinc-200 shadow-xs p-6 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 stroke-zinc-400 fill-none" viewBox="0 0 24 24" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900">No matching products found</h3>
                        <p className="text-xs text-zinc-500 mt-1 mb-5 leading-relaxed max-w-xs mx-auto">
                            We couldn't find any products matching your query. Try searching for different keywords or resetting categories.
                        </p>
                        {(search || category !== 'All') && (
                            <button
                                onClick={handleResetAll}
                                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs cursor-pointer transition-all active:scale-95"
                            >
                                Reset Search Filters
                            </button>
                        )}
                    </div>
                )}

                {/* 4. Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
                        {products.map((item) => (
                            <ProductCard 
                                key={item._id}
                                product={item}
                                wasWishlisted={wishListIds.includes(item._id)}
                            />
                        ))}
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="bg-zinc-900 border-t border-zinc-800 py-6 text-center text-xs text-zinc-400 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p>© 2026 ShopKart, Inc. or its affiliates. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Products;