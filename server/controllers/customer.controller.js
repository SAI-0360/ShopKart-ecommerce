// register controller
import User from '../models/customer.model.js';
import bcrypt from 'bcrypt';
import { genToken } from '../utils/generateTokens.js';

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const sanitizeUser = (user) => {
    const safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;
    return safeUser;
}

export const registerUser = async (req, res) => {

    try {
        const { fullName, email, password, phone } = req.body

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: 'Fill all the required fields!' });
        }

        const cleanPhone = String(phone).replace(/[\s\-\(\)\.]/g, '');
        const phoneMatch = cleanPhone.match(/^(?:\+91|0)?(\d{10})$/);
        if (!phoneMatch) {
            return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
        }

        if (password.length <= 6) {
            return res.status(400).json({ message: 'Password is too short' })
        }

        const emailExists = await User.findOne({ email })

        if (emailExists) {
            return res.status(409).json({ message: 'User already exists1' })
        }

        // Generating salt
        const salt = await bcrypt.genSalt(10)

        // console.log(salt)


        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone: phoneMatch[1],
        })

        // Generating Token
        const token = genToken(newUser._id)

        res.cookie('token', token, cookieOptions)

        res.status(201).json({
            success: true,
            message: 'User successfully registered!',
            customer: sanitizeUser(newUser)
        })

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message })
    }

}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Fill all the required fields*' });
        }

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, foundUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = genToken(foundUser._id)

        res.cookie('token', token, cookieOptions)

        // Login successful
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            customer: sanitizeUser(foundUser)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message });
    }
}

export const getMe = (req, res) => {
    const authenticatedUser = sanitizeUser(req.user)
    return res.status(200).json({ authenticatedUser })
}

export const logoutUser = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            path: "/"
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
    return res.status(401).json({
        success: false,
        message: "You are not logged in"
    });
};
