const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
const authController = require('./controllers/auth');
require('dotenv').config();

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json()); // Asegúrate de agregar esto

// Middleware para verificar el token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    console.log("Token: ", token);

    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
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

// Middleware para cambiar el idioma según el parámetro de consulta
app.use((req, res, next) => {
  const { lang } = req.query;
  if (lang) {
    req.i18n.changeLanguage(lang).then(() => next());
  } else {
    next();
  }
});

// Middleware para habilitar CORS
app.use(cors({
  origin: 'http://localhost:4200', // Cambia esto por la URL de tu frontend si es diferente
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

// Rutas públicas
app.post('/api/signup', authController.signup); 
app.post('/api/login', authController.login);
app.post('/api/recover-password', authController.recoverPassword);

// Usar el middleware de autenticación en las rutas que requieren autenticación
app.use('/api', authenticateJWT, routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
