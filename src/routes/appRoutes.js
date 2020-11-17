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
    .post('/concludeReview', appController.concludeReview)
    .get('/indexReviews', appController.indexReview)
    .get('/indexAllReviews', appController.indexAllReviews)
    .post('/listUser', appController.listUser)
    .delete('/deleteUser', appController.deleteUser)
    .post('/createSubject', appController.createSubject)
    .get('/indexSubjects', appController.indexSubjects)
    .put('/editSubject', appController.editSubject)
    .delete('/deleteSubject', appController.deleteSubject)
    .post('/createRoutine', appController.createRoutine)
    .get('/indexRoutines', appController.indexRoutines)
    .put('/editRoutine', appController.editRoutine)
    .delete('/deleteRoutine', appController.deleteRoutine)
    .post('/concludeCycle', appController.concludeCycle)

module.exports = routes;