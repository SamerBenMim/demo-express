const mongoose = require('mongoose')
const sluguify =require('slugify') // remplcae" " par - et avec params supprime ....
const tourSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    slug : String , // cree ine forme dun url
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
    secretTour :{
        type : Boolean,
        default : false,
    }

}, {
    toJSON :{ virtuals : true},//when the data is outputed as a Json
    toObbject :{ virtuals : true} // as a obj
})

tourSchema.virtual('durationWeeks').get(function(){
     return this.duartion /7 //virtual property are not persisted to database (conversion from date to hours)  this prop is calculated with every get from db
})


//DOCUMENT middelware
tourSchema.pre('save',function(next){
    console.log('this',this)

this.slug = sluguify(this.name, {lower :true}  ) ; next()
//this is the processed document
}) //pre acts before an events (save here) and create

// post middleware 
tourSchema.post('save', function(doc,next){
next() // post sexecute apres que les evnts sont terminer 
})


//QUERY middelware
tourSchema.pre(/^find/,function(next){ // all the strings that starts with find
    //point on the query not the document
    this.find({secretTour : {$ne:true}}) // eviter de retourner les tour secret  //this is a query
    this.start = Date.now()
    next();
})
tourSchema.post(/^find/,function(docs,next){ // access to all the docs obtained from the query
    //point on the query not the document

   console.log(`query took ${Date.now() - this.start } milliseconds`)
    next();
})

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate',function(next){ // all the strings that starts with find
    //point on the current aggergation
    this.find({secretTour : {$ne:true}}) // eviter de retourner les tour secret  //this is a query
    this.start = Date.now()
    next();
})
const Tour = mongoose.model("Tour",tourSchema);


module.exports = Tour;