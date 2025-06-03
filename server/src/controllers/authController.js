import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import axios from 'axios'
import oauth2Client from '../utils/googleConfig.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const jwtExpiresIn = 24 * 60 * 60;
// Cookie options
const cookieOptions = {
    expires: new Date(Date.now() + jwtExpiresIn * 1000), // 3 days
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
};


// Sign-up API
export const SignUp = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (email.length < 5 || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'Signup successful',
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Login API
export const Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !user.password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET, {
            expiresIn: jwtExpiresIn,
        });

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Optional: Logout API
export const Logout = (req, res) => {
    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Google OAuth API
export const GoogleOAuth = async (req, res) => {
    const code = req.query.code;
    try {
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const { email, name, id } = userRes.data;
        console.log(userRes.data)
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                username: name,
                googleId: id,
                provider: 'google',
            });
        }

        const token = jwt.sign({ user_id: user._id }, JWT_SECRET, {
            expiresIn: jwtExpiresIn,
        });

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
            token
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// check if user is authenticated
export const isAuthenticated = (req, res, next) => {
    const userId = req.user?._id;
    console.log("User ID:", userId);

    if (!userId) {
        return res.status(401).json({ 
            success: false,
             message: 'Unauthorized' 
            });
    }
    else {
        return res.status(200).json({
            success: true,
            message: 'User is authenticated',
        });
    }
}
