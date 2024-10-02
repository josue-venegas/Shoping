const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

const helloworld = async (req, res) => {
    try {
        // Asegúrate de que se utiliza req.i18n para acceder a la instancia de i18next
        const message = req.i18n.t('helloWorld');
        res.json({ message });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Signup controller
const signup = async (req, res) => {
    try {
        // Get user input
        const { name, email, password, phone, address, city, country } = req.body;

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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user object
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            city,
            country
        });

        // Save the user to the database in MongoDB
        await newUser.save();

        // Return a success message
        res.status(201).json({ message: req.i18n.t('userCreated') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
};

// Login controller
const login = async (req, res) => {
    console.log("Login controller");
    try {
        // Obtener la entrada del usuario
        const { email, password } = req.body;

        console.log("Email: ", email);

        // Encontrar al usuario en la base de datos
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: req.i18n.t('invalidCredentials') });
        }

        // Comparar contraseñas
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: req.i18n.t('invalidCredentials') });
        }

        // Generar token JWT incluyendo el rol
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET);

        // Devolver el token
        res.status(201).json({ message: token });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
};


// Password recovery controller
const recoverPassword = async (req, res) => {
    try {
        // Get user input
        const { email } = req.body;

        // Find the user in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: req.i18n.t('userNotFound') });
        }

        // Generate password reset token
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send password reset email with the resetToken
        const transporter = nodemailer.createTransport({
            // Email service configuration
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_email_password'
            }
        });

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: req.i18n.t('passwordRecoveryEmailSubject'),
            text: `${req.i18n.t('passwordRecoveryEmailText')} http://yourfrontend.com/reset-password/${resetToken}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: req.i18n.t('passwordRecoveryEmailSent') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
};

module.exports = {
    helloworld,
    signup,
    login,
    recoverPassword,
};