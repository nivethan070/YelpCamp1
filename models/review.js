const mongoose = require('mongoose');   //here going to defining the review model

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
body: String, // for review purpose
rating : Number, // for rating
author:{  //Reviews Permission
 type: Schema.Types.ObjectId,
 ref: 'User'
}
});
// going to connect review with campground use one to many relationship

module.exports = mongoose.model("Review", reviewSchema);
 