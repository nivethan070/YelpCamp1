const Campground = require('../models/campground') // Below had campground so require here
const Review = require('../models/review'); // Below had review so require here



module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id); //res.send('You Made It!!!!')
    const review = new Review(req.body.review); //require review.js above
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','new Review created');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req,res) => {
    const{id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted your reviews');
    res.redirect(`/campgrounds/${id}`);              //res.send ("Delete Me!!")
}