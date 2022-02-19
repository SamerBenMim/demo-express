const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema({
    review : {
        type : String,
        required : [true,'Review can not be empty!'],
    },
    
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type :Date,
        default : Date.now
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref : 'Tour',
        required : [true,'review must belong to a tour']
    },

    user:{
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        required : [true,'review must belong to a user']
    },



},
{
    //afficher les donne virtuelle (calculated value)
    toJSON :{ virtuals : true},//when the data is outputed as a Json
    toObbject :{ virtuals : true} // as a obj
}
);

reviewSchema.pre(/^find/,function(next){
    // this.populate(
    //     {
    //         path:'tour',
    //         select:'name' // take only the name
    //     }
    // ).populate({
    //     path:'user',
    //     select:'name photo'
    // })

    this.populate({
        path:'user',
        select:'name photo'
    })
next()
})
const Review= mongoose.model('Review',reviewSchema);
module.exports = Review;