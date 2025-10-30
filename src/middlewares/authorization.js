export const authorizeRole = (role) => {
    return (req, res, next) => {
        // Passport ya habrá agregado el usuario en req.user
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }

        next(); // pasa al siguiente middleware o controlador
    };
};