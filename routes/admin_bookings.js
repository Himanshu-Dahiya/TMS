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

module.exports=router;