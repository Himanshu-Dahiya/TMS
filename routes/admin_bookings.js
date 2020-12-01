var express=require('express');
var router=express.Router();
var User=require('../models/user');
var Category=require('../models/category');
var auth=require('../config/authenticate');
var isAdmin=auth.isAdmin;

router.get('/',isAdmin,(req,res)=>{
    var count;
    User.count({},(err,c)=>{
        count=c;
    });
    User.find({})
    .then(users=>{
        res.render('admin/bookings',{
            users:users,
            count:count
        })
    })
    .catch(err=>console.log(err));
});

router.get('/confirm/:username/:booking',isAdmin,(req,res)=>{
    var username=req.params.username;
    var index=req.params.booking;
    User.findOne({username:username})
    .then(user=>{
        user.bookings[index].status='Confirmed';
        user.markModified('bookings');
        user.save(err=>{
            if(err)
                console.log(err);
            res.redirect('/admin/bookings');
        });
    })
    .catch(err=>{
        console.log(err);
    })
});

router.get('/decline/:username/:booking',isAdmin,(req,res)=>{
    var username=req.params.username;
    var index=req.params.booking;
    User.findOne({username:username})
    .then(user=>{
        user.bookings[index].status='Declined';
        user.markModified('bookings');
        user.save(err=>{
            if(err)
                console.log(err);
            res.redirect('/admin/bookings');
        });
    })
    .catch(err=>{
        console.log(err);
    })
});

module.exports=router;