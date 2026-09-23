import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            // reason for price === undefined is that price can be 0, which will give falsy value
            // reason for stock === undefined is that stock can be 0, so we need to check for undefined instead of falsy value
            return res.status(400).json({ message: 'Fill all the required fields!' });
        }

        if (price <= 0) {
            return res.status(400).json({ message: 'Price must be greater than 0' });
        }

        if (stock < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const getAllProducts = async (req, res) => {
    try {

        const { search, category } = req.query;

        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category && category !== 'All') {// not All is needed because we don't want to filter by category if the user selects All
            // Matches the whole category name, but ignores uppercase/lowercase!
            query.category = { $regex: category, $options: 'i' };
        }

        const products = await Product.find(query);

        res.status(200).json({ success: true, count: products.length, products });

    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {// checks if the id is a valid mongoose object id
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        }


        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}