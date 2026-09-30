import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const [wishListIds, setWishListIds] = useState([]); // needed for wishlist highlight in prouct cards.
    // when not used in the product card, the heart icon will always be in the default state (not highlighted) even if the product is in the wishlist.

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (search.trim()) {
                params.search = search.trim();
            }
            if (category && category !== 'All') {
                // not All is needed because we don't want to filter by category if the user selects All
                params.category = category;
            }

            const productsData = await api.get('/products', { params });
            setProducts(productsData.data.products);

            // Fetch wishlist data safely without blocking catalog display
            try {
                const wishListData = await api.get('/wishlist');
                setWishListIds(wishListData.data.wishlist.map(item => item._id));
            } catch (wishlistErr) {
                // If user is not logged in or wishlist fails, default to empty list
                setWishListIds([]);
            }
        }
        catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Something went wrong while fetching products.');
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, category]);

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">

                {/* Amazon-Style Search & Filters Bar */}
                <div className="bg-white rounded-lg border border-zinc-300 p-3.5 sm:p-4 shadow-xs mb-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 leading-tight">
                                Product Catalog
                            </h1>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Browse all available items in the store
                            </p>
                        </div>

                        {/* Search & Category Filter */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 max-w-xl">
                            {/* Search Input with Amazon-style amber accent */}
                            <div className="relative flex-1 w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products by title or keywords..."
                                    className="w-full pl-9 pr-3 py-1.5 rounded-md border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400/30 transition-all"
                                />
                            </div>

                            {/* Category Dropdown */}
                            <div className="w-full sm:w-48">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full py-1.5 px-2.5 rounded-md border border-zinc-300 bg-zinc-50 text-zinc-900 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400/30 transition-all cursor-pointer"
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

                    {/* Results Counter Sub-bar */}
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                        <span>
                            Showing <strong className="text-zinc-900">{products.length}</strong> {products.length === 1 ? 'result' : 'results'}
                        </span>
                        {(search || category !== 'All') && (
                            <button
                                onClick={() => { setSearch(''); setCategory('All'); }}
                                className="text-amber-700 hover:text-amber-800 font-semibold hover:underline cursor-pointer text-xs"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-3 border-zinc-200 border-t-amber-400 rounded-full animate-spin mb-2.5"></div>
                        <p className="text-xs text-zinc-600 font-medium">Loading catalog results...</p>
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
                        <h3 className="text-sm font-bold text-zinc-900">Error loading catalog</h3>
                        <p className="text-xs text-zinc-600 mt-1 mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* 3. Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg border border-zinc-300 shadow-sm p-6 max-w-md mx-auto">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-2.5">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-zinc-900">No matching products found</h3>
                        <p className="text-xs text-zinc-500 mt-1 mb-4 leading-relaxed">
                            Try searching for something else or reset your category filter.
                        </p>
                        {(search || category !== 'All') && (
                            <button
                                onClick={() => { setSearch(''); setCategory('All'); }}
                                className="px-4 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs cursor-pointer"
                            >
                                Reset Search Filters
                            </button>
                        )}
                    </div>
                )}

                {/* 4. Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                        {products.map((item) => (
                            <ProductCard 
                                key={item._id}
                                product={item}
                                wasWishlisted={wishListIds.includes(item._id)}  // Pass wishlist status to ProductCard
                            />
                        ))}
                    </div>
                )}

            </main>

            {/* Footer - Amazon Dark Style */}
            <footer className="bg-zinc-900 border-t border-zinc-800 py-5 text-center text-xs text-zinc-400 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <p>© 2026 ShopKart, Inc. or its affiliates. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Products;