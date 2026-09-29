import User from '../models/customer.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

const populateWishlist = (query) => query
    .populate('wishlist', 'name price category image stock'); // Populate wishlist with product fields for frontend cards


export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Validate product exists in database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check for duplicates in user's wishlist 
        const alreadyInWishlist = req.user.wishlist.some(
            (id) => id.toString() === productId
        );
        if (alreadyInWishlist) {
            return res.status(409).json({ message: 'Product already in wishlist' });
        }

        // Add to wishlist: $addToSet prevents duplicates, { new: true } returns the updated document
        const updatedCustomer = await populateWishlist(
            User.findByIdAndUpdate(
                customerId,
                { $addToSet: { wishlist: productId } },
                { new: true }
            )
        );

        return res.status(200).json({
            success: true,
            message: 'Added to wishlist',
            wishlist: updatedCustomer.wishlist
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Check if product exists in user's wishlist (404 Not Found per Lab 04)
        const inWishlist = req.user.wishlist.some(
            (id) => id.toString() === productId
        );
        if (!inWishlist) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        // Remove from wishlist: $pull removes the specified value from the array
        const updatedCustomer = await populateWishlist(
            User.findByIdAndUpdate(
                customerId,
                { $pull: { wishlist: productId } },
                { new: true }
            )
        );

        return res.status(200).json({
            success: true,
            message: 'Removed from wishlist',
            wishlist: updatedCustomer.wishlist
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const customer = await populateWishlist(
            User.findById(req.user._id)
        );

        const wishlist = customer?.wishlist || [];

        return res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};