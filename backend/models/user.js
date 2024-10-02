const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name:       { type: String, required: true },
        email:      { type: String, required: true, unique: true },
        password:   { type: String, required: true },
        phone:      { type: String, required: true },
        address:    { type: String, required: true },
        city:       { type: String, required: true },
        country:    { type: String, required: true },
        role:       { type: String, enum: ['Admin', 'User'], default: 'User' },
        refreshToken: { type: String },
        dateCreated: { type: Date, default: Date.now },
    }
);

// Middleware to hash the password before saving it to the database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check if the entered password is correct
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        { 
            _id: this._id,
            email: this.email,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { 
            expiresIn: '15m',
        }
    );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { 
            _id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '7d',
        }
    );
};

module.exports = mongoose.model('User', userSchema);