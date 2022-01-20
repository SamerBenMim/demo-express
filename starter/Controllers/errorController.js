const AppError = require("../Utils/appError")

const handleCastErrorDB = err=>{
    const message =`Invalid ${err.path} ${err.value}`
    return new AppError(message,404);
}
const handleJWTError = ()=> new AppError('Invalid token. Please login again',)

const handleJWTExpiredError = ()=> new AppError('Your Token has expired. Please login again',)

const handleValidationErrorDB = err=>{ //patch 
    const errors = Object.values(err.errors).map(el =>el.message);
    const message =`Invalid Input data ${errors.join(". ")}`
    return new AppError(message,400);
}
const handleDuplicateFieldsDB = err=>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message =`duplicate field value : ${value} .Please use another value  `
    return new AppError(message,400);
}
const sendErrorDev= (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
       })
}


const sendErrorProd= (err,res)=>{
    if(err.isOperational){
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
       })
}
else{ // programming errors
    //1) log error
    console.log('error !!!' , err)
    //2) send generic message
res.status(500).json( {
    status:'error',
    message:"something went wrong ! "
})
}
}  

module.exports = (err,req ,res ,next)=>{ // error handling middleware car with 4 params
    err.statusCode = err.statusCode || 500 ;
    err.status=err.status||"error";

    if(process.env.NODE_ENV ==='development') sendErrorDev(err,res)
    else if(process.env.NODE_ENV ==='production'){

        let error ={...err}
        if(err.name === 'CastError')        error = handleCastErrorDB(err) 
        // pas de format d'id fi find tour 
        if(err.code === 11000) error = handleDuplicateFieldsDB(err)// pas de format d'id fi find tour 
        if(err.name === 'ValidationError') error = handleValidationErrorDB(err)
        if(err.name === 'JsonWebTokenError') error = handleJWTError()// pas de format d'id fi find tour 
        if(err.name === 'TokenExpiredError') error = handleJWTExpiredError()// pas de format d'id fi find tour 

        sendErrorProd(error,res)
    }
    else {
        console.log( "mode" + process.env.NODE_ENV)
    }
    
    
    
}

