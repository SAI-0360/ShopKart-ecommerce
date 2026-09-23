import jwt from "jsonwebtoken"
import User from "../models/customer.model.js"

export const isAuthenticated = async (req, res, next) => {
    
    try {
        
        const token = req.cookies?.token 

        if(!token){
            return res.status(401).json({ message: 'Unauthorized access!' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // console.log(decoded)

        const user = await User.findById(decoded.userId)

        if(!user){
            return res.status(401).json({ message: 'Unauthorized access!' })
        }

        req.user = user

        next()
        
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token!' })
        console.log(error)
    }
}

