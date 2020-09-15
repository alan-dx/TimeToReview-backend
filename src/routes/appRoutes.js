const express = require('express');
const appController = require('../app/controllers/appController');
const routes = express.Router();
const authMiddleware = require('../app/middlewares/auth');

routes.use(authMiddleware)

routes
    .get('/verifyToken', appController.verifyToken)
    .post('/createReview', appController.createReview)
    .delete('/deleteReview', appController.deleteReview)
    .put('/editReview', appController.editReview)
    .get('/indexReviews', appController.indexReview)

module.exports = routes;