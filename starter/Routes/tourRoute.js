const express = require("express")
const tourController = require('../Controllers/tourControllers')

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
  .get(tourController.getAllTours)
  

router 
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour)



  module.exports = router;