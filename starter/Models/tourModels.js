const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    duration:{
        type:Number,
        required : [true,'a tour is required']
    },
    maxGroupSize:{
        type:Number,
        required : [true,'a tour must have a max'],
    },
    difficulty:{
        type :String,
        required : [true,'a tour must have a diff'],

    },
    ratingsQuantity:{
        type:Number,
        default:0
    } ,
    ratingsAverage:{
        type:Number,
        default:4.5
    } ,
    price :{
        type :Number,
        required : [true,"a tour should have a price"]
    },
    priceDiscount:Number,
    Summary:{
        type:String,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
        required:[true , 'descrition']
    },
    imageCover:{
        type:String,
        required:[true , 'imgs']
    },
    images:[String],
    createdAt:{
        type: Date,
        default:Date.now(),
        select:false  // permenantly hidden from the output
    },
    startDates:[Date],

})
const Tour = mongoose.model("Tour",tourSchema);

module.exports = Tour;