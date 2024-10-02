const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

// Login controller
const login = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: req.i18n.t('userNotFound') });
        }

        // Check if the password is correct
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: req.i18n.t('invalidCredentials') });
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        // Save the refresh token to the user in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Set options for cookies
        const options = {
            httpOnly: true,
            secure: false, // Enable in a production environment with HTTPS
        };
        
        // Set the tokens in a cookies and send a response
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: req.i18n.t('loginSuccess'), 
                accessToken: accessToken,
                refreshToken: refreshToken
              });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
};

// Logout controller
const logout = async (req, res) => {
    // Remove the refresh token from the user's information
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: undefined },
      },
      { new: true }
    );
  
    // Set options for cookies
    const options = {
      httpOnly: true,
      secure: false, // Enable in a production environment with HTTPS
    };
  
    // Clear the access and refresh tokens in cookies
    return res
        .status(200)
        .cookie("accessToken", "", options)
        .cookie("refreshToken", "", options)
        .json({ message: req.i18n.t('logoutSuccess'), 
                accessToken: "",
                refreshToken: ""
              });
  };

// Password recovery controller
const recoverPassword = async (req, res) => {
    try {
        // Get user input
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: req.i18n.t('userNotFound') });
        }

        // Generate password reset token
        const resetToken = jwt.sign({ email }, process.env.RESET_TOKEN_SECRET, {
            expiresIn: '1h',
        });

        // Send password reset email with the resetToken
        const transporter = nodemailer.createTransport({
            pool: true,
            host: "smtp-relay.gmail.com",
            port: 465,
            secure: true, // use TLS
            auth: {
              user: process.env.EMAIL_SENDER_USER,
              pass: process.env.EMAIL_SENDER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER_USER,
            to: email,
            subject: req.i18n.t('passwordRecoveryEmailSubject'),
            text: `${req.i18n.t('passwordRecoveryEmailText')} http://localhost:4200/reset-password/${resetToken}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: req.i18n.t('passwordRecoveryEmailSent') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
};

module.exports = {
    login,
    logout,
    recoverPassword,
};