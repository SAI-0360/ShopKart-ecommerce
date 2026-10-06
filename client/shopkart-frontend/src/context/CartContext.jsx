import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // 1. Fetch Cart on load / when user logs in or logs out
    const fetchCart = async () => {
        if (!user) {
            setCart([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/cart');
            setCart(res.data.cart || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    // 2. Add to Cart (POST /cart/:productId)
    const addToCart = async (productId, quantity = 1) => {
        try {
            setError(null);
            const res = await api.post(`/cart/${productId}`, { quantity });
            setCart(res.data.cart || []);
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add to cart';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    // 3. Update Quantity (PATCH /cart/:productId)
    const updateQuantity = async (productId, quantity) => {
        try {
            setError(null);
            const res = await api.patch(`/cart/${productId}`, { quantity });
            setCart(res.data.cart || []);
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update quantity';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    // 4. Remove Item (DELETE /cart/:productId)
    const removeFromCart = async (productId) => {
        try {
            setError(null);
            const res = await api.delete(`/cart/${productId}`);
            setCart(res.data.cart || []);
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to remove product';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    // 5. Derived Values
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                totalItems,
                subtotal,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);