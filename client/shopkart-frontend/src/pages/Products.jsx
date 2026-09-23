import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
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
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Something went wrong while fetching products.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, category]);

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
                
                {/* Header & Controls Bar */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm mb-8">
                    
                    {/* Title & Product Count */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
                                Explore Store
                            </span>
                            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                                Product Catalog
                            </h1>
                        </div>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-center">
                            Showing <span className="font-semibold text-slate-900">{products.length}</span> {products.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {/* Search & Category Filter Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        
                        {/* Search Input */}
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products by name..."
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="w-full sm:w-56">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all cursor-pointer font-medium"
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

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">Loading products catalog...</p>
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
                        <h3 className="text-sm font-bold text-slate-900">Failed to load</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* 3. Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">No products found</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                            Try adjusting your search terms or category filter.
                        </p>
                        {(search || category !== 'All') && (
                            <button
                                onClick={() => { setSearch(''); setCategory('All'); }}
                                className="px-4 py-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold hover:bg-violet-100 transition-all cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* 4. Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map((item) => (
                            <ProductCard key={item._id} product={item} />
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

export default Products;