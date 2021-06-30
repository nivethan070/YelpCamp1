const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN; //here parse the token from .env file
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
} 

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async(req,res,next)=>{
    // req.files.map(f => ({url: f.path, filename:f.filename }))
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location, //nested code location in campground in body // This code had using a simple location
        limit: 1
    }).send() // here get the data back
    const campground = new Campground(req.body.campground); // it throws an own erro
    campground.geometry = geoData.body.features[0].geometry; //.coordinates //this code coming from geocoding api
    campground.images = req.files.map(f => ({url: f.path, filename:f.filename })); // here the url and filename add into campground then save and redirect to our edit campground page //adding different file url cameback from cloudinary
    campground.author = req.user._id; //adding an author to campground
    await campground.save(); // save all the things before inside create campground
    console.log(campground); // finally printout the campground
    req.flash('success','Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req,res)=>{
    // const campground = await Campground.findById(req.params.id).populate('reviews');
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {  //nested populate
            path:'author'
        }
    }).populate('author'); //chain on here to add one more function as author
    // console.log(campground);
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs',{ campground });
}

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs',{campground});
}

//update route
module.exports.updateCampground = async(req,res)=>{
   
    const {id} = req.params;
    console.log(req.body);
    //put below lines to middleware above
    // const campground = await Campground.findById(id); // campground permissions
    // if (!campground.author.equals(req.user._id)){
    //     req.flash('error', 'You do not have a permission to do this!');
    //     return res.redirect(`/campgrounds/${id}`);
    // }
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground}); 
    const imgs = req.files.map(f => ({url: f.path, filename:f.filename }));
    campground.images.push(...imgs); //Here not overwrite the images just add the image with existing images in edits
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
          await cloudinary.uploader.destroy(filename); // after delete the images in edits then update. This code is going to destroy that images in our cloudinary.
        }
       await campground.updateOne({$pull:{images:{filename: {$in: req.body.deleteImages }}}}) // This code delete image from database.
       //console.log(campground)
    }
    // campground.updateOne({$pull:{images:{filename: {$in: req.body.deleteImages }}}})
    req.flash('success','Yes campground updated!!!');
    res.redirect(`/campgrounds/${campground._id}`)
}

//delete route

module.exports.deleteCampground = async(req,res)=>{ //create campground delete
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted camps');
     res.redirect('/campgrounds');
}