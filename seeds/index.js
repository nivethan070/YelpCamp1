// connection copied from app.js
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground'); //here .. backup to the models directory

mongoose.connect('mongodb://localhost:27017/yelp-camp',{ //setup mongoose connection
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console, "Connection error:")); //db.on mongoose.connection.on
db.once("open",() => {   // db.once mongoose.connection.once
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async ()=>{
await Campground.deleteMany({});
for(let i=0; i<300; i++){                                               //const c = new Campground({title:'purple field'});
const random1000 = Math.floor(Math.random()*1000);  
const price = Math.floor(Math.random() * 20) + 10;
const camp = new Campground({
  //USER ID
    author: '60d3929de6c15d363473ffda', //set id hey is an author
    location: `${cities[random1000].city},${cities[random1000].state}`,
    title:`${sample(descriptors)} ${sample(places)}`,
    // image: 'https://source.unsplash.com/collection/483251',
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum voluptatum alias voluptas debitis, eveniet itaque porro autem culpa, eaque rerum minima impedit quos, fugiat repellendus ad neque! Vero, in similique.',
    price,
    geometry:  {
     "type" : "Point", 
     "coordinates" : [ //reseed the database
       cities [random1000].longitude, //geojson had longitude first then take latitude
       cities [random1000].latitude,
       ] 
    },
    images:  [
        {
        //   _id: 60d6624f32f3fa12905acb1f,
          url: 'https://res.cloudinary.com/dd5jzzvkn/image/upload/v1624617580/YelpCamp/mocxrabj8fmcnulabiyp.png',
          filename: 'YelpCamp/mocxrabj8fmcnulabiyp'
        },
        {
        //   _id: 60d6624f32f3fa12905acb20,
          url: 'https://res.cloudinary.com/dd5jzzvkn/image/upload/v1624617582/YelpCamp/akpa94cdmvuhtlycx8bq.png',
          filename: 'YelpCamp/akpa94cdmvuhtlycx8bq'
        }
      ]

})
await camp.save();
}
}

seedDB().then(()=>{
    mongoose.connection.close();
})
//seedDB(); // execute seedDB
