import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, subtotal, fetchCart } = useCart();
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";

        // Phone: Must be exactly 10 digits
        if (!/^\d{10}$/.test(formData.phone.trim())) {
            newErrors.phone = "Phone must be a valid 10-digit number";
        }

        // Pincode: Must be exactly 6 digits
        if (!/^\d{6}$/.test(formData.pincode.trim())) {
            newErrors.pincode = "Pincode must be a 6-digit number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // true if no errors
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // 1. Guard: Validate form inputs
        if (!validateForm()) return;

        // 2. Guard: Ensure cart is not empty
        if (!cart || cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // 3. Guard: Ensure Razorpay SDK has loaded
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        try {
            setProcessing(true);

            // 4. Ask our backend to create both the ShopKart Order and the Razorpay Order
            const { data } = await api.post('/orders/create-payment-order', {
                shippingAddress: formData
            });

            const { orderId, razorpayOrderId, amount, currency, keyId } = data;

            // 5. Build Razorpay Modal Options
            const options = {
                key: keyId, // Your public RAZORPAY_KEY_ID from backend
                amount: amount, // in paise
                currency: currency,
                name: "ShopKart",
                description: "Order Payment",
                order_id: razorpayOrderId, // Razorpay Order ID

                // PRE-FILL USER DETAILS in popup
                prefill: {
                    name: formData.fullName,
                    contact: formData.phone,
                    email: user?.email || ""
                },
                theme: {
                    color: "#f59e0b"
                },

                // 6. THIS HANDLER RUNS WHEN PAYMENT SUCCEEDS IN POPUP
                handler: async (response) => {
                    try {
                        // Send transaction proof back to our backend for HMAC verification
                        const verifyRes = await api.post('/orders/verify-payment', {
                            orderId: orderId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            // Refresh global cart context (now empty on backend)
                            await fetchCart();
                            // Navigate to success screen
                            navigate(`/order-success/${orderId}`, { state: { order: verifyRes.data.order } });
                        }
                    } catch (verifyError) {
                        console.error("Verification failed:", verifyError);
                        alert("Payment verification failed! Please contact support.");
                    }
                },

                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                        console.log("Customer closed the Razorpay popup.");
                    }
                }
            };

            // 7. Open the Razorpay Checkout Popup!
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Create order failed:", err);
            alert(err.response?.data?.message || "Failed to initiate payment");
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-2xl font-bold text-zinc-900 mb-6">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Shipping Address Form */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-lg border border-zinc-200 shadow-xs">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
                            1. Shipping Details
                        </h2>

                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-all ${errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 focus:border-amber-500'
                                        }`}
                                />
                                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 focus:border-amber-500'
                                            }`}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="6-digit pincode"
                                        className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-all ${errors.pincode ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 focus:border-amber-500'
                                            }`}
                                    />
                                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-700 mb-1">Address Line</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    placeholder="Flat, House no., Building, Street"
                                    className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-all ${errors.addressLine1 ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 focus:border-amber-500'
                                        }`}
                                />
                                {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-all ${errors.city ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 focus:border-amber-500'
                                            }`}
                                    />
                                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-all ${errors.state ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 focus:border-amber-500'
                                            }`}
                                    />
                                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full mt-4 py-3 rounded-md bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm transition-all cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {processing ? "Processing Payment..." : "Place Order & Pay with Razorpay"}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-lg border border-zinc-200 shadow-xs h-fit">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
                            2. Order Summary
                        </h2>

                        <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto mb-4">
                            {cart.map((item) => (
                                <div key={item.product?._id} className="py-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.name}
                                            className="w-12 h-12 object-contain rounded border border-zinc-200"
                                        />
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-800 line-clamp-1">{item.product?.name}</p>
                                            <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-900">
                                        ₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-200 pt-3 space-y-2">
                            <div className="flex justify-between text-sm text-zinc-600">
                                <span>Items ({cart.length}):</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-600">
                                <span>Delivery:</span>
                                <span className="text-emerald-600 font-semibold">FREE</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-zinc-100">
                                <span>Order Total:</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Checkout;