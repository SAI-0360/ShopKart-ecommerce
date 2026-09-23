import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const ProductDetails = () => {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await api.get(`/products/${id}`);
                setProduct(data.data.product);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.message || 'Product not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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

                {/* Back Button Navigation */}
                <div className="mb-6">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors cursor-pointer group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        <span>Back to Products</span>
                    </Link>
                </div>

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-24 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">Loading product details...</p>
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
                        <h3 className="text-sm font-bold text-slate-900">Product Error</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-5">{error}</p>
                        <Link
                            to="/products"
                            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
                        >
                            Return to Catalog
                        </Link>
                    </div>
                )}

                {/* 3. Product Details Content */}
                {!loading && !error && product && (
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-[0_16px_40px_-12px_rgba(99,102,241,0.1)] p-6 sm:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                            {/* Left: Large Product Image */}
                            <div className="rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200/80 aspect-square max-h-[460px] w-full flex items-center justify-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center"
                                />
                                {/* Stock Status Pill on top of Image */}
                                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border ${product.stock > 0
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                    {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Right: Product Info & Actions */}
                            <div className="flex flex-col justify-between space-y-6">
                                <div>
                                    {/* Category */}
                                    <span className="text-xs uppercase tracking-wider font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1 rounded-md">
                                        {product.category}
                                    </span>

                                    {/* Title */}
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
                                        {product.name}
                                    </h1>

                                    {/* Price */}
                                    <div className="mt-4 flex items-baseline gap-2">
                                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                                            ₹{product.price}
                                        </span>
                                        <span className="text-xs text-slate-400">inclusive of all taxes</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-100 my-6"></div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                            About this product
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                    {/* Add to Cart Button (Lab 3: UI only) */}
                                    <button
                                        type="button"
                                        disabled={product.stock <= 0}
                                        className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.99] text-white text-sm font-semibold shadow-md shadow-violet-500/25 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                        <span>Add to Cart</span>
                                    </button>
                                </div>

                            </div>

                        </div>
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

export default ProductDetails;