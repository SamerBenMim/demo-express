const User = require("../Models/UserModel")
//const AppError = require("../Utils/appError")
//const APIFeatures = require('./../Utils/ApiFeatures')
const catchAsync = require("./../Utils/catchAsync")


 


exports.getAllUsers = catchAsync(async (req,res)=>{
    
    const users = await User.find();
    res.status(200).json({
        status :'success',
        results: users.length,
        data:{
        users
        }

})
})


exports.addUser =(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'this route is not defined'
    })

}
exports.getUser =(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'this route is not defined'
    })

}
exports.updateUser =(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'this route is not defined'
    })

}
exports.deleteUser =(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'this route is not defined'
    })

}