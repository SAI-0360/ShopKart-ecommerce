import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, wasWishlisted }) => {
    const { _id, name, description, price, category, image, stock } = product;
    const isOutOfStock = stock <= 0;

    const navigate = useNavigate();
    const { cart, addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(Boolean(wasWishlisted));
    const [isAdding, setIsAdding] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const isInCart = cart?.some(item => (item.product?._id || item.product) === _id);

    // Keep internal wishlist state synchronized when parent prop changes
    useEffect(() => {
        setIsWishlisted(Boolean(wasWishlisted));
    }, [wasWishlisted]);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (isOutOfStock || isAddingToCart) return;

        try {
            setIsAddingToCart(true);
            const res = await addToCart(_id, 1);
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

            // Dispatch global event to update Navbar count in real time
            window.dispatchEvent(new Event('wishlistUpdated'));
            
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
        <div className={`bg-white rounded-lg border flex flex-col justify-between transition-shadow duration-200 group overflow-hidden ${isOutOfStock
            ? 'border-zinc-200 opacity-75'
            : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
            }`}>

            {/* Product Image & Badges */}
            <div className="h-52 w-full overflow-hidden bg-zinc-100 relative border-b border-zinc-100">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 ${isOutOfStock
                        ? 'grayscale opacity-60'
                        : 'group-hover:scale-105'
                        }`}
                />

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider">
                            Currently Unavailable
                        </span>
                    </div>
                )}

                {/* Top-Left Stock Badge */}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold ${!isOutOfStock
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {!isOutOfStock ? `In Stock (${stock})` : 'Out of Stock'}
                </span>

                {/* Top-Right Wishlist Button */}
                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    disabled={isAdding}
                    title={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label={isAdding ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full border shadow-xs flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 z-10 ${isWishlisted
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-zinc-300'
                        }`}
                >
                    {isAdding ? (
                        <svg className="w-3 h-3 animate-spin text-zinc-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg
                            className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-red-600 stroke-red-600' : 'fill-none stroke-current'
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
            </div>

            {/* Details Section */}
            <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                <div>
                    {/* Category Tag */}
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                        {category}
                    </span>

                    {/* Product Name */}
                    <h3 className={`text-[13px] font-bold mt-0.5 line-clamp-2 leading-snug transition-colors ${isOutOfStock ? 'text-zinc-500' : 'text-zinc-900 group-hover:text-amber-600'
                        }`}>
                        {name}
                    </h3>

                    {/* Product Description */}
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Bottom Row: Price & Actions CTA */}
                <div className="pt-2.5 mt-2.5 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                    <div>
                        <span className="text-[9px] text-zinc-400 block leading-tight">Price</span>
                        <div className="flex items-baseline">
                            <span className="text-[11px] font-bold text-zinc-900">₹</span>
                            <span className={`text-base font-extrabold tracking-tight ${isOutOfStock ? 'text-zinc-500' : 'text-zinc-900'}`}>
                                {price}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Link
                            to={`/products/${_id}`}
                            className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors cursor-pointer"
                        >
                            Details
                        </Link>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isAddingToCart}
                            className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wide transition-all shadow-xs active:scale-95 flex items-center gap-1 ${
                                isOutOfStock
                                    ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                                    : 'bg-amber-400 hover:bg-amber-500 text-zinc-950 border border-amber-500 cursor-pointer'
                            }`}
                        >
                            {isAddingToCart ? 'Adding...' : isInCart ? 'Add Another' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductCard;