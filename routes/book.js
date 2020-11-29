var express=require('express');
var router=express.Router();
var Vehicle=require('../models/vehicle');
var User=require('../models/user');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');

router.get('/add/details/:vehicle',(req, res)=> {
    var origin='';
    var destination='';
    var date='';
    var time='';
    var id=req.params.vehicle;
    res.render('details',{
        origin:origin,
        destination:destination,
        date:date,
        time:time,
        vehicle:id,
        title:'Fill Details'
    });
});

router.post('/add/:vehicle',(req, res)=> {
    req.checkBody('origin','Origin must have a value').notEmpty();
    req.checkBody('destination','Destination must have a value').notEmpty();
    req.checkBody('date','Date must have a numerical value').isDecimal();
    req.checkBody('time','Time must have a numerical value').isDecimal();

    var title=req.params.vehicle;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var origin =req.body.origin;
    var destination = req.body.destination;
    var date = req.body.date;
    var time = req.body.time;

    var errors = req.validationErrors();
    Vehicle.findOne({slug: slug}).then(p=>{
        if (req.user.bookings.length===0) {
         //   req.user.bookings = [];
            req.user.bookings.push({
                title: slug,
                origin:origin,
                destination:destination,
                date:date,
                time:time,
                qty: 1,
                image: p.image
            });
            req.user.save();
        } else {
            
            var newItem = true;

            for (var i = 0; i < req.user.bookings.length; i++) {
                if (req.user.bookings[i].title === slug) {
                    req.user.bookings[i].qty++;
                    req.user.markModified('bookings');
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                req.user.bookings.push({
                    title: slug,
                    qty: 1,
                    origin:origin,
                    destination:destination,
                    date:date,
                    time:time,
                    image: p.image
                });
            }
            req.user.save();
        }

        res.redirect('back');
    })
    .catch(err=>console.log(err));

});

router.get('/checkout',(req,res)=>{

    res.render('checkout',{
        title:'Checkout'
    });
});

router.get('/update/:vehicle/details', function (req, res) {

    var id=req.params.vehicle;
    for(var i=0;i<req.user.bookings.length;++i)
    {
        if(req.user.bookings[i].title==id)
        {
            var origin=req.user.bookings[i].origin;
            var destination=req.user.bookings[i].destination;
            var date=req.user.bookings[i].date;
            var time=req.user.bookings[i].time;
            res.render('edit_details',{
                origin:origin,
                destination:destination,
                date:date,
                time:time,
                vehicle:id,
                title:'Fill Details'
            });
            break;
        }
    }
});

router.post('/update/:vehicle/details', function (req, res) {

    var id=req.params.vehicle;
    for(var i=0;i<req.user.bookings.length;++i)
    {
        if(req.user.bookings[i].title==id)
        {
            console.log(req.body.origin);
            req.user.bookings[i].origin=req.body.origin;
            console.log(req.user.bookings[i].origin);
            req.user.bookings[i].destination=req.body.destination;
            req.user.bookings[i].date=req.body.date;
            req.user.bookings[i].time=req.body.time;
            req.user.markModified('bookings');
            break;
        }
    }
    req.user.save(err=>{
        if(err)
            console.log(err);
        res.redirect('/book/checkout');
    });
});

router.get('/update/:vehicle', function (req, res) {

    var slug = req.params.vehicle;
    var action = req.query.action;

    for (var i = 0; i < req.user.bookings.length; i++) {
        if (req.user.bookings[i].title == slug) {
            switch (action) {
                case "add":
                    console.log(req.user.bookings[i].qty);
                    req.user.bookings[i].qty = req.user.bookings[i].qty + 1 ;
                    req.user.markModified('bookings');
                    console.log(req.user.bookings[i].qty);
                    break;
                case "remove":
                    //console.log(req.user.bookings[i-1].qty);
                    req.user.bookings[i].qty--;
                    req.user.markModified('bookings');
                    if (req.user.bookings[i].qty < 1)
                        req.user.bookings.splice(i, 1);
                    if (req.user.bookings.length == 0)
                        req.user.bookings=[];
                    break;
                case "clear":
                    req.user.bookings.splice(i, 1);
                    if (req.user.bookings.length == 0)
                        req.user.bookings=[];
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.user.save(err=>{
        if(err)
            console.log(err);
        res.redirect('/book/checkout');
    });



});

router.get('/clear', function (req, res) {

    req.user.bookings=[];
    
    req.user.save(err=>{
        if(err)
            console.log(err);
        res.redirect('/book/checkout');
    });

});

router.get('/buynow',(req,res)=>{

    req.user.bookings=[];

    req.user.save(err=>{
        if(err)
            console.log(err);
        res.redirect('/book/checkout');
    });

});



module.exports=router;