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
        <div className={`bg-white rounded-lg border flex flex-col justify-between transition-shadow duration-200 group overflow-hidden ${
            outOfStock 
                ? 'border-zinc-200 opacity-75' 
                : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
        }`}>

            {/* Product Image & Badges */}
            <div className="h-52 w-full overflow-hidden bg-zinc-100 relative border-b border-zinc-100">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                        outOfStock 
                            ? 'grayscale opacity-60' 
                            : 'group-hover:scale-105'
                    }`}
                />

                {/* Out of Stock Overlay */}
                {outOfStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider">
                            Currently Unavailable
                        </span>
                    </div>
                )}

                {/* Top-Left Stock Badge */}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold ${
                    !outOfStock
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {!outOfStock ? `In Stock (${stock})` : 'Out of Stock'}
                </span>

                {/* Top-Right Quick Remove Heart Button */}
                <button
                    type="button"
                    onClick={handleRemove}
                    title="Remove from wishlist"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 shadow-xs flex items-center justify-center transition-all duration-150 cursor-pointer group/btn"
                >
                    <svg className="w-3.5 h-3.5 fill-red-600 transition-colors" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>

            {/* Details Section */}
            <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                    {/* Category Tag */}
                    {category && (
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                            {category}
                        </span>
                    )}

                    {/* Product Name */}
                    <h3 className={`text-[13px] font-bold mt-0.5 line-clamp-2 leading-snug transition-colors ${
                        outOfStock ? 'text-zinc-500' : 'text-zinc-900 group-hover:text-amber-600'
                    }`}>
                        {name}
                    </h3>
                </div>

                {/* Bottom Row: Price & Action Buttons */}
                <div className="pt-2.5 mt-2.5 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <div>
                        <span className="text-[9px] text-zinc-400 block leading-tight">Price</span>
                        <div className="flex items-baseline">
                            <span className="text-[11px] font-bold text-zinc-900">₹</span>
                            <span className={`text-base font-extrabold tracking-tight ${outOfStock ? 'text-zinc-500' : 'text-zinc-900'}`}>
                                {price}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Remove Action Button */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="px-2.5 py-1.5 rounded-md text-[11px] font-medium text-zinc-600 hover:text-red-700 hover:bg-red-50 border border-zinc-300 hover:border-red-300 transition-all cursor-pointer active:scale-95"
                            title="Remove from wishlist"
                        >
                            <span>Remove</span>
                        </button>

                        {/* View Details Link */}
                        <Link
                            to={`/products/${_id}`}
                            className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all shadow-xs active:scale-95 ${
                                outOfStock
                                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-300'
                                    : 'bg-amber-400 hover:bg-amber-500 text-zinc-950 border border-amber-500'
                            }`}
                        >
                            <span>View</span>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default WishlistCard;