require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const i18next = require('i18next');
const verifyToken = require('./middlewares/tokenMiddleware');
const public_routes = require('./routes/public_routes');
const private_routes = require('./routes/private_routes');

// Initialize app
const app = express();

// Load middlewares
require('./middlewares/bodyParser')(app);
require('./middlewares/cookieParser')(app);
require('./middlewares/corsMiddleware')(app);
require('./middlewares/i18nextMiddleware')(app);

// Public routes
app.use('/api', public_routes);

// Private routes
app.use('/api', verifyToken, private_routes);

// Connect to the database
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log(i18next.t('databaseConnected'));

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`${i18next.t('serverStarted')} http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error(i18next.t('databaseError'), error.message);
});
