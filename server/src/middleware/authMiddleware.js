import User from "../models/User.js";
import jwt from 'jsonwebtoken'
export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure the user exists in the DB
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not Authorized',
            });
        }
        req.user = user; 
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};