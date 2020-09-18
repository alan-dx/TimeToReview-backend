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
    .get('/listUser', appController.listUser)
    .delete('/deleteUser', appController.deleteUser)
    .post('/createSubject', appController.createSubject)
    .get('/indexSubjects', appController.indexSubjects)
    .put('/editSubject', appController.editSubject)
    .post('/createRoutine', appController.createRoutine)
    .get('/indexRoutines', appController.indexRoutines)
    .put('/editRoutine', appController.editRoutine)

module.exports = routes;