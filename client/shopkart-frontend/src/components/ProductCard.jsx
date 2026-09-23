import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { _id, name, description, price, category, image, stock } = product;
    const isOutOfStock = stock <= 0;

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all duration-300 group ${
            isOutOfStock 
                ? 'border-slate-200/70 bg-slate-50/30' 
                : 'border-slate-200/80 hover:border-slate-300 hover:shadow-[0_12px_30px_-10px_rgba(99,102,241,0.12)]'
        }`}>

            {/* Product Image & Stock Badge */}
            <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                        isOutOfStock 
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

                {/* Top-Right Stock Badge */}
                <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold shadow-sm border ${
                    !isOutOfStock
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        : 'bg-rose-50 text-rose-700 border-rose-200/70'
                }`}>
                    {!isOutOfStock ? `${stock} in stock` : 'Sold Out'}
                </span>
            </div>

            {/* Details Section */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Category Tag */}
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-md">
                        {category}
                    </span>

                    {/* Product Name */}
                    <h3 className={`text-sm font-semibold mt-2 line-clamp-1 transition-colors ${
                        isOutOfStock ? 'text-slate-600' : 'text-slate-900 group-hover:text-violet-600'
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
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1 active:scale-95 ${
                            isOutOfStock
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