const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        console.log("Checking User Role:", req.user); // Debugging line

        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: "Forbidden: User role not found" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to perform this action." });
        }

        next();
    };
};

module.exports = roleMiddleware;
