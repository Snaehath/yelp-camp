const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const override = require('method-override');
const passport = require('passport');
const localPassport = require('passport-local');
const app = express();

const User = require('./models/user');

const userRoutes = require('./routes/user');
const campgroundsRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/review');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() =>{
        console.log('MONGO Connection on')
    })
    .catch(err =>{
        console.log('Oh no MONGO error')
    })

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(express.urlencoded({extended:true}));
app.use(override('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig ={
    secret: 'iambatman',
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localPassport(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>{
    res.locals.signedUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);

app.get('/',(req,res) =>{
    res.send('WELCOME TO HOME PAGE!!')
})

app.all('*',(req,res,next) =>{
    next(new ExpressError('Page Not Found :(',404))
})

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong :(';
    res.status(statusCode).render('error',{err})
})

app.listen(3000,() =>{
    console.log('Listening on port 3000')
})