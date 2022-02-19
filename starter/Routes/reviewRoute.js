const express = require('express')
const reviewController = require('../Controllers/ReviewController')
const authController = require('./../Controllers/authenticationController')
const router = express.Router({mergeParams:true}); // get params of /tour route

router.route('/')/// we will mount this route on / reviews

.get(reviewController.getAllReviews)
.post(authController.protect,authController.restrictTo('user') ,reviewController.createReview)





module.exports = router