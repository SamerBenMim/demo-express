const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt =  require('bcryptjs')
const crypto = require('crypto')
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
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default: 'user',
    },
    password:{
        type:String,
        required : [true,'please provide a password'],
        minlength:8,
        select : false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password'],
        validate:{
            validator : function(el){ // this only works on save and create
                return el===this.password;
            },message:"passwords are not the same"
        },
        select : false // nest pas returner au client/output

    },

    passwordChangedAt: Date,
    PasswordResetToken:String,
    PasswordResetExpires: Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }

})

userSchema.pre('save', async function(next){
    console.log("pre save midlleware ************");
    if(this.isModified('password')){    
        this.password  = await bcrypt.hash(this.password,12); // cpu intensive to avoid brute force ,, 10 default value
        this.passwordConfirm = undefined // we dont need to persist it to db
    }
    next()
})

userSchema.pre('save',  function(next){
    

    if(this.isModified('password')&& !this.isNew){
        this.passwordChangedAt=Date.now()-1500 // we substract  seconds to make sure tht the token is alaways created after the paswword have been changer
    }  
    next()
})

//instance method is a method availabe on all documents of a collection
userSchema.methods.correctPassword= async function(candidatePassword,userPassword){ //we pass user password beaxause we can't use this.password bcause select is set false
 return await bcrypt.compare(candidatePassword,userPassword)//compares password even 1 is a hash and 2 is a string
}
//instance method
userSchema.methods.changedPasswordAfter=  function(JWTTimestamp){ //we pass decode.iat (issued at ) the time when the token is issued
    if(this.passwordChangedAt){
        console.log(this.passwordChangedAt);
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000)
        return (JWTTimestamp < changedTimestamp)
    }
    return false
}
userSchema.pre(/^find/,function(next){
//this pint to the current query
this.find({active:{$ne: false}});
next()

})

userSchema.methods.createPasswordResetToken=function(){
    const resetToken = crypto.randomBytes(32).toString('hex');//create random token
    this.PasswordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log({resetToken},this.PasswordResetToken);

    this.PasswordResetExpires=Date.now()+10*60*1000; //milliseconds // we had to save this modif to be changed in thee db when we call this instance method user.save()
    return resetToken; // we sent the unencrypted email token
}
const User = mongoose.model('User',userSchema) /* for the adequat collection Mongoose automatically looks for the plural, lowercased version of your model name.*///model var starts with a Capital letter // cree unmodel dont le nom est user et son model et le model userschema declare au debut
module.exports = User;

