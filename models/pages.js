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
var passwordHash = require('password-hash');

function usernameValidator (v){
    return v.length > 0;
};

var Page = new Schema({
    name: {type: String, index:true, validate: [usernameValidator, 'username must be at least 1 character long']},
    date: {type: String, index:true},
    privacy: {type: String},
    owner: {type: String},
    pieces: {type: String}
});

Page.static({
    authenticate : function(username,password,callback){
        this.findOne({username:username},function(err,doc){
            console.log('findOne returned with '+err+doc);
            if(err || !doc){
                callback(false);
            } else if(passwordHash.verify(password, doc.password)){
                callback(doc);
            }
            else{ // password mismatch
                callback(false);
            }
        })
    }
});

Mongoose.model('Page',Page);
