import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/customer.route.js';
import productRoutes from './routes/product.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8000;

dotenv.config()

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("DB connected!")
}).catch((err) => {
    console.log(err);
})


app.use(cors(
    {
        origin: "http://localhost:5174",
        credentials : true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
))

app.use(express.json());
app.use(cookieParser());


app.use('/customers', userRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to ShopKart!')
})

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})