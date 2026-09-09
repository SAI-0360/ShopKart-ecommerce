// register controller
import User from '../models/customer.model.js';
import bcrypt from 'bcrypt';
import { genToken } from '../utils/generateTokens.js';

const cookieOptions = {
    httpOnly: true
}

export const registerUser = async (req, res) => {

    try {
        const { fullName, email, password, phone } = req.body

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: 'Fill all the required fields!' });
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
            phone,
        })

        // Generating Token
        const token = genToken(newUser._id)

        res.cookie('token', token, cookieOptions)

        res.status(201).json({
            success: true,
            message: 'User successfully registered!',
            customer: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                phone: newUser.phone
            }
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
            // to be used to display user info on the frontend
            customer: {
                _id: foundUser._id,
                fullName: foundUser.fullName,
                email: foundUser.email,
                phone: foundUser.phone
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server crashed', error: error.message });
    }
}

export const getMe = (req, res) => {
    const authenticatedUser = req.user
    res.status(200).json({ authenticatedUser })
}

export const logoutUser = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.clearCookie("token");
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
