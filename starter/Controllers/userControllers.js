const User = require("../Models/UserModel");
const AppError = require("../Utils/appError");
//const AppError = require("../Utils/appError")
//const APIFeatures = require('./../Utils/ApiFeatures')
const catchAsync = require("./../Utils/catchAsync")


 const filterObj = (obj, ...allowedFields)=>{
     const newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            newObj[el]=obj[el];
        }
    })
    return newObj
 }


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

exports.updateMe = catchAsync( async (req,res,next)=>{
    //1 create err if users posts a password data
    if(req.body.password|| req.body.passwordConfirm){
        return next(new AppError('this route is not for password update. Please use /updateMyPassword',400)) // 400 bad req
    }
    //2 filtered out unwanted  fields
    const filteredBody = filterObj(req.body,'name','email'); //keep only name and email field
    //3 update user doc
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{new : true,runValidators:true})//new return the updated obj -- we put an invalid email **validator 
    res.status(200).json({
        status:'success',
        data:{
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync( async (req,res,next)=>{
 
    const updatedUser = await User.findByIdAndUpdate(req.user.id,{active:false})//new return the updated obj -- we put an invalid email **validator 
    res.status(204).json({ //deleted
        status:'success',
        data:null
    })
})



exports.updateUser=(req,res,next)=>{
    //1) create err if user Posts password data
    //2) update user docs
}

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