const { verifyUser } = require('../utils/jwt');

const userMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Missing or malformed Authorization header',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const user = verifyUser(token);
        req.user = user; // Attach the user object to the request for further use
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Forbidden: Token expired' });
        }
        return res.status(401).json({
            message: 'Unauthorized: Token invalid or expired',
        });
    }
};

module.exports = userMiddleware;
