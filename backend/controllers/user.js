const User = require('../models/user');

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: users });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
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
        return res.status(200).json({ message: user });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Create a new user
const createUser = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;
        
        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: req.i18n.t('userExists') });
        }

        // Check if the email is valid
        if (!email.includes('@')) {
            return res.status(400).json({ error: req.i18n.t('invalidEmail') });
        }

        // Check if the password is strong
        if (password.length < 6) {
            return res.status(400).json({ error: req.i18n.t('passwordLength') });
        } else if (password === password.toLowerCase()) {
            return res.status(400).json({ error: req.i18n.t('passwordUppercase') });
        } else if (!/\d/.test(password)) {
            return res.status(400).json({ error: req.i18n.t('passwordNumber') });
        } else if (!/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ error: req.i18n.t('passwordCharacter') });
        }

        // Save the user to the database in MongoDB
        const newUser = new User(req.body);
        await newUser.save();
        return res.status(201).json({ message: req.i18n.t('userCreated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
};

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
        return res.status(200).json({ message: req.i18n.t('userUpdated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
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
        return res.status(200).json({ message: req.i18n.t('userDeleted') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
