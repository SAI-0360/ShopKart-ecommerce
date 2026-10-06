import express from 'express';
import { addToCart, getCart, updateQuantity, removeFromCart } from '../controllers/cart.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();
    
router.get('/', isAuthenticated, getCart);
router.post('/:productId', isAuthenticated, addToCart);
router.patch('/:productId', isAuthenticated, updateQuantity);
router.delete('/:productId', isAuthenticated, removeFromCart);

export default router;
