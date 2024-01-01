const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const campgrounds = require('../controller/campground')
const { isLoggedIn,validatecampground,isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validatecampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedIn, isAuthor, validatecampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router