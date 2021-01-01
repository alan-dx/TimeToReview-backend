const express = require('express');
const authController = require('../app/controllers/authController');
const routes = express.Router();

routes
    .post('/signUp', authController.signUp)
    .post('/signIn', authController.signIn)
    .post('/forgotPassword', authController.forgotPassword)
    .post('/resetPassword', authController.resetPassword)
    
module.exports = routes;