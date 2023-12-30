const express = require('express');
const router = express.Router();
const {campgroundSchema} = require('../schemas')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground');
const { isLoggedIn } = require('../middleware');

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

router.get('/',catchAsync(async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}))

router.get('/new', isLoggedIn, (req,res) =>{
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validatecampground, catchAsync(async (req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data','400')
    const campground = new Campground(req.body.campground)
    await campground.save();
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req,res) =>{
    const {id} = req.params
    const foundCampground = await Campground.findById(id).populate('reviews')
    if(!foundCampground) {
        req.flash('error', 'cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{foundCampground})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req,res) =>{
    const {id} = req.params
    const foundCampground = await Campground.findById(id)
    res.render('campgrounds/edit',{foundCampground})
}))

router.put('/:id', isLoggedIn, validatecampground, catchAsync(async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req,res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted the Campground')
    res.redirect('/campgrounds')
}))

module.exports = router