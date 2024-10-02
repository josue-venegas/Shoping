const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to check if the user is authenticated
const verifyJWT = async (req, res, next) => {
    // Look for the token in cookies or headers
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: req.i18n.t('noToken') });
    }
  
    // Check if the token is valid using a secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    // Get the user linked to the token
    const user = await User.findById(decodedToken?._id).select(
      "-password"
    );
    if (!user) {
      return res.status(401).json({ error: req.i18n.t('invalidToken') });
    }
  
    // Attach the user to the request
    req.user = user;
    next();    
};

module.exports = verifyJWT;