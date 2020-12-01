var express=require('express');
var router=express.Router();
var Vehicle=require('../models/vehicle');
var Category=require('../models/category');


router.get('/',(req,res)=>{

    Vehicle.find({})
    .then(vehicles=>{
        res.render('all_Vehicles',{
            title:'All Vehicles',
            vehicles:vehicles,
        })
    })
    .catch(err=>console.log(err));
});

router.get('/:category',(req,res)=>{

    var categorySlug=req.params.category;

    Category.findOne({slug:categorySlug})
    .then(c=>{
        Vehicle.find({category:categorySlug})
        .then(vehicles=>{
            res.render('cat_Vehicles',{
                vehicles:vehicles,
                title:c.title
            })
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));

});


router.get('/:category/m/:Vehicle',(req,res)=>{

    Vehicle.findOne({slug:req.params.Vehicle})
    .then(Vehicle=>{ 
        res.render('Vehicle',{
            p:Vehicle,
            title:Vehicle.title
        })
    })
    .catch(err=>console.log(err));
});


module.exports=router;