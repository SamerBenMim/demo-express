const express = require('express')
const authController = require('../Controllers/authenticationController')

const router = express.Router();
const {getAllUsers,addUser,getUser,updateUser,deleteUser} = require('../Controllers/userControllers')



router.post('/signup',authController.signup)


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