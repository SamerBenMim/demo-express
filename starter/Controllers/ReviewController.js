const Review = require('../Models/reviewModel')
const catchAsync = require ('../Utils/catchAsync')



exports.getAllReviews = catchAsync(async(req,res ,next)=>{
    let filter={}
    if(req.params.tourId) filter = {tour:req.params.tourId}
    const reviews = await Review.find(filter);
    res.status(200).json({
        status:"success",
        result : reviews.length,
        data:{
            reviews
        }
    })
})





exports.createReview = catchAsync(async(req,res ,next)=>{

//allow nested route
if(!req.body.tour) req.body.tour = req.params.tourId;
if(!req.body.user) req.body.user = req.user.id;

    
const newReviews = await Review.create(req.body); //if there areother fields the schema will ignore them  => SAFE!
    res.status(201).json({
        status:"success",
        data:{
           review:newReviews
        }
    })

})

