import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'corner-dev-secret';

const protect = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const decoded = jwt.verify(token, getJwtSecret());

        req.user = await User.findById(decoded.id).select('-password');

        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token failed'
        });
    }
};

export default protect;