const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

// Generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
      // Find the user by ID in the database
      const user = await User.findById(userId);
  
      // Generate an access token and a refresh token
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      // Save the refresh token to the user in the database
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      // Return the generated tokens
      return { accessToken, refreshToken };
    } catch (error) {
      // Handle any errors that occur during the process
      throw new Error(error.message);
    }
};

// Refresh tokens
const refreshAccessToken = async (req, res) => {
    // Retrieve the refresh token from cookies or request body
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
  
    // If no refresh token is present, deny access with a 401 Unauthorized status
    if (!incomingRefreshToken) {
      return res.status(401).json({ error: req.i18n.t('noToken') });
    }
  
    try {
      // Verify the incoming refresh token using the secret key
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      // Find the user associated with the refresh token
      const user = await User.findById(decodedToken?._id);
  
      // If the user isn't found, deny access with a 404 Not Found status
      if (!user) {
        return res.status(404).json({ error: req.i18n.t('userNotFound') });
      }
  
      // If the stored refresh token doesn't match the incoming one, deny access with a 401 Unauthorized status
      if (user?.refreshToken !== incomingRefreshToken) {
        return res.status(401).json({ error: req.i18n.t('invalidToken') });
      }
  
      // Set options for cookies
      const options = {
        httpOnly: true,
        secure: true, // Enable in a production environment with HTTPS
      };
  
      // Generate new access and refresh tokens for the user
      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
      );
  
      // Set the new tokens in cookies
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ accessToken, refreshToken, message: req.i18n.t('tokenRefreshed') });
    } catch (error) {
      // Handle any errors during token refresh with a 500 Internal Server Error status
      return res.status(500).json({ error: error.message });
    }
  };

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

        // Save the user to the database in MongoDB
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            city,
            country
        });

        // Return a success message
        res.status(201).json({ message: req.i18n.t('userCreated') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
};

// Login controller
const login = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: req.i18n.t('invalidCredentials') });
        }

        // Check if the password is correct
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: req.i18n.t('invalidCredentials') });
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
            user._id
        );

        // Set options for cookies
        const options = {
            httpOnly: true,
            secure: false, // Enable in a production environment with HTTPS
        };
        
        // Return the token and set the refresh token in a cookie
        res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: req.i18n.t('loginSuccess') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
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
      .cookie("accessToken", options)
      .cookie("refreshToken", options)
      .json({ message: req.i18n.t('logoutSuccess') });
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
            text: `${req.i18n.t('passwordRecoveryEmailText')} http://localhost:4200/reset-password/${resetToken}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: req.i18n.t('passwordRecoveryEmailSent') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
};

module.exports = {
    signup,
    login,
    logout,
    recoverPassword,
    refreshAccessToken,
};