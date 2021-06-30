//Breaking up campground routes

const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const {storage} = require ('../cloudinary');
const upload = multer({ storage });

//const { campgroundSchema } = require('../schemas.js'); //joi schema

const {isLoggedIn, isAuthor, validateCampground } = require('../middleware'); //import middlewares

//const ExpressError = require('../utils/ExpressError'); //..because of campgrounds.js is in routes folder

const Campground = require('../models/campground') //require compground.js

//middleware 
//move this below middleware to middleware file
// const validateCampground = (req,res,next) => { // joi validation middleware

//     // const campgroundSchema = Joi.object({  //defining basic schema
//     //     campground:Joi.object({
//     //         title: Joi.string().required(),
//     //         price: Joi.number().required().min(0), //price must be greater than zero
//     //         image: Joi.string().required(),
//     //         location: Joi.string().required(),
//     //         description: Joi.string().required() // title price image... all going to be required as well
//     //     }).required()     // joi.object() is the type // key campground because of body must include campground
//     //     }) move it through the new file schemas.js
//         const {error} = campgroundSchema.validate(req.body)
//         if(error){
//             const msg = error.details.map(el => el.message).join(',') //above had an error this line map over the error.detail to make a single string message 
//             throw new ExpressError(msg, 400) // take that message and pass through the new Express Error
//         } else {
//             next();  // console.log(result);
//         }
// }

// const isAuthor = async(req,res,next)=>{
//     const {id} = req.params;
//     const campground = await Campground.findById(id); // campground permissions
//     if (!campground.author.equals(req.user._id)){
//         req.flash('error', 'You do not have a permission to do this!');
//         return res.redirect(`/campgrounds/${id}`);
//     }
//     next();
// }

//chain on method
router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req,res)=>{
//  console.log(req.body, req.files);
//  res.send("IT worked?")
// })

router.get('/new',isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
.get( catchAsync(campgrounds.showCampground))
.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// //campground index
// router.get('/', catchAsync(campgrounds.index));

// // new campground form
// router.get('/new',isLoggedIn, campgrounds.renderNewForm)

// //create new campground

// router.post('/',isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// //show page

// router.get('/:id', catchAsync(campgrounds.showCampground));

// //edit page

// router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// //update and delete

// router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;