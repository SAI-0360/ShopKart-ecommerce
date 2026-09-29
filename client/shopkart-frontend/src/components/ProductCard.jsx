import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ProductCard = ({ product, wasWishlisted }) => {
    const { _id, name, description, price, category, image, stock } = product;
    const isOutOfStock = stock <= 0;

    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(Boolean(wasWishlisted));
    const [isAdding, setIsAdding] = useState(false);

    // Keep internal wishlist state synchronized when parent prop changes
    useEffect(() => {
        setIsWishlisted(Boolean(wasWishlisted));
    }, [wasWishlisted]);

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        if (isAdding) return; // Prevent double-clicks

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
        } catch (err) {
            if (err.response?.status === 401) {
                alert('Please log in to manage your wishlist.');
                navigate('/login');
            } else {
                console.error('Wishlist action failed:', err);
                alert(err.response?.data?.message || 'Failed to update wishlist. Please try again.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all duration-300 group ${isOutOfStock
            ? 'border-slate-200/70 bg-slate-50/30'
            : 'border-slate-200/80 hover:border-slate-300 hover:shadow-[0_12px_30px_-10px_rgba(99,102,241,0.12)]'
            }`}>

            {/* Product Image & Badges */}
            <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 ${isOutOfStock
                        ? 'grayscale opacity-60'
                        : 'group-hover:scale-105'
                        }`}
                />

                {/* Prominent Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1 rounded-lg bg-rose-600/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Top-Left Stock Badge */}
                <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold shadow-sm border ${!isOutOfStock
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                    : 'bg-rose-50 text-rose-700 border-rose-200/70'
                    }`}>
                    {!isOutOfStock ? `${stock} in stock` : 'Sold Out'}
                </span>

                {/* Top-Right Wishlist Button */}
                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    disabled={isAdding}
                    title={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-sm border shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 z-10 ${isWishlisted
                            ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
                            : 'bg-white/90 border-slate-200/80 text-slate-400 hover:text-rose-500 hover:bg-white hover:border-rose-200 hover:scale-110'
                        }`}
                >
                    {isAdding ? (
                        <svg className="w-3.5 h-3.5 animate-spin text-rose-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isWishlisted ? 'fill-rose-500 stroke-rose-500 scale-110' : 'fill-none stroke-current'
                                }`}
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Details Section */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Category Tag */}
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-md">
                        {category}
                    </span>

                    {/* Product Name */}
                    <h3 className={`text-sm font-semibold mt-2 line-clamp-1 transition-colors ${isOutOfStock ? 'text-slate-600' : 'text-slate-900 group-hover:text-violet-600'
                        }`}>
                        {name}
                    </h3>

                    {/* Product Description */}
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Bottom Row: Price & View Details CTA */}
                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 block">Price</span>
                        <span className={`text-base font-bold ${isOutOfStock ? 'text-slate-500' : 'text-slate-900'}`}>
                            ₹{price}
                        </span>
                    </div>

                    <Link
                        to={`/products/${_id}`}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1 active:scale-95 ${isOutOfStock
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20 hover:shadow-violet-500/30'
                            }`}
                    >
                        <span>Details</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default ProductCard;