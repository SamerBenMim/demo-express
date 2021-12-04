const express = require("express")
const app = express(); // add methods to app
const morgan = require('morgan')

const TourRouter = require('./Routes/tourRoute')
const UserRouter = require('./Routes/UserRoute')

//MIDDLEWARES
app.use(express.json())  

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString(); //adds time to req
    next()
})
if( !(process.env.NODE_ENV==='development') ) app.use(morgan('dev'))

app.use('/api/v1/tours',TourRouter)
app.use('/api/v1/users',UserRouter)

module.exports = app;


    
