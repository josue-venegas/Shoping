// Middleware to check if the user has the role required
const hasToBe = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: req.i18n.t('invalidRole') });
        }
        next();
    };
};

module.exports = hasToBe;