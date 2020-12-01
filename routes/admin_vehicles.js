var express=require('express');
var router=express.Router();
var Vehicle=require('../models/vehicle');
var Category=require('../models/category');
var auth=require('../config/authenticate');
var isAdmin=auth.isAdmin;

router.get('/',isAdmin,(req,res)=>{
    var count;
    Vehicle.count({},(err,c)=>{
        count=c;
    });
    Vehicle.find({})
    .then(vehicles=>{
        res.render('admin/vehicles',{
            vehicles:vehicles,
            count:count
        })
    })
    .catch(err=>console.log(err));
});

router.get('/add-vehicle',isAdmin,(req,res)=>{
    var title='';
    var desc='';
    //var price='';
    var image='';

    Category.find({}).then(categories=>{
    res.render('admin/add_vehicle',{
        title:title,
        desc:desc,
        categories:categories,
        //price:price,
        image:image
    })
    })
    .catch(err=>console.log(err));
});

router.post('/add-vehicle',(req,res)=>{
    
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('desc','Description must have a value').notEmpty();
    //req.checkBody('price','Price must have a value').isDecimal();
    req.checkBody('image','Image must have a value').notEmpty();

    var title=req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    //var price = req.body.price;
    var image = req.body.image;
    var category = req.body.category;

    var errors = req.validationErrors();

    if (errors) {
        Category.find({})
        .then(categories=>{
        res.render('admin/add_vehicle', {
            errors: errors,
            title: title,
            desc: desc,
            //price:price,
            categories:categories,
            image:image
        });
    })
    .catch(err=>console.log(err));
    }
    else {
        Vehicle.findOne({slug: slug}, function (err, vehicle) {
            if (vehicle) {
                //req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/add_vehicle', {
                    title: title,
                    desc: desc,
                    //price:price,
                    image:image
                });
            } else {
                var vehicle = new Vehicle({
                    title: title,
                    desc: desc,
                    //price:price,
                    image:image,
                    slug:slug,
                    category:category
                });

                vehicle.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    res.redirect('/admin/vehicles');
                 });
            }
        });
    }
});


router.get('/edit-vehicle/:id',isAdmin,(req,res)=>{

    var id =req.params.id;

    Category.find({})
    .then(categories=>{
        Vehicle.findById(id)
        .then(vehicle=>{
        res.render('admin/edit_vehicle',{
            title:vehicle.title,
            desc:vehicle.desc,
            image:vehicle.image,
            //price:vehicle.price,
            categories:categories,
            category:vehicle.category,
            id:id
        })
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
});


router.post('/edit-vehicle/:id',(req,res)=>{

    var title=req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    //var price = req.body.price;
    var image = req.body.image;
    var category = req.body.category;
    var id = req.params.id;

    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('desc','Description must have a value').notEmpty();
    //req.checkBody('price','Price must have a value').isDecimal();
    req.checkBody('image','Image must have a value').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        Category.find({})
        .then(categories=>{
        res.render('admin/edit_vehicle', {
            errors: errors,
            title: title,
            desc: desc,
            //price:price,
            categories:categories,
            category:category,
            image:image,
            id:id
        });
    })
    .catch(err=>console.log(err));
    }
    else {
        Vehicle.findById(id)
        .then(vehicle=>{
            if (vehicle) {
                vehicle.title= title;
                vehicle.desc= desc;
                //vehicle.price=price;
                vehicle.category=category;
                vehicle.image=image;
                vehicle.slug=slug;
                //req.flash('danger', 'Page slug exists, choose another.');
                vehicle.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    res.redirect('/admin/vehicles');    
                })         
                }
            })
            .catch(err=>console.log(err));
            }
});


router.get('/delete-vehicle/:id',isAdmin,(req,res)=>{
    Vehicle.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.redirect('/admin/vehicles');
    })
    .catch(err=>console.log(err));
});

module.exports=router;