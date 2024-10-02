const User = require('../models/user');

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json({ message: users });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Get a single user
// An user can see only his own profile
// An admin can see any profile
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: req.i18n.t('userNotFound') });
        }

        // Verificar si el usuario es Admin o si está accediendo a su propio perfil
        if (req.user.role !== 'Admin' && req.user.email !== user.email) {
            return res.status(403).json({ error: req.i18n.t('forbidden') });
        }
        res.status(201).json({ message: user });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Update a user
// An user can edit only his own profile
// An admin can edit any profile
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ error: req.i18n.t('userNotFound') });
        }

        // Verificar si el usuario es Admin o si está accediendo a su propio perfil
        if (req.user.role !== 'Admin' && req.user.email !== user.email) {
            return res.status(403).json({ error: req.i18n.t('forbidden') });
        }
        res.status(201).json({ message: req.i18n.t('userUpdated') });
    }
    catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Delete a user
// An user can delete only his own profile
// An admin can delete any profile
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: req.i18n.t('userNotFound') });
        }

        // Verificar si el usuario es Admin o si está accediendo a su propio perfil
        if (req.user.role !== 'Admin' && req.user.email !== user.email) {
            return res.status(403).json({ error: req.i18n.t('forbidden') });
        }
        res.status(201).json({ message: req.i18n.t('userDeleted') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
