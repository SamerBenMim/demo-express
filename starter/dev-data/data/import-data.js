const fs= require('fs')
const mongoose = require('mongoose')
const dotenv=require('dotenv');
const Tour =require('../../Models/tourModels')

dotenv.config({path :`${__dirname}/../../config.env`})

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
useNewUrlParser:true,
useCreateIndex:true,
useFindAndModify:false,
useUnifiedTopology: true
}).then(() =>{
    console.log("db connexion successful !!");
})

//read file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))
const importData = async ()=>{
    try{
        await Tour.create(tours) //create accepts also an array 
        console.log("data loaded successfully !!");
    }catch(e){
        console.log(e);
    }
    process.exit();

}
// DELETE ALL DATA FROM DB
const deleteData = async ()=>{
    
    try{
        await Tour.deleteMany() //create accepts also an array 
        console.log("data deleted successfully !!");

    }catch(e){
        console.log(e);
    }
    process.exit();

}

if(process.argv[2]==='--import') importData();
else if(process.argv[2]==='--delete')deleteData();
 
