import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { cart, addToCart } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const isInCart = cart?.some(item => (item.product?._id || item.product) === id);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await api.get(`/products/${id}`);
                setProduct(data.data.product);

                // Check if current product is already in user's wishlist
                try {
                    const wishListData = await api.get('/wishlist');
                    const inWishlist = (wishListData.data.wishlist || []).some(item => item._id === id);
                    setIsWishlisted(inWishlist);
                } catch {
                    // Not logged in or failed to fetch wishlist
                    setIsWishlisted(false);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.message || 'Product not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const _id = product?._id || id;

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        if (isAdding) return;

        try {
            setIsAdding(true);

            if (isWishlisted) {
                // Currently Wishlisted -> Send DELETE to Remove
                await api.delete(`/wishlist/${_id}`);
                setIsWishlisted(false);
            } else {
                // Not Wishlisted -> Send POST to Add
                await api.post(`/wishlist/${_id}`);
                setIsWishlisted(true);
            }

            // Dispatch global event to update Navbar count in real time
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (err) {
            if (err.response?.status === 401) {
                alert('Please log in to manage your wishlist.');
                navigate('/login');
            } else {
                console.error('Wishlist action failed:', err);
                alert(err.response?.data?.message || 'Unable to update wishlist. Please try again.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!product || product.stock <= 0 || isAddingToCart) return;

        try {
            setIsAddingToCart(true);
            const res = await addToCart(id, 1);
            if (!res.success) {
                if (res.message?.toLowerCase().includes('log in') || res.message?.toLowerCase().includes('token')) {
                    alert('Please log in to add items to your cart.');
                    navigate('/login');
                } else {
                    alert(res.message);
                }
            }
        } catch {
            alert('Failed to add to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">

                {/* Back Button Navigation */}
                <div className="mb-3.5">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-amber-700 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        <span>Back to results</span>
                    </Link>
                </div>

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-28 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-3 border-zinc-200 border-t-amber-400 rounded-full animate-spin mb-2.5"></div>
                        <p className="text-xs text-zinc-600 font-medium">Loading item details...</p>
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
                        <h3 className="text-sm font-bold text-zinc-900">Product Unavailable</h3>
                        <p className="text-xs text-zinc-600 mt-1 mb-4">{error}</p>
                        <Link
                            to="/products"
                            className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs"
                        >
                            Return to Catalog
                        </Link>
                    </div>
                )}

                {/* 3. Product Details Content */}
                {!loading && !error && product && (
                    <div className="bg-white rounded-lg border border-zinc-300 shadow-xs p-5 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-start">

                            {/* Left: Product Image Stage */}
                            <div className="md:col-span-6 bg-white rounded-lg border border-zinc-200 p-5 flex items-center justify-center relative aspect-square max-h-[420px] w-full">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain object-center"
                                />

                                {/* Top-Left Floating Wishlist Heart Button */}
                                <button
                                    type="button"
                                    onClick={handleToggleWishlist}
                                    disabled={isAdding}
                                    title={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                    aria-label={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                    className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full border shadow-xs flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 z-10 ${
                                        isWishlisted
                                            ? 'bg-red-50 border-red-200 text-red-600'
                                            : 'bg-white border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-zinc-300'
                                    }`}
                                >
                                    {isAdding ? (
                                        <svg className="w-3.5 h-3.5 animate-spin text-zinc-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg
                                            className={`w-4 h-4 transition-colors ${
                                                isWishlisted ? 'fill-red-600 stroke-red-600' : 'fill-none stroke-current'
                                            }`}
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                            />
                                        </svg>
                                    )}
                                </button>

                                {/* Top-Right Stock Status Pill on Image */}
                                <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded text-[11px] font-semibold ${product.stock > 0
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                </span>
                            </div>

                            {/* Right: Product Info & Buy Box Actions */}
                            <div className="md:col-span-6 flex flex-col justify-between space-y-5">
                                <div>
                                    {/* Category */}
                                    <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                                        {product.category}
                                    </span>

                                    {/* Title */}
                                    <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 mt-1 leading-snug">
                                        {product.name}
                                    </h1>

                                    {/* Amazon-style Price Box */}
                                    <div className="mt-3 pb-3.5 border-b border-zinc-200">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-medium text-zinc-900">₹</span>
                                            <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                                                {product.price}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-500 mt-0.5">Inclusive of all taxes. Free standard delivery available.</p>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-4">
                                        <h3 className="text-xs font-bold text-zinc-900 mb-1.5 uppercase tracking-wide">
                                            About this item
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Amazon Buy Box Style Actions Section */}
                                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 flex flex-col gap-2.5">
                                    <div className="text-[11px] font-semibold text-emerald-700">
                                        {product.stock > 0 ? '✓ Available for immediate delivery' : '✗ Currently out of stock'}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2.5">
                                        {/* Add to Cart Button (Amazon Yellow Button) */}
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={product.stock <= 0 || isAddingToCart}
                                            className="flex-1 py-2.5 px-5 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs sm:text-sm border border-amber-500 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                            </svg>
                                            <span>{isAddingToCart ? 'Adding to Cart...' : isInCart ? 'Add Another to Cart' : 'Add to Cart'}</span>
                                        </button>

                                        {/* Wishlist Button */}
                                        <button
                                            type="button"
                                            onClick={handleToggleWishlist}
                                            disabled={isAdding}
                                            title={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                            aria-label={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                            className={`sm:w-auto px-4 py-2.5 rounded-md border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs ${
                                                isWishlisted
                                                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                                                    : 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50'
                                            }`}
                                        >
                                            {isAdding ? (
                                                <svg className="w-4 h-4 animate-spin text-zinc-500" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    className={`w-4 h-4 transition-colors ${
                                                        isWishlisted ? 'fill-red-600 stroke-red-600' : 'fill-none stroke-current'
                                                    }`}
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                    />
                                                </svg>
                                            )}
                                            <span>{isAdding ? 'Updating...' : isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>
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

export default ProductDetails;