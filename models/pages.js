/*
Page model
represents a page on a wiki
contains all the pieces of a page needed to render it
- divs
  - photos
  - text
  - video
  - audio

*/

var Mongoose = require("mongoose"), Schema = Mongoose.Schema;

var User = require('../models/users');

// function to validate the title of the page
function titleValidator(v){
    if(!v || v.length > 100){
        return false;
    }else{
        return true;
    }
}

// Element: a single editable div on the page
var Element = new Schema({
    pageName: {type: String},
    html: {type: String}
});

// Page: a single page
var Page = new Schema({
    title: {type: String, index:true, validate: [titleValidator, 'Please enter a valid title.']},
    date: {type: Date, index:true},
    lastChanged: {type: Date, index:true},
    privacy: {type: String, enum:['private', 'protected', 'public']},
    owner: {type: String}, 
    allowed:[User], // Users allowed to view this page 
    elements: [Element]
});

Page.pre( 'save', function(next, done){
    this.lastChanged = new Date();
    next();
});

Mongoose.model('Element',Element);
Mongoose.model('Page',Page);
