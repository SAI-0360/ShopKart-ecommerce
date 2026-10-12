import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-2xl font-bold text-zinc-900 mb-6">My Orders</h1>

                {loading ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">Loading your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg border border-zinc-200 text-center">
                        <p className="text-zinc-600 mb-4">You haven't placed any orders yet.</p>
                        <Link
                            to="/products"
                            className="inline-block py-2 px-5 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg border border-zinc-200 shadow-xs overflow-hidden">

                                {/* Order Header */}
                                <div className="bg-zinc-50 px-5 py-3 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                                    <div className="flex gap-6">
                                        <div>
                                            <span className="block text-zinc-400">Order Placed</span>
                                            <span className="font-medium text-zinc-800">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-zinc-400">Total</span>
                                            <span className="font-bold text-zinc-900">
                                                ₹{order.totalAmount?.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                            {order.status}
                                        </span>
                                        <span className="font-mono text-[11px] text-zinc-400">
                                            #{order._id.slice(-8)}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-5 divide-y divide-zinc-100">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 object-contain rounded border border-zinc-200"
                                                    />
                                                )}
                                                <div>
                                                    <p className="text-xs font-semibold text-zinc-900">{item.name}</p>
                                                    <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-zinc-900">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Orders;