/*
Register module
Controller for /register path
*/


var validate = require('./validate');
var passwordHash = require('password-hash');

module.exports =  {

    // used to validate passwords during account creation. Retunrs null for success and error msg for error
    handle: function(req, User, callback){
        
        var data = req.body;
        // Search database for user
        User.findOne({username:data.username}, function(err, doc){
            var err = '';
            var passErr = validate.password(data.password);
            if(doc){
                callback('warn', 'Username is in use.');
            } else if(data.password != data.confirm_password){
                callback('warn', 'Password does not match.');
            } else if(typeof passErr == 'string'){
                callback('warn', passErr);
            } else {
                delete data.confirm_password;
                // store user data
                var newUser = new User();
                newUser.username = data.username;
                newUser.password = passwordHash.generate(data.password);
                newUser.role = 'user';
                newUser.save(function(err){
                    console.log('done saving user');
                    if(!err){
                        callback('info', 'User created');
                    } else {
                        callback('warn', err);
                    }
                });       
            }

        });
        
    }

}

