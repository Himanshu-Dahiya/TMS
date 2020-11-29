var mongoose =require('mongoose');

var VehicleSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String
    }
    
});

var Vehicle=mongoose.model('Vehicle',VehicleSchema);

module.exports=Vehicle;