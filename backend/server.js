require('dotenv').config();
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const routes = require('./routes/routes');
const authController = require('./controllers/auth');

const express = require('express');
const { urlencoded } = require('express');
const cors = require('cors');
const app = express();

const User = require('./models/user');

const mongoose = require('mongoose');

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to check if the user is authenticated
const verifyJWT = async (req, res, next) => {
    // Look for the token in cookies or headers
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(403).json({ error: req.i18n.t('noToken') });
    }

    // Check if the token is valid using a secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: req.i18n.t('invalidToken') });
      }
    });

    // Get the user linked to the token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // If the user isn't found, deny access with a 404 Not Found status
    if (!user) {
      return res.status(404).json({ error: req.i18n.t('userNotFound') });
    }

    // Attach the user to the request
    req.user = user;
    next();    
};

// Init i18next
i18next
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      es: {
        translation: require('./locales/es.json'),
      },
      en: {
        translation: require('./locales/en.json'),
      },
      fr: {
        translation: require('./locales/fr.json'),
      },
    },
  });

app.use(i18nextMiddleware.handle(i18next));

// Middleware to change the language of the API
app.use((req, res, next) => {
  const { lang } = req.query;
  if (lang) {
    req.i18n.changeLanguage(lang).then(() => next());
  } else {
    next();
  }
});

// Middleware to enable CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Public routes
app.post('/api/signup', authController.signup); 
app.post('/api/login', authController.login);
app.post('/api/recover-password', authController.recoverPassword);

// Private routes
app.use('/api', verifyJWT, routes);

// Connect to the database
mongoose.connect(process.env.MONGODB_URI,).then(() => {
  console.log('Connected to MongoDB');

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});