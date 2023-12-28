const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const override = require('method-override')
const campgrounds = require('./routes/campground')
const reviews = require('./routes/review')
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() =>{
        console.log('MONGO Connection on')
    })
    .catch(err =>{
        console.log('Oh no MONGO error')
    })

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({extended:true}))
app.use(override('_method'))
app.use(express.static(path.join(__dirname,'public')))

app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

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