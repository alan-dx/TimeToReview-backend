const express = require('express');
const authController = require('../app/controllers/authController');
const { get } = require('../modules/mailer');
const routes = express.Router();

routes
    .post('/signUp', authController.signUp)
    .post('/signIn', authController.signIn)
    .post('/forgotPassword', authController.forgotPassword)
    .post('/resetPassword', authController.resetPassword)
    .get('/privacyPolicy', authController.privacyPolicy)
    
module.exports = routes;