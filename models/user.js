//creating our user model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // install 3 dependencies(passport, passport-local, passport-local-mongoose) and required here


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique : true
    }
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);

