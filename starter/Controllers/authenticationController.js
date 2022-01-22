const crypto = require('crypto')
const {promisify} = require('util');
const catchAsync = require("./../Utils/catchAsync")
const User = require('./../Models/UserModel')
const jwt = require('jsonwebtoken') 
const AppError=require('./../Utils/appError')
const sendEmail=require('./../Utils/email');
const { findOne } = require('./../Models/UserModel');

const generateToken = id =>{
  return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })   

}

const createSendToken = (user,statusCode,res)=>{
    const token = generateToken(user._id)
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user 
        }
    })
}



exports.signup = catchAsync(async(req,res ,next)=>{

    let newUser
    if(req.role){
     newUser = await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
       // passwordChangedAt:req.body.passwordChangedAt
    })
}
    else{
            newUser = await User.create({
            name: req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            role:req.body.role,
           // passwordChangedAt:req.body.passwordChangedAt
        })
    }
    createSendToken(newUser,201,res)

})

exports.login= catchAsync(async (req,res,next)=>{
    const {email,password} = req.body;
    //1) check if email & pass exist
    if(!email||!password){
       return next(new AppError('Please provideemail and password',400)); // return=>to make sure that the fn finishes 
    }
    //2) check if user exist
    const user =await User.findOne({email}).select('+password')//select only the wanted field from db even its is not selected(password)
    //3) check if pass is correct 
    // !!!!!!!!! const correct =  await user.correctPassword(password,user.password); we can do this but if the user does not exist this will genrate an errror
   
     if(!user || ! await user.correctPassword(password,user.password)){ // we can each test alone but we the hacker will get the info if the email or the pass is incorrect 
        return next(new AppError('Incorrect email or password',401))
    }
   
    //4) send token to client
    createSendToken(user,200,res)
 
    const token=generateToken(user._id);
    res.status(200).json({
        status:'success',
        token
    })

})

exports.protect = catchAsync( async (req,res,next)=>{ 
    /*
     * we send token in the header
    to send a token we alaways use a header called  Authorization (key) and the value "Bearer token"
     */
   //1) gettibg the token and check if it's there
   let token
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];

   }
   if(!token) return next(new AppError('You are not logged in ! Please login to get access',401))//401 unauthorized
   //2) verif token - validate token
   const decoded =   await promisify(jwt.verify)(token,process.env.JWT_SECRET)
   //3) check if user still exists
   const freshUser = await User.findById(decoded.id)
   if(!freshUser) {
       return next(new AppError('the token belonging to this token does no longer exist.'))
   }
   //4) check if user changed password after the token was issued // ou publiee
   if(freshUser.changedPasswordAfter(decoded.iat)){//iat issued at
    console.log(freshUser.changedPasswordAfter(decoded.iat));
   return next(new AppError('User recently changed password! Please log in again.',401))}

   //ACCESS TO PROTECTED ROUTE
   req.user=freshUser //to pass data to next middleware
   next();
});

exports.restrictTo = (...roles)=>{//we cant pass args to a middlewar fn car req,res,next,err but here we need to pass the authoriizzed persson => we wrap the middleware with a fn with params which return  that middleware
return (req,res,next)=>{
    //role is an array
    if(! roles.includes(req.user.role)){
        return next(new AppError('You do not have permission to perform this action',403)) //403 not authorized
    }
next();
}
}

exports.forgotPassword = catchAsync(async(req,res,next)=>{
    // 1) get user based on post email
    const user = await User.findOne({
        email:req.body.email
    })
    console.log("done***********************1");
    if(!user){
        return next(new AppError('there is no user with that email adress',404))
    } 
    // 2) generate the random reset token
   
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});
    // 3) send tho token to that email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to :${resetURL}.\n If you didn't forget your password please ignore this  `
    console.log("done***********************2");
    
    try{
        console.log("done***********************33");
 
        await sendEmail({
            email:user.email,
            subject:'Your pass reset token (valid for 10 min)',
            message
        }) 
    console.log("done***********************3");

        res.status(200).json({
            status:'success',
            message:'token sent to email!'
            
        })
    }catch(err){
        user.PasswordResetToken=undefined;
        user.PasswordResetExpires=undefined;
        await user.save({
            validateBeforeSave:false
        })
        console.log(err);
        return next(new AppError("there was an error sending the email. Try again later !",500))
    }

    })
    
exports.resetPassword = catchAsync( async(req,res,next)=>{
    // 1) get user based on token 

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest("hex") // it is a param, we passed it into url
    const user = await User.findOne({PasswordResetToken:hashedToken, PasswordResetExpires:{$gt: Date.now()} }) // check also if the user has expired
    // 2) if there is a user and token has not expired
    if(!user){
        return next( new AppError('Token is invalid or has expired ',400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    
    user.PasswordResetToken =undefined
    user.PasswordResetExpires=undefined
    await user.save()
    // 3) update changed passwordat

    // 4) log the user in ,send JWT
    createSendToken(user,200,res)

})

exports.updatePassword = catchAsync(async(req,res,next)=>{
    //1) get the user from collection
    user=await User.findById(req.user.id).select('+password');   
    //2)check pass
    if (! (await user.correctPassword(req.body.passwordCurrent,user.password)))
    {
        return next( new AppError('Your current password is wrong.',401))
    }

    //3) update pass
    user.password=req.body.password
    user.passwordConfirm=req.body.passwordConfirm;
    await user.save();
                        //user.findbyid and update does not work this does not work && presave middmeware does not work

    //4)log user in, send JWT 
    createSendToken(user,200,res)


})