const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    //console.log("REQ.USER...",req.user);
    if (!req.isAuthenticated()) {
        //console.log(req.path, req.originalUrl) //it shows the request path in middleware //1 method to storing url they are requesting
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req,res,next) => { // joi validation middleware

    // const campgroundSchema = Joi.object({  //defining basic schema
    //     campground:Joi.object({
    //         title: Joi.string().required(),
    //         price: Joi.number().required().min(0), //price must be greater than zero
    //         image: Joi.string().required(),
    //         location: Joi.string().required(),
    //         description: Joi.string().required() // title price image... all going to be required as well
    //     }).required()     // joi.object() is the type // key campground because of body must include campground
    //     }) move it through the new file schemas.js
        const {error} = campgroundSchema.validate(req.body)
        if(error){
            const msg = error.details.map(el => el.message).join(',') //above had an error this line map over the error.detail to make a single string message 
            throw new ExpressError(msg, 400) // take that message and pass through the new Express Error
        } else {
            next();  // console.log(result);
        }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id); // campground permissions
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have a permission to do this!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId); // campground permissions
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have a permission to do this!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',') //above had an error this line map over the error.detail to make a single string message 
        throw new ExpressError(msg, 400) // take that message and pass through the new Express Error
    } else {
        next();  // console.log(result);
    }
}
