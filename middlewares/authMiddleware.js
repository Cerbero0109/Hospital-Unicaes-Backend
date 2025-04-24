const authMiddleware = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        return res.status(200).json({
            success: false,
            message: "No hay sesión activa"
        });
    }
};

module.exports = authMiddleware;