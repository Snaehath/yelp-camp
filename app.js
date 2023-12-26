const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const override = require('method-override')
const Review = require('./models/review')

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

const validatecampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

const validatereview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }

}

app.get('/',(req,res) =>{
    res.send('WELCOME TO HOME PAGE!!')
})

app.get('/campgrounds',catchAsync(async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',validatecampground, catchAsync(async (req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data','400')
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id',catchAsync(async (req,res) =>{
    const {id} = req.params
    const foundCampground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show',{foundCampground})
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req,res) =>{
    const {id} = req.params
    const foundCampground = await Campground.findById(id)
    res.render('campgrounds/edit',{foundCampground})
}))

app.put('/campgrounds/:id',validatecampground, catchAsync(async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id',catchAsync(async (req,res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/reviews',validatereview, catchAsync(async(req,res) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

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