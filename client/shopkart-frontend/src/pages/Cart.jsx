import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const {
        cart,
        loading,
        error,
        totalItems,
        subtotal,
        fetchCart,
        updateQuantity,
        removeFromCart
    } = useCart();

    // Track which specific item is updating to avoid locking the entire UI
    const [updatingId, setUpdatingId] = useState(null);

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (updatingId || newQuantity < 1) return;

        try {
            setUpdatingId(productId);
            const res = await updateQuantity(productId, newQuantity);
            if (!res.success) {
                alert(res.message);
            }
        } catch {
            alert('Failed to update quantity');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRemoveItem = async (productId) => {
        if (updatingId) return;

        try {
            setUpdatingId(productId);
            const res = await removeFromCart(productId);
            if (!res.success) {
                alert(res.message);
            }
        } catch {
            alert('Failed to remove product');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-900 font-sans">
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">

                {/* Header Card */}
                <div className="bg-white rounded-lg border border-zinc-300 p-4 sm:p-5 shadow-xs mb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
                                    Shopping Cart
                                </h1>
                                {!loading && !error && (
                                    <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Review your cart items, adjust quantities, or proceed to secure checkout.
                            </p>
                        </div>

                        {/* Continue Shopping Link */}
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs transition-all active:scale-95"
                        >
                            <span>Continue Shopping</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* 1. Loading State */}
                {loading && (
                    <div className="text-center py-20 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-3 border-zinc-200 border-t-amber-400 rounded-full animate-spin mb-2.5"></div>
                        <p className="text-xs text-zinc-600 font-medium">Loading your shopping cart...</p>
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
                        <h3 className="text-sm font-bold text-zinc-900">Failed to load cart</h3>
                        <p className="text-xs text-zinc-600 mt-1 mb-4">{error}</p>
                        <button
                            onClick={fetchCart}
                            className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs border border-amber-500 shadow-xs cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* 3. Empty State */}
                {!loading && !error && cart.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg border border-zinc-300 shadow-xs p-6 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 stroke-zinc-400 fill-none" viewBox="0 0 24 24" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-zinc-900">Your Shopping Cart is empty</h3>
                        <p className="text-xs text-zinc-500 mt-1 mb-5 max-w-xs mx-auto leading-relaxed">
                            Looks like you haven't added any products to your cart yet. Explore our catalog and find great deals!
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 text-xs font-bold border border-amber-500 shadow-xs transition-all active:scale-95"
                        >
                            <span>Explore Products</span>
                        </Link>
                    </div>
                )}

                {/* 4. Active Cart Grid (Items on Left + Order Summary on Right) */}
                {!loading && !error && cart.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                        {/* Cart Items List (8 cols) */}
                        <div className="lg:col-span-8 flex flex-col gap-3.5">
                            {cart.map((item) => {
                                const product = item.product;
                                if (!product) return null; // Defensive guard against orphaned references

                                const productId = typeof product === 'object' ? product._id : product;
                                const isItemUpdating = updatingId === productId;
                                const isAtMaxStock = item.quantity >= (product.stock ?? 9999);
                                const isAtMinQuantity = item.quantity <= 1;

                                return (
                                    <div
                                        key={productId}
                                        className="bg-white rounded-lg border border-zinc-200 p-4 shadow-xs flex flex-col sm:flex-row gap-4 transition-all hover:border-zinc-300"
                                    >
                                        {/* Product Thumbnail */}
                                        <Link
                                            to={`/products/${product._id}`}
                                            className="w-full sm:w-28 h-28 shrink-0 bg-zinc-100 rounded-md overflow-hidden border border-zinc-200 flex items-center justify-center group"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </Link>

                                        {/* Product Info & Controls */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                                                            {product.category || 'Product'}
                                                        </span>
                                                        <Link
                                                            to={`/products/${product._id}`}
                                                            className="block text-sm font-bold text-zinc-900 hover:text-amber-600 transition-colors line-clamp-1 mt-0.5"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                    </div>

                                                    {/* Unit Price */}
                                                    <div className="text-right shrink-0">
                                                        <span className="text-[10px] text-zinc-400 block leading-tight">Price</span>
                                                        <span className="text-sm font-extrabold text-zinc-900">
                                                            ₹{product.price}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Stock Status Badge */}
                                                <div className="mt-1.5 flex items-center gap-2">
                                                    <span className={`text-[11px] font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                                        {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                                                    </span>
                                                    {isAtMaxStock && (
                                                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                                                            Max stock reached
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Controls Row: Quantity Controls + Remove CTA + Row Subtotal */}
                                            <div className="pt-3 mt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2.5">
                                                <div className="flex items-center gap-3">
                                                    {/* Quantity Control Stepper */}
                                                    <div className="flex items-center border border-zinc-300 rounded-md bg-zinc-50 shadow-xs">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(productId, item.quantity - 1)}
                                                            disabled={isAtMinQuantity || isItemUpdating}
                                                            title={isAtMinQuantity ? "Minimum quantity is 1" : "Decrease quantity"}
                                                            className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:bg-zinc-200 rounded-l-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold text-sm"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-9 text-center text-xs font-bold text-zinc-900">
                                                            {isItemUpdating ? '...' : item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateQuantity(productId, item.quantity + 1)}
                                                            disabled={isAtMaxStock || isItemUpdating}
                                                            title={isAtMaxStock ? "Maximum available stock reached" : "Increase quantity"}
                                                            className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:bg-zinc-200 rounded-r-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold text-sm"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(productId)}
                                                        disabled={isItemUpdating}
                                                        className="text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                        <span>Remove</span>
                                                    </button>
                                                </div>

                                                {/* Item Subtotal */}
                                                <div className="text-right">
                                                    <span className="text-[10px] text-zinc-400 block leading-tight">Subtotal</span>
                                                    <span className="text-sm font-bold text-zinc-950">
                                                        ₹{(product.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Sidebar (4 cols) */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-lg border border-zinc-200 p-5 shadow-xs sticky top-20 flex flex-col gap-4">
                                <h2 className="text-base font-bold text-zinc-900 pb-3 border-b border-zinc-100">
                                    Order Summary
                                </h2>

                                <div className="flex flex-col gap-2.5 text-xs">
                                    <div className="flex justify-between text-zinc-600">
                                        <span>Items ({totalItems}):</span>
                                        <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-600">
                                        <span>Delivery:</span>
                                        <span className="font-semibold text-emerald-700">FREE</span>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-[11px] text-emerald-800 font-medium">
                                        ✓ Your order qualifies for FREE Standard Delivery
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                                    <div>
                                        <span className="text-sm font-bold text-zinc-900 block">Order Total:</span>
                                        <span className="text-[10px] text-zinc-400">Inclusive of all taxes</span>
                                    </div>
                                    <span className="text-xl font-extrabold text-zinc-950">
                                        ₹{subtotal.toLocaleString()}
                                    </span>
                                </div>

                                {/* Proceed to Checkout Button */}
                                <button
                                    type="button"
                                    onClick={() => alert('Proceeding to Checkout! (Lab 06 feature)')}
                                    className="w-full py-2.5 px-4 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs sm:text-sm border border-amber-500 shadow-xs hover:shadow transition-all text-center cursor-pointer active:scale-95 mt-1"
                                >
                                    Proceed to Checkout
                                </button>

                                <div className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1 mt-1">
                                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                    </svg>
                                    <span>Safe & Secure 256-Bit SSL Checkout</span>
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

export default Cart;
