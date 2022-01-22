const express = require('express')
const authController = require('../Controllers/authenticationController')

const router = express.Router();
const {getAllUsers,addUser,getUser,updateUser,deleteUser,deleteMe,updateMe} = require('../Controllers/userControllers')



router.post('/signup',authController.signup)
router.post('/login',authController.login)

router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)

router.patch('/updateMyPassword',authController.protect,authController.updatePassword)
router.patch('/updateMe',authController.protect,updateMe)

router.delete('/deleteMe',authController.protect,deleteMe)


//for sys admin
router
  .route('/')
  .get(getAllUsers) 
  .post(addUser)

  router 
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router ;



// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',addTour);
//app.patch('/api/v1/tours/:id',updateTour);
//app.delete('/api/v1/tours/:id',deleteTour)