import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const OrderSuccess = () => {
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(location.state?.order || null);

    useEffect(() => {
        if (!order && id) {
            api.get(`/orders/${id}`)
                .then(res => setOrder(res.data.order))
                .catch(err => console.error("Error loading order:", err));
        }
    }, [id, order]);

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col items-center">
                <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm w-full text-center">
                    
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-zinc-900 mb-1">Order Placed Successfully!</h1>
                    <p className="text-sm text-zinc-500 mb-6">
                        Thank you for your purchase. Your payment was verified by Razorpay.
                    </p>

                    <div className="bg-zinc-50 rounded-lg p-5 border border-zinc-200 text-left mb-6 space-y-3">
                        <div className="flex justify-between text-sm pb-2 border-b border-zinc-200">
                            <span className="text-zinc-500">Order ID:</span>
                            <span className="font-mono font-medium text-zinc-800">{id}</span>
                        </div>
                        {order && (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Total Paid:</span>
                                    <span className="font-bold text-zinc-900">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Status:</span>
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">
                                        {order.status}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/orders"
                            className="py-2.5 px-6 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm transition-all shadow-xs"
                        >
                            View My Orders
                        </Link>
                        <Link
                            to="/products"
                            className="py-2.5 px-6 rounded-md bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold text-sm transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default OrderSuccess;