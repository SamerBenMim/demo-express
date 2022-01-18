const express = require("express")
const app = express(); // add methods to app
const morgan = require('morgan')
const AppError = require("./Utils/appError")
const TourRouter = require('./Routes/tourRoute')
const UserRouter = require('./Routes/UserRoute')
const globalErrorHandler = require("./Controllers/errorController")
//MIDDLEWARES
app.use(express.json())  // the incoming reqs put post serons en json

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString(); //adds time to req
    next()
})
if( !(process.env.NODE_ENV==='development') ) app.use(morgan('dev'))

app.use('/api/v1/tours',TourRouter)
app.use('/api/v1/users',UserRouter)

app.all('*',(req,res,next)=>{ // all methods get post .. & all routers // to catch errors
// res.status(404).json({
//     status:"fail",
//     message:`can't find ${req.originalUrl}`
// })

const err = new Error(`can't find ${req.originalUrl}`)
err.status='fail';
err.statusCode= 404;
next(err); // if we pass anything to next it is an error it will neglegt other middlewares  and goes to Error middlware
})

app.use(globalErrorHandler)
    module.exports = app;


    
