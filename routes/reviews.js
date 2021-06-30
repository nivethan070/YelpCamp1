//Breaking out review routes
const express = require('express');
const router = express.Router({mergeParams : true});
const { validateReview,isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground') //require compground.js
const Review = require('../models/review');
const reviews = require ('../controllers/reviews');
//const { reviewSchema } = require('../schemas.js'); //added as middleware schema

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// move below code to middleware file
// const validateReview = (req,res,next) =>{
//     const {error} = reviewSchema.validate(req.body);
//     console.log(error)
//     if(error){
//         const msg = error.details.map(el => el.message).join(',') //above had an error this line map over the error.detail to make a single string message 
//         throw new ExpressError(msg, 400) // take that message and pass through the new Express Error
//     } else {
//         next();  // console.log(result);
//     }
// }

//create review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview)) 

//delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;