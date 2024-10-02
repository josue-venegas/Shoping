const express = require('express');
const { urlencoded } = require('express');

module.exports = (app) => {
  app.use(express.json());
  app.use(urlencoded({ extended: true }));
};
