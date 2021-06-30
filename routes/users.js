 const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.register))

router.route('/login')
.get(users.renderLogin)
.post(passport.authenticate ('local',{failureFlash:true, failureRedirect:'/login'}),users.login)


//render register form
//router.get('/register', users.renderRegister);

//register user
//router.post('/register',catchAsync(users.register));

// render login form
//router.get('/login', users.renderLogin)

//login user
//router.post('/login', passport.authenticate ('local',{failureFlash:true, failureRedirect:'/login'}),users.login)

//logout
router.get('/logout', users.logout)

module.exports = router;


