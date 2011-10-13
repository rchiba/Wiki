var Mongoose = require("mongoose"), Schema = Mongoose.Schema;

var User = new Schema({
    username : {type: String, index:true},
    password : {type: String, index:true},
    role : {type: String}
});
User.static({
    authenticate : function(username,password,callback){
        this.findOne({username:username,password:password},function(err,doc){
            callback(doc);
        })
    }
});
Mongoose.model('User',User);
