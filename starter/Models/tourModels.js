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
    },
    startLocation:{
        type:{
            type:String,
            default :'Point',
            enum : ['Point'] // all possible =>only Point
        },
        coordinates:[Number], //array of number [latitude,longitude]
        adress:String,
        description:String
    },
    locations:[
        {
            type:{
                type:String,
                default :'Point',
                enum : ['Point'] // all possible =>only Point
            },   
            coordinates:[Number], //array of number [latitude,longitude]
            adress:String,
            description:String,
            day:Number
        }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User' // reference for User
        }

    ],



        

},
 

{
    toJSON :{ virtuals : true},//when the data is outputed as a Json
    toObbject :{ virtuals : true} // as a obj
})

tourSchema.virtual('durationWeeks').get(function(){
     return this.duartion /7 //virtual property are not persisted to database (conversion from date to hours)  this prop is calculated with every get from db
})

//VIRTUAL POPULATE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
tourSchema.virtual('reviews',{ // THE NAME OF THE VIRTUAL FIELDS
    ref:'Review', // name of the model, 
    foreignField:'tour', // the reference of the current model in the other model //the name in the other model were this model is saved // connect 2models
    localField:'_id'  // the reference of the current id in the current model

})



//DOCUMENT middelware
tourSchema.pre('save',function(next){
    console.log('this',this)

this.slug = sluguify(this.name, {lower :true}  ) ; next()
//this is the processed document
}) //pre acts before an events (save here) and create



/*for embedding data*/ //we will referenceing 
/*
tourSchema.pre('save',function(next){
  const guidesPromises = this.guides.map(async id =>await User.findById(id)); // array of promises
  this.guides = await guidesPromises.all(guidesPromises);
  next()
}) 
*/

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
tourSchema.pre(/^find/,function(next){ // all the strings that starts with find
    //point on the query not the document
    this.populate({path:'guides', select:'-__v -passwordChangedAt'})
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