var express=require('express');
var path =require('path');
var mongoose=require('mongoose');
var config=require('./config/database');
var bodyParser=require('body-parser');
var session=require('express-session');
var expressValidator=require('express-validator');
var passport = require('passport');
var authenticate = require('./config/authenticate');

// var pages=require('./routes/pages');
var adminDrivers=require('./routes/admin_drivers');
var adminCategories=require('./routes/admin_categories');
var adminVehicles=require('./routes/admin_vehicles');
var adminBookings=require('./routes/admin_bookings');
var vehicles=require('./routes/vehicles');
var book=require('./routes/book');
var users=require('./routes/users');

const connect=mongoose.connect(config.mongoUrl);
connect.then(()=>{
    console.log('connected to mongo');
})
.catch(err=>{
    console.log(err);
});


var app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));  //for static pages

app.locals.errors=null;

var Category =require('./models/category');

Category.find({})
    .then(categories=>{
       app.locals.categories=categories;
        })
    .catch(err=>console.log(err));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: true,
    resave: true,
    //cookie:({maxAge:1000})
  }));

  app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }  
  }));

app.use(passport.initialize());
app.use(passport.session());

//require('./config/authenticate')(passport);
app.get('*', function(req,res,next) {
    res.locals.user = req.user || null;
    next();
 });

 app.use('/vehicles',vehicles);
 app.use('/book',book);
 app.use('/users',users);
 app.use('/',vehicles);
 app.use('/admin/drivers',adminDrivers);
 app.use('/admin/categories',adminCategories);
 app.use('/admin/vehicles',adminVehicles);
 app.use('/admin/bookings',adminBookings);

var port=process.env.PORT||3000;
console.log(port);
app.listen(port,()=>{
    console.log('Connected correctly to server'+port);
});
