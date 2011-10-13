/*
User model
represents a user of the wiki
*/

var Mongoose = require("mongoose"), Schema = Mongoose.Schema;
var passwordHash = require('password-hash');

function usernameValidator (v){
    return v.length > 0;
};

var User = new Schema({
    username : {type: String, index:true, validate: [usernameValidator, 'username must be at least 1 character long']},
    password : {type: String, index:true},
    role : {type: String}
});

User.static({
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

Mongoose.model('User',User);
