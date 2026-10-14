import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/customer.route.js';
import productRoutes from './routes/product.route.js';
import wishlistRoutes from './routes/wishlist.route.js';
import cartRoutes from './routes/cart.route.js';
import orderRoutes from "./routes/order.route.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
const port = process.env.PORT || 8000;


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("DB connected!")
}).catch((err) => {
    console.log(err);
})


// Dynamic Production CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Health Check Route (Used by Render to check server liveness)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'ShopKart server is running' });
});

app.use('/customers', userRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to ShopKart!')
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Server started at ${port}`)
})