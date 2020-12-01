var express=require('express');
var router=express.Router();
var Driver=require('../models/driver');
var Category=require('../models/category');
var auth=require('../config/authenticate');
var isAdmin=auth.isAdmin;

router.get('/',isAdmin,(req,res)=>{
    var count;
    Driver.count({},(err,c)=>{
        count=c;
    });
    Driver.find({})
    .then(drivers=>{
        res.render('admin/drivers',{
            drivers:drivers,
            count:count
        })
    })
    .catch(err=>console.log(err));
});

router.get('/add-driver',isAdmin,(req,res)=>{
    var name='';
    var mobileNo='';
    var address='';
    var licenseNo='';

    Category.find({}).then(categories=>{
    res.render('admin/add_driver',{
        name:name,
        mobileNo:mobileNo,
        address:address,
        licenseNo:licenseNo
    })
    })
    .catch(err=>console.log(err));
});

router.post('/add-driver',(req,res)=>{
    
    req.checkBody('name','Name must have a value').notEmpty();
    req.checkBody('mobileNo','Mobile No. must have a value').notEmpty();
    req.checkBody('address','Address must have a value').notEmpty();
    req.checkBody('licenseNo','License No must have a value').notEmpty();

    var name=req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var mobileNo = req.body.mobileNo;
    var address = req.body.address;
    var licenseNo = req.body.licenseNo;

    var errors = req.validationErrors();

    if (errors) {
        Category.find({})
        .then(categories=>{
        res.render('admin/add_driver', {
            errors: errors,
            name: name,
            mobileNo: mobileNo,
            address:address,
            licenseNo:licenseNo
        });
    })
    .catch(err=>console.log(err));
    }
    else {
        Driver.findOne({slug: slug}, function (err, driver) {
            if (driver) {
                //req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/add_driver', {
                    name: name,
                    mobileNo: mobileNo,
                    address:address,
                    licenseNo:licenseNo
                });
            } else {
                var driver = new Driver({
                    name: name,
                    mobileNo: mobileNo,
                    address:address,
                    licenseNo:licenseNo,
                    slug:slug,
                });

                driver.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    res.redirect('/admin/drivers');
                 });
            }
        });
    }
});


router.get('/edit-driver/:id',isAdmin,(req,res)=>{

    var id =req.params.id;

    Category.find({})
    .then(categories=>{
        Driver.findById(id)
        .then(driver=>{
        res.render('admin/edit_driver',{
            name:driver.name,
            mobileNo:driver.mobileNo,
            licenseNo:driver.licenseNo,
            address:driver.address,
            id:id
        })
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
});


router.post('/edit-driver/:id',(req,res)=>{
    
    req.checkBody('name','Name must have a value').notEmpty();
    req.checkBody('mobileNo','Mobile No must have a value').notEmpty();
    req.checkBody('address','Address must have a value').notEmpty();
    req.checkBody('licenseNo','License No must have a value').notEmpty();

    var name=req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var mobileNo = req.body.mobileNo;
    var address = req.body.address;
    var licenseNo = req.body.licenseNo;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        Category.find({})
        .then(categories=>{
        res.render('admin/edit_driver', {
            errors: errors,
            name: name,
            mobileNo: mobileNo,
            address:address,
            licenseNo:licenseNo,
            id:id
        });
    })
    .catch(err=>console.log(err));
    }
    else {
        Driver.findById(id)
        .then(driver=>{
            if (driver) {
                driver.name= name;
                driver.mobileNo= mobileNo;
                driver.address=address;
                driver.licenseNo=licenseNo;
                driver.slug=slug;
                //req.flash('danger', 'Page slug exists, choose another.');
                driver.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    res.redirect('/admin/drivers');    
                })         
                }
            })
            .catch(err=>console.log(err));
            }
});


router.get('/delete-driver/:id',isAdmin,(req,res)=>{
    Driver.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.redirect('/admin/drivers');
    })
    .catch(err=>console.log(err));
});

module.exports=router;