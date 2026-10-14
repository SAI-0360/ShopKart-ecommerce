import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, wasWishlisted }) => {
    const { _id, name, description, price, category, image, stock } = product;
    const isOutOfStock = stock <= 0;

    const navigate = useNavigate();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(Boolean(wasWishlisted));
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [isCartUpdating, setIsCartUpdating] = useState(false);

    // Current quantity of this product in cart
    const cartItem = cart?.find(item => (item.product?._id || item.product) === _id);
    const currentQty = cartItem?.quantity || 0;
    const isAtMaxStock = currentQty >= stock;

    // Keep internal wishlist state synchronized when parent prop changes
    useEffect(() => {
        setIsWishlisted(Boolean(wasWishlisted));
    }, [wasWishlisted]);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock || isCartUpdating) return;

        try {
            setIsCartUpdating(true);
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
            setIsCartUpdating(false);
        }
    };

    const handleIncrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCartUpdating || isAtMaxStock) return;

        try {
            setIsCartUpdating(true);
            const res = await updateQuantity(_id, currentQty + 1);
            if (!res.success) {
                alert(res.message);
            }
        } catch {
            alert('Failed to update quantity');
        } finally {
            setIsCartUpdating(false);
        }
    };

    const handleDecrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCartUpdating) return;

        try {
            setIsCartUpdating(true);
            if (currentQty > 1) {
                const res = await updateQuantity(_id, currentQty - 1);
                if (!res.success) {
                    alert(res.message);
                }
            } else {
                const res = await removeFromCart(_id);
                if (!res.success) {
                    alert(res.message);
                }
            }
        } catch {
            alert('Failed to update quantity');
        } finally {
            setIsCartUpdating(false);
        }
    };

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlistLoading) return;

        try {
            setIsWishlistLoading(true);

            if (isWishlisted) {
                await api.delete(`/wishlist/${_id}`);
                setIsWishlisted(false);
            } else {
                await api.post(`/wishlist/${_id}`);
                setIsWishlisted(true);
            }

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
            setIsWishlistLoading(false);
        }
    };

    return (
        <div className={`bg-white rounded-xl border flex flex-col justify-between transition-all duration-200 group overflow-hidden ${
            isOutOfStock
                ? 'border-zinc-200 opacity-80'
                : 'border-zinc-200 hover:border-zinc-300 hover:shadow-lg'
        }`}>

            {/* Product Image & Badges */}
            <div className="h-52 w-full overflow-hidden bg-zinc-50 relative border-b border-zinc-100">
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                        isOutOfStock
                            ? 'grayscale opacity-60'
                            : 'group-hover:scale-105'
                    }`}
                />

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                            Currently Unavailable
                        </span>
                    </div>
                )}

                {/* Stock Status Badge */}
                <div className="absolute top-2.5 left-2.5">
                    {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 shadow-xs">
                            Out of Stock
                        </span>
                    ) : stock <= 5 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                            Only {stock} left!
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                            In Stock ({stock})
                        </span>
                    )}
                </div>

                {/* Wishlist Heart Button */}
                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    disabled={isWishlistLoading}
                    title={isWishlistLoading ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label={isWishlistLoading ? "Updating..." : isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full border shadow-xs flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-90 z-10 backdrop-blur-xs ${
                        isWishlisted
                            ? 'bg-red-50/95 border-red-200 text-red-600'
                            : 'bg-white/90 border-zinc-200 text-zinc-400 hover:text-red-600 hover:border-zinc-300'
                    }`}
                >
                    {isWishlistLoading ? (
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
            </div>

            {/* Details Section */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <div>
                    {/* Category Tag */}
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {category}
                    </span>

                    {/* Product Name */}
                    <h3 className={`text-sm font-bold mt-1 line-clamp-2 leading-snug transition-colors ${
                        isOutOfStock ? 'text-zinc-500' : 'text-zinc-900 group-hover:text-amber-600'
                    }`}>
                        {name}
                    </h3>

                    {/* Product Description */}
                    <p className="text-[11px] text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Bottom Row: Price & Actions CTA */}
                <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block leading-tight">Price</span>
                        <div className="flex items-baseline">
                            <span className="text-xs font-bold text-zinc-900 mr-0.5">₹</span>
                            <span className={`text-base font-black tracking-tight ${isOutOfStock ? 'text-zinc-500' : 'text-zinc-950'}`}>
                                {price?.toLocaleString ? price.toLocaleString() : price}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Link
                            to={`/products/${_id}`}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors cursor-pointer"
                        >
                            Details
                        </Link>

                        {/* Bidirectional +/- Stepper or Add to Cart Button */}
                        {isOutOfStock ? (
                            <button
                                type="button"
                                disabled
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                            >
                                Sold Out
                            </button>
                        ) : currentQty > 0 ? (
                            <div className="flex items-center border border-amber-400 bg-amber-50/70 rounded-lg shadow-xs overflow-hidden">
                                <button
                                    type="button"
                                    onClick={handleDecrement}
                                    disabled={isCartUpdating}
                                    title={currentQty === 1 ? "Remove from cart" : "Decrease quantity"}
                                    aria-label="Decrease quantity"
                                    className="w-7 h-7 flex items-center justify-center text-zinc-900 hover:bg-amber-200 active:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-black text-sm"
                                >
                                    −
                                </button>
                                <span className="w-7 text-center text-xs font-black text-zinc-950">
                                    {isCartUpdating ? '...' : currentQty}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleIncrement}
                                    disabled={isAtMaxStock || isCartUpdating}
                                    title={isAtMaxStock ? "Maximum stock reached" : "Increase quantity"}
                                    aria-label="Increase quantity"
                                    className="w-7 h-7 flex items-center justify-center text-zinc-900 hover:bg-amber-200 active:bg-amber-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-black text-sm"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isCartUpdating}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide transition-all shadow-xs active:scale-95 flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 border border-amber-500 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span>{isCartUpdating ? 'Adding...' : 'Add'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductCard;