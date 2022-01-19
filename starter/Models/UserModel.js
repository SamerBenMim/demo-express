const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt =  require('bcryptjs')
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
        required:[true,'please confirm your password'],
        validate:{
            validator : function(el){ // this only works on save and create
                return el===this.password;
            },message:"passwords are not the same"
        }
    } 


})
userSchema.pre('save', async function(next){
    if(this.isModified('password')){    
        this.password  = await bcrypt.hash(this.password,12); // cpu intensive to avoid brute force ,, 10 default value
        this.passwordConfirm = undefined // we dont need to persist it to db
    }
    next()
})

const User = mongoose.model('User',userSchema) /* for the adequat collection Mongoose automatically looks for the plural, lowercased version of your model name.*///model var starts with a Capital letter // cree unmodel dont le nom est user et son model et le model userschema declare au debut
module.exports = User;