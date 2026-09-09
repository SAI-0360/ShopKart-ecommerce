import express from 'express';
import { registerUser, loginUser, getMe, logoutUser } from '../controllers/customer.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/me', isAuthenticated, getMe)
userRoutes.post('/logout', logoutUser)

export default userRoutes;
