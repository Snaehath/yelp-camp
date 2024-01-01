const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync')
const {validatereview,isLoggedIn,isReviewAuthor} = require('../middleware')
const reviews = require('../controller/review')

router.post('/',isLoggedIn, validatereview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;