const jwt = require("jsonwebtoken");
const User = require("../models/user");

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
      // Verify if the incoming refresh token is valid
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      // Find the associated user
      const user = await User.findById(decodedToken?._id);
      if (!user) {
        return res.status(404).json({ error: req.i18n.t('userNotFound') });
      }
  
      // If the stored refresh token doesn't match the incoming one, deny access with a 401 Unauthorized status
      const refreshToken = user.refreshToken;
      if (refreshToken !== incomingRefreshToken) {
        return res.status(401).json({ error: req.i18n.t('invalidToken') });
      }
  
      // Generate new access and refresh tokens
      const accessToken = user.generateAccessToken();

      // Set options for cookies
      const options = {
        httpOnly: true,
        secure: false, // Enable in a production environment with HTTPS
      };
  
      // Set the new tokens in cookies and send a response
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: req.i18n.t('tokenRefreshed'), 
                accessToken: accessToken,
                refreshToken: refreshToken
              });
    } catch (error) {
      return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
};

module.exports = {
    refreshAccessToken,
};