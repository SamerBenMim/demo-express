const express = require("express")

exports.aliasTopTours = (req,res,next)=>{
    req.query.limit='5'
    req.query.sort='-ratingsAverage,price'
    req.query.fields = 'name,price,summary,difficulty'
    next()
}

class APIFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }

    filter(){
        const queryObj = {...this.queryString}
        const excludedFields =['page','sort','limit','fields']
        excludedFields.forEach(el=> delete queryObj[el])
        /*const tours= await Tour.find()
        .where('duration').equals(5)
        .where('difficulty').equals('easy')*/
        
        //2-advanced-filtring
        let queryStr = JSON.stringify(queryObj);
        queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(str)=>`$${str}`)
        this.query.find(JSON.parse(queryStr))
    }

}

// const fs =require('fs')
const Tour = require("../Models/tourModels")
// const tours= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))


exports.createTour = async (req,res)=>{
    try{

       
        /*
        const newTour = new Tour({a:a,b:b})
        newTour.save()
        */ 
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status :'success',
            tours : newTour,
        })
    }
    catch(e){
        res.status(400).json({
            status: "error",
            message: e
        })
    }
}

exports.getAllTours = async (req,res)=>{
    try{

        //BUILD QUERY
/**   //1-filtring
        const queryObj = {
            ...req.query
        }
        const excludedFields =['page','sort','limit','fields']
        excludedFields.forEach(el=> delete queryObj[el])
        console.log(queryObj);
    const tours= await Tour.find()
    .where('duration').equals(5)
    .where('difficulty').equals('easy')
        // or
    
        //2-advanced-filtring
    let queryStr = JSON.stringify(queryObj);
    queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(str)=>`$${str}`)
    let query =  Tour.find(JSON.parse(queryStr))
**/
        //3- sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ') // price,avearge,name => price average name
            query=query.sort(sortBy)
        }{
            query.sort('-createdAt')
        }
        //4- field limiting
        if(req.query.fields){
            const  fields= req.query.fields.split(',').join(' ')
            query = query.select(fields)
        }else{
            query= query.select('-__v')//exclude __v field created by mongoose
        }

        // 5- pagination
        const page=req.query.page*1 || 1 //nice way to define a default param
        const limit=req.query.limit*1 || 100 //nice way to define a default param
        const skip =limit*(page-1)
        query = query.skip(skip).limit(limit);
        
        if(req.query.page){
            const numtours = await Tour.countDocuments();
            if(skip >= numtours) throw new Error('this page does not exist')
        }
        //EXCUTE QUERY
    const tours= await query
 

    res.status(200).json({
        status :'success',
        results: tours.length,
        data:{
        tours
        }
    });
    } catch (e){
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