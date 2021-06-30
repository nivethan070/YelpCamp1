//Campground model basics
const mongoose = require('mongoose'); 
const Review = require ('./review.js')
const Schema = mongoose.Schema; // shorcut way to connect mongoose here we declare two or more schemas its validate from here

const ImageSchema = new Schema({
    
        url : String, // here the url stored as a path in middleware
        filename : String // here filenname stored as a filename in middleware
    
});

const opts = {toJSON: {virtuals:true}};

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});
const CampgroundSchema = new Schema({ //create CampgroundSchema here
    title : String,
    images : [ImageSchema],
        // {
        //     url : String, // here the url stored as a path in middleware
        //     filename : String // here filenname stored as a filename in middleware
        // }
//],
    // geometry;{  // Basic Idea to declare geometry here
    //     "type":"Point",
    //     "coordinates":[77.21667,28.66667]
    // }
    geometry: { //code copied from mongooseejs.com
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author:{   //Adding and author to campground (then update seeds file index.js)
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    reviews: [   // going to connect review with campground use one to many relationship
        {
         type: Schema.Types.ObjectId, // here access object id from review model
         ref: 'Review' 
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    //return "I am PopUp Text!!!"
    return `
    <strong><a href = "/campgrounds/${this._id}"> ${this.title} </a><strong>
    <p>${this.description.substring(0,20)}...</p>`
});

//here found the document and deleted to using if function

CampgroundSchema.post('findOneAndDelete',async function(doc){ //findOneAndDelete is an query middleware
 if(doc){
     await Review.deleteMany({ //here update delete to remove because of cause deprecation error
         _id:{
             $in: doc.reviews
         }
     })
 }
})

module.exports = mongoose.model('Campground', CampgroundSchema); // here use CampgroundSchema


   // if(doc){ //doc shows what is deleted //wrap everything inside if condition  // console.log(doc)
    // await Review.remove({  // console.log("Deleted!!!!") //here we check the middleware runs it shows in terminal
    // _id:{
    //     sin: doc.reviews
    // }
    // })
    // }