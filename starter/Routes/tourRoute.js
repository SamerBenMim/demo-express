const express = require("express")
const tourController = require('../Controllers/tourControllers')
const {protect,restrictTo} = require('./../Controllers/authenticationController')
const router = express.Router();

//router.param('id',checkID) // param middleware permet de tester les param avant de passer au autre middleware

router.route('/top-5-cheap') 
.get( tourController.aliasTopTours, tourController.getAllTours) // middleware to add params to request 

router
    .route('/tour-stats')
    .get(tourController.getTourStats)
router
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan)

router 
  .route("/")
  .post(tourController.createTour)
  .get(protect,tourController.getAllTours)
  

router 
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(protect,
    restrictTo("admin"),
    tourController.deleteTour)



  module.exports = router;