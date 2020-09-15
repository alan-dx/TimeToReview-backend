const express = require('express');
const authController = require('../app/controllers/authController');
const routes = express.Router();

routes
    .post('/signUp', authController.signUp)
    .post('/signIn', authController.signIn)
    
module.exports = routes;