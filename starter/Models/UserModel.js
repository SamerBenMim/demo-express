const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name:{
        type :String,
        required : [true,'please tell us your name!']
    },
    email : {
        type:String,
        required:[true,"please provide an email"],
        unique : true,
        lowercase:true , //transform to lower case
        validate : [validator.isEmail,['Please enter a valid email']]
    },
    photo : String,
    password:{
        type:String,
        required : [true,'please provide a password'],
        minlength:8,
    
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password']
    } 


})