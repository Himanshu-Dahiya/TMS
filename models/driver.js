var mongoose =require('mongoose');

var DriverSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    licenseNo:{
        type:String,
        required:true
    }
    
});

var Driver=mongoose.model('Driver',DriverSchema);

module.exports=Driver;