import React from 'react';
import { Link } from 'react-router-dom';

export const WishlistCard = ({ product, onRemove }) => {
    if (!product || !product._id) return null;

    const { _id, name, price, category, image, stock } = product;
    const outOfStock = stock <= 0;

    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemove) {
            onRemove(_id);
        }
    };

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all duration-300 group ${
            outOfStock 
                ? 'border-slate-200/70 bg-slate-50/30' 
                : 'border-slate-200/80 hover:border-slate-300 hover:shadow-[0_12px_30px_-10px_rgba(99,102,241,0.12)]'
        }`}>

            {/* Product Image & Badges */}
            <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                        outOfStock 
                            ? 'grayscale opacity-60' 
                            : 'group-hover:scale-105'
                    }`}
                />

                {/* Prominent Out of Stock Overlay */}
                {outOfStock && (
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <span className="px-3 py-1 rounded-lg bg-rose-600/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Top-Left Stock Badge */}
                <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold shadow-sm border ${
                    !outOfStock
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        : 'bg-rose-50 text-rose-700 border-rose-200/70'
                }`}>
                    {!outOfStock ? `${stock} in stock` : 'Sold Out'}
                </span>

                {/* Top-Right Quick Remove Heart Button */}
                <button
                    type="button"
                    onClick={handleRemove}
                    title="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 hover:scale-110 active:scale-95 shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer group/btn"
                >
                    <svg className="w-4 h-4 fill-rose-500 group-hover/btn:fill-rose-600 transition-colors" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>

            {/* Details Section */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Category Tag */}
                    {category && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-md">
                            {category}
                        </span>
                    )}

                    {/* Product Name */}
                    <h3 className={`text-sm font-semibold mt-2 line-clamp-1 transition-colors ${
                        outOfStock ? 'text-slate-600' : 'text-slate-900 group-hover:text-violet-600'
                    }`}>
                        {name}
                    </h3>
                </div>

                {/* Bottom Row: Price & Action Buttons */}
                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 block">Price</span>
                        <span className={`text-base font-bold ${outOfStock ? 'text-slate-500' : 'text-slate-900'}`}>
                            ₹{price}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Remove Action Button */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/90 hover:border-rose-200 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                            title="Remove from wishlist"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            <span className="hidden sm:inline">Remove</span>
                        </button>

                        {/* View Details Link */}
                        <Link
                            to={`/products/${_id}`}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1 active:scale-95 ${
                                outOfStock
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

        </div>
    );
};

export default WishlistCard;