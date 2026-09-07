import jwt from "jsonwebtoken"
import User from "../models/customer.model.js"

export const isAuthenticated = async (req, res, next) => {
    
    try {
        
        const token = req.cookies.token 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // console.log(decoded)

        const user = await User.findById(decoded.userId)

        req.user = user

        next()
        
    } catch (error) {
        console.log(error)
    }
}

