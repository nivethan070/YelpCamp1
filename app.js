if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//mongodb+srv://nivethan:<password>@cluster0.yamn1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// require('dotenv').config();

// console.log(process.env.SECRET) //SHOWS FROM ENV SECRET IN MIDDLEWARE
// console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
//const dbUrl = process.env.DB_URL;
//'mongodb://localhost:27017/yelp-camp'
mongoose.connect( dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore ({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR",e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dd5jzzvkn/",  
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.session)
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})



//Workouts
// const express = require('express');
// const path = require ('path');
// const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
// //const Joi = require('joi'); //remove here because this one is mentioned to shemas.js // Here requiring joi after package installation (npm i joi)
// // const {campgroundSchema, reviewSchema} = require('./schemas.js');
// // const catchAsync = require('./utils/catchAsync');
// const session = require('express-session');
// const flash = require('connect-flash'); 
// const ExpressError = require('./utils/ExpressError');
// const methodOverride = require('method-override'); // before install method override
// const passport = require('passport');  //requiring passport
// const LocalStrategy = require('passport-local');  //local strategy download and requiring passport-local
// const User = require('./models/user');
// // const Campground = require('./models/campground') //require compground.js
// // const Review = require("./models/review"); //review.js

// const userRoutes = require('./routes/users');
// const campgroundRoutes = require('./routes/campgrounds');
// const reviewRoutes = require('./routes/reviews');

// mongoose.connect('mongodb://localhost:27017/yelp-camp',{ //setup mongoose connection
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify : false // this code used to get rid of depricated warning
// });

// const db = mongoose.connection;
// db.on("error",console.error.bind(console, "Connection error:")); //db.on mongoose.connection.on
// db.once("open",() => {   // db.once mongoose.connection.once
//     console.log("Database connected");
// }); // here this code is copied from previous application

// const app = express();

// app.engine('ejs',ejsMate)
// app.set('view engine','ejs');
// app.set('views', path.join(__dirname,'views'))

// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride('_method'));
// app.use(express.static((__dirname, 'public'))) //add public folder

// const sessionConfig = {
// secret:'thisshouldbeabettersecret!',
// resave: false,
// saveUninitialized : true,
// cookie: {
//     httpOnly : true,
//     //default session
//     expires : Date.now()+1000+60+60+24+7,
//     maxAge: 1000+60+60+24+7
// }

// }
// app.use(session(sessionConfig)) // here the cookies sessions are successfully working
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate())); //LocalStrategy located in user model and calles as authenticate()

// passport.serializeUser(User.serializeUser()); //This is passport how to seialize the user
// passport.deserializeUser(User.deserializeUser()); //this two methods are depending from plugin passport-local-mongoose

// //middleware 
// // const validateCampground = (req,res,next) => { // joi validation middleware

// //     // const campgroundSchema = Joi.object({  //defining basic schema
// //     //     campground:Joi.object({
// //     //         title: Joi.string().required(),
// //     //         price: Joi.number().required().min(0), //price must be greater than zero
// //     //         image: Joi.string().required(),
// //     //         location: Joi.string().required(),
// //     //         description: Joi.string().required() // title price image... all going to be required as well
// //     //     }).required()     // joi.object() is the type // key campground because of body must include campground
// //     //     }) move it through the new file schemas.js
// //         const {error} = campgroundSchema.validate(req.body)
// //         if(error){
// //             const msg = error.details.map(el => el.message).join(',') //above had an error this line map over the error.detail to make a single string message 
// //             throw new ExpressError(msg, 400) // take that message and pass through the new Express Error
// //         } else {
// //             next();  // console.log(result);
// //         }
// // }
// //middleware

// // const validateReview = (req,res,next) =>{
// //     const {error} = reviewSchema.validate(req.body);
// //     console.log(error)
// //     if(error){
// //         const msg = error.details.map(el => el.message).join(',') //above had an error this line map over the error.detail to make a single string message 
// //         throw new ExpressError(msg, 400) // take that message and pass through the new Express Error
// //     } else {
// //         next();  // console.log(result);
// //     }
// // }

// app.use((req,res,next)=>{
// res.locals.success = req.flash('success');
// res.locals.error = req.flash('error');
// next();
// })

// //BASIC IDEA OF LOGIN ROUTES
// //register - FORM
// //POST / register - create a user

// // app.get('/fakeUser',async(req,res)=>{      // Configuring Passport
// //     const user = new User({email: 'jaijana@gmail.com', username:'Nivethan'});
// //     const newUser = await User.register(user, 'chicken'); //chicken is my password
// //     res.send(newUser);
// // }) 
// app.use('/',userRoutes);
// app.use('/campgrounds',campgroundRoutes)
// app.use('/campgrounds/:id/reviews',reviewRoutes)

// app.get('/', (req,res)=>{
//     res.render('home.ejs') //basic routes
// });

// //below codes move to campgrounds.js
// // //campground index
// // app.get('/campgrounds', catchAsync(async (req,res)=>{
// //     const campgrounds = await Campground.find({});
// //     res.render('campgrounds/index',{campgrounds})
// // }));

// // app.get('/campgrounds/new',(req,res)=>{
// //     res.render('campgrounds/new.ejs');
// // })

// // //create new campground

// // app.post('/campgrounds',validateCampground, catchAsync(async(req,res,next)=>{
// //     //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
// //     // const campgroundSchema = Joi.object({  //defining basic schema
// //     // campground:Joi.object({
// //     //     title: Joi.string().required(),
// //     //     price: Joi.number().required().min(0),
// //     //     image: Joi.string().required(),
// //     //     location: Joi.string().required(),
// //     //     description: Joi.string().required() // title price image... all going to be required as well
// //     // }).required()     // joi.object() is the type // key campground because of body must include campground
// //     // })
// //     // const {error} = campgroundSchema.validate(req.body)
// //     // if(error){
// //     //     const msg = error.details.map(el => el.message).join(',')
// //     //     throw new ExpressError(msg, 400)
// //     // }
// //     // console.log(result); //cut out this line because of find the new campground
// //     const campground = new Campground(req.body.campground); // it throws an own erro
// //     await campground.save();
// //     res.redirect(`/campgrounds/${campground._id}`)
// // }))

// // //show page

// // app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
// //     const campground = await Campground.findById(req.params.id).populate('reviews');
// //       res.render('campgrounds/show.ejs',{campground});
// // }));

// // //edit page

// // app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
// //     const campground = await Campground.findById(req.params.id) 
// //     res.render('campgrounds/edit.ejs',{campground});
// // }))

// // //update and delete

// // app.put('/campgrounds/:id', validateCampground, catchAsync(async(req,res)=>{
// //     const {id} = req.params;
// //     const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
// //     res.redirect(`/campgrounds/${campground._id}`)
// // }));

// //below code move to reviews file

// // app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req,res)=>{
// //     const campground = await Campground.findById(req.params.id); //res.send('You Made It!!!!')
// //     const review = new Review(req.body.review); //require review.js above
// //     campground.reviews.push(review);
// //     await review.save();
// //     await campground.save();
// //     res.redirect(`/campgrounds/${campground._id}`);
// // })) 

// // // app.delete('/campgrounds/:id', catchAsync(async(req,res)=>{ //create campground delete
// // //     const {id} = req.params;
// // //     await Campground.findByIdAndDelete(id);
// // //      res.redirect('/campgrounds');
// // // }));

// // app.delete('/campgrounds/:id/reviews/:reviewId',catchAsync(async (req,res) => {
// //     const{id, reviewId} = req.params;
// //     await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}}); 
// //     await Review.findByIdAndDelete(reviewId);
// //     res.redirect(`/campgrounds/${id}`);              //res.send ("Delete Me!!")
// // }))

// //more errors

// app.all('*',(req, res,next)=>{
//     next(new ExpressError('Page not Found',404))  // res.send("404!!!")
// })

// //Basic Error Handler

// app.use((err, req, res, next)=>{
//     const{statusCode = 500}  = err;    //here destructure error
//     if(!err.message) err.message = 'Oh No, Something Went Wrong'
//     res.status(statusCode).render('error',{ err })
//     // res.send('Oh Boy, Something Went Wrong')
// })



// // app.get('/makecampground', async(req,res)=>{ //making new campground in this file
// //     const camp = new Campground({title: 'My Backyard', description:'cheap camping!!'});
// //     await camp.save();
// //     res.send(camp)
// // })

// app.listen(3000,()=>{
//     console.log('Serving on port 3000')
// })
