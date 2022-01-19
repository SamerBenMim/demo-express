const catchAsync = require("./../Utils/catchAsync")
const User = require('./../Models/UserModel')

exports.signup = catchAsync(async(req,res ,next)=>{
    const newUser = await User.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            user: newUser 
        }
    })
})