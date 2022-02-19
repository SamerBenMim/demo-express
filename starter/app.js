const express = require("express")
//const rateLimit = require("express-rate-limit");
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp') //http params pollution.

const app = express(); // add methods to app
const morgan = require('morgan')
const AppError = require("./Utils/appError")
const TourRouter = require('./Routes/tourRoute')
const UserRouter = require('./Routes/UserRoute')
const ReviewRouter = require('./Routes/reviewRoute')
const globalErrorHandler = require("./Controllers/errorController")

//GLOBAL MIDDLEWARES

////Set Security HTTP headers
app.use(helmet()) //protections

////dev logging
if( (process.env.NODE_ENV==='development') ) app.use(morgan('dev'))


//limit reqs from same api
// const limiter = rateLimit({
    //     max:100,                    //ratelimit is a fn that takes an ibject of options
    //     windowMs:60*60*1000,  // allow 100 req from 1 ip in 1h
    //     message:'Too many requests from this IP,please try again in an hour!'
    // })
    
    //app.use(limiter);
    
    
    //////body Parser
    app.use(express.json({ limit:'10kb'}))  // the incoming reqs put post serons en json (req.body) // limit 10kbyte
    
    //data sanitization against nosql query injection && against xss
    app.use(mongoSanitize()) // clean req from $ and . ====>try yo login without providing an email instead use a query injection {"$gt":""} //alawas true 
   
    app.use(xss()) //clean  user input from html which may contain javascript 
    //prevent params pollution
    app.use(hpp({          //sort=price& sort=date is not allowed
        whitelist:[
            'duartion', // duartion=5& duration=3 is allowed
            'ratingsQuantity', 'ratingsAverage','difficulty','price',
        ]
    })) 


    app.use((req,res,next)=>{
        req.requestTime = new Date().toISOString(); //adds time to req
        //console.log("header",req.headers);
        next()
    })
    
    app.use('/api/v1/tours',TourRouter)
    app.use('/api/v1/users',UserRouter)
    app.use('/api/v1/reviews',ReviewRouter)
    
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


    
