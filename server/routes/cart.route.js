import express from 'express';
import { addToCart, getCart } from '../controllers/cart.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();
    
router.get('/', isAuthenticated, getCart);
router.post('/:productId', isAuthenticated, addToCart);

export default router;
