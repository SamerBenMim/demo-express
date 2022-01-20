const {promisify} = require('util');
const catchAsync = require("./../Utils/catchAsync")
const User = require('./../Models/UserModel')
const jwt = require('jsonwebtoken') 
const AppError=require('./../Utils/appError')
const generateToken = id =>{
  return  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })   

}

exports.signup = catchAsync(async(req,res ,next)=>{

    const newUser = await User.create({
        name: req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChangedAt:req.body.passwordChangedAt
    })
    const token = generateToken(newUser._id)
    res.status(201).json({
        status:'success',
        token,
        data:{
            user: newUser 
        }
    })
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