import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import User from '../models/customer.model.js';

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        const quantity = req.body?.quantity ? Number(req.body.quantity) : 1;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: `Invalid product ID` });
        }

        // Validate quantity format
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: `Quantity must be a positive integer` });
        }

        // Find Product & User
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: `Product not found` });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: `User not found` });
        }

        // Check if item exists in cart
        const existingCartItem = user.cart.find(
            item => item.product.toString() === productId
        );

        const newQuantity = (existingCartItem?.quantity || 0) + quantity;

        // Stock validation
        if (newQuantity > product.stock) {
            return res.status(400).json({ message: `Cannot exceed available stock (${product.stock})` });
        }

        // Update or push
        if (existingCartItem) {
            existingCartItem.quantity = newQuantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        // Populate and return
        await user.populate({
            path: 'cart.product',
            select: 'name price image stock'
        });

        return res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: user.cart
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: 'cart.product',
            select: 'name price image stock'
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cleanCart = user.cart.filter(item => item.product !== null);

        return res.status(200).json({
            success: true,
            cart: cleanCart
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: `Invalid product ID` });
        }

        if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: `Quantity must be an integer of at least 1` });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: `Cannot exceed available stock (${product.stock})` });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItem = user.cart.find(item => item.product.toString() === productId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Product not in cart' });
        }

        cartItem.quantity = quantity;
        await user.save();

        await user.populate({
            path: 'cart.product',
            select: 'name price image stock'
        });

        return res.status(200).json({
            success: true,
            message: 'Quantity updated',
            cart: user.cart
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemExists = user.cart.some(
            item => item.product.toString() === productId
        );
        if (!itemExists) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        
        user.cart = user.cart.filter(
            item => item.product.toString() !== productId
        );
        await user.save();
        
        await user.populate({
            path: 'cart.product',
            select: 'name price image stock'
        });
        
        return res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: user.cart
        });
        
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}