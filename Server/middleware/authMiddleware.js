import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../Models/UserSchema.js';





dotenv.config();

const authMiddleware = async (req, res, next) => {
    // allow CORS preflight through without authentication
    if (req.method === 'OPTIONS') {
        console.log('authMiddleware - skipping auth for OPTIONS preflight');
        return next();
    }

    const authHeader = req.headers.authorization;

    console.log('authMiddleware - authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    console.log('authMiddleware - token (first 50 chars):', token ? token.slice(0,50) + (token.length>50 ? '...' : '') : token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('authMiddleware - decoded token:', decoded);

        const userId = decoded.userId || decoded._id || decoded.id;

        if (!userId) {
            console.warn('authMiddleware - no user id found in token payload');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = await User.findById(userId).select('-password');

        if (!req.user) {
            console.warn('authMiddleware - user not found for id:', userId);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('authMiddleware - user found and attached:', req.user._id.toString());
        next();
    } catch (err) {
        console.error('authMiddleware - jwt verify error:', err);
        if (err && err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;