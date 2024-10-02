const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    lng: 'es',
    fallbackLng: 'en',
    resources: {
      es: { translation: require('../locales/es.json') },
      en: { translation: require('../locales/en.json') },
      fr: { translation: require('../locales/fr.json') }
    },
  });

module.exports = (app) => {
  app.use(i18nextMiddleware.handle(i18next));
  app.use((req, res, next) => {
    const { lang } = req.query;
    if (lang) {
      req.i18n.changeLanguage(lang).then(() => next());
    } else {
      next();
    }
  });
};
