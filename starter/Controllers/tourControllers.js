const Tour = require("../Models/tourModels")
const AppError = require("../Utils/appError")
const APIFeatures = require('./../Utils/ApiFeatures')
const catchAsync = require("./../Utils/catchAsync")

exports.aliasTopTours = (req,res,next)=>{
    req.query.limit='5'
    req.query.sort='-ratingsAverage,price'
    req.query.fields = 'name,price,summary,difficulty'
    next()
}



exports.createTour = catchAsync  (async(req,res,next)=>{
   // try{   
        /*
        const newTour = new Tour({a:a,b:b})
        newTour.save()
        */ 
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status :'success',
            tours : newTour,
        })
  //  }
  /*  catch(e){
        res.status(400).json({
            status: "error",
            message: e
        })
    }*/
})

exports.getAllTours = async (req,res)=>{
    try{

        //EXCUTE QUERY
        const features = new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    const tours= await features.query
 
    res.status(200).json({
        status :'success',
        results: tours.length,
        data:{
        tours
        }
    });
    } catch (e){
        console.log(e)
        res.status(404).json({
            status: "error",
            message: e
        })
    } 
}


exports.getTour = async(req,res)=>{ // : pour parametre ? pour optional param
    try{
        const tour = await Tour.findById(req.params.id)
        //const tour = await Tour.findOne({_id : req.params.id})
       if(!tour) {
        res.status(404).json({
            status:"fail",
            message:"no tour found with that id"
        })
       }
         
        res.status(200).json(
            {status :'success', 
            data:{
                tour
            }   
        })
    }
    catch (e)  {
        res.status(404).json({
            status:"fail",
            message:e
        })
    }
        
}

exports.updateTour= async (req,res)=>{ 
        
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true, //return the new object
            runValidators:true
        })

        if(!tour) {
            res.status(404).json({
                status:"fail",
                message:"no tour found with that id"
            })
           }
        res.status(200).json(
            {status :'success', 
            data:{
                tour
            }   
        })
    }catch(e){
        res.status(404).json({
            status:"fail",
            message:e
        })
    }
    
}

exports.deleteTour= async (req,res)=>{ 
        
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id,req.body)
        if(!tour) {
            res.status(404).json({
                status:"fail",
                message:"no tour found with that id"
            })
           }
        res.status(204).json(
            {status :'success', 
            data: null
        })
    }catch(e){
        res.status(404).json({
            status:"fail",
            message:e
        })
    }
    
}

exports.getTourStats  = async(req,res)=>{
    try{
        const stats = await Tour.aggregate([
        {
            $match : {ratingsAverage:{ $lte: 20}}
        },
        {
            $group:{
                _id : '$difficulty',
                numTours:{$sum: 1},
                numRatings:{$sum :'$ratingsQuantity' },
                avgRating:{$avg : '$ratingsAverage'},
                avgPrice : {$avg : '$price'},
                minPrice:{ $min :'$price'},
                maxPrice:{ $max :'$price'}
            }
        },{
            $sort:{avgPrice: 1 } // 1 for ascending
        },
        {
            $match : {_id:{ $ne:'easy'}}
        },
        ])
        res.status(200).json(
            {status :'success', 
            data: stats
        })
    }catch(e){
        res.status(404).json({
            status:"fail",
            message:e
        })
    }
}

exports.getMonthlyPlan  = async(req,res)=>{
    try{
        const year = req.params.year*1;
        const plan = await Tour.aggregate([
            {
                $unwind : '$startDates' // separer les tours selon startdates donc 9 tours chaque tour 3 date donc 27 tour
            },
            {    
                $match:{//select
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $gte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},//extraire month from startDates
                    numTourStarts : {$sum: 1},
                    tours : {$push:'$name'}
                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                    $project:{ _id:0 }   
            },
            {
                $sort:{ numTourStarts:-1}
            },
            {
                $limit:12
            }
                
        ])
        res.status(200).json(
            {status :'success', 
            data: plan
        })
    }catch(e){
        res.status(404).json({
            status:"fail",
            message:e
        })
    }

}


/*exports.getAllTours = (req,res)=>{
    res.status(200).json({status :'success',
    results: tours.length,
    tours}); 
}
exports.getTour =(req,res)=>{ // : pour parametre ? pour optional param
    // clg(req.params)= {id:'5'}
    const tour = tours.find(el=>el.id===req.params.id*1) 
    if(req.params.id> tours.length){
        return res.status(404).json({
            status: "fail",
            message: 'invalid id'
        })
    }
    res.status(200).json(
        {status :'success', 
        requestedAt : req.requestTime,
        data:{
            tour
        }   
    })
    
}


    
    exports.updateTour=(req,res)=>{
        //status 200 lors dun update
    }
    
    
    exports.deleteTour=(req,res)=>{ 
        
        id = req.params.id*1;
        if(id>tours.length){
            return res.status(404).json({
                status: "fail",
                message:'invalid id'
            })  
        }
        tours.slice(1,1)
        fs.writeFile(`${ __dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{console.log(err);})
        res.status(204).json({ //delete , null
            status:"success",
            data:null
            
        })
        
    }*/
    
    // exports.checkID = (req,res,next,val)=>{
    //     if(req.params.id*1> tours.length){
    //         return res.status(404).json({
    //                 status: "fail",
    //                     message: 'invalid id'
    //                 })
    //             }
               
    //             next();
    // } 
    
    // exports.checkBody= (req,res,next)=> {
    //     if(!req.body.price || !req.body.name){
    //         return res.status(400).json({
    //             status:"fail",
    //             message:"missing name or price"
    //         })
    //         next()
    //     }
    // }


    /*exports.addTour =(req,res)=>{
        const newId= tours[tours.length-1].id +1;
        const newTour= Object.assign({id:newId},req.body)
        tours.push(newTour);
        
        fs.writeFile(`${ __dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
            console.log(err+"zezez")})
            res.status(201).json({
                status :'success',
                data:{
                    tours : newTour
                }
            });
        }*/
