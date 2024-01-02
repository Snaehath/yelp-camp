const Campground = require('../models/campground')

module.exports.index = async (req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.renderForm = (req,res) =>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req,res,next) =>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data','400')
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(f => ({url:f.path,filename:f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
} 

module.exports.showCampgrounds = async (req,res) =>{
    const {id} = req.params
    const foundCampground = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
    if(!foundCampground) {
        req.flash('error', 'cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{foundCampground})
}

module.exports.renderEditForm = async (req,res) =>{
    const {id} = req.params
    const foundCampground = await Campground.findById(id)

    if(!foundCampground) {
        req.flash('error', 'cannot find that campground!')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/edit',{foundCampground})
}

module.exports.updateCampground = async (req,res) =>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f => ({url:f.path,filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req,res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted the Campground')
    res.redirect('/campgrounds')
}