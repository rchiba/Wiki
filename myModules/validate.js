/*
Validate module
This is a custom module for validating data
*/
var commonPasswords = ['password', '12345'];

module.exports =  {

    // used to validate passwords during account creation. Retunrs null for success and error msg for error
    password: function(pass){
        if(!pass){
            return "Please enter a password.";
        } else if(pass.length < 5 ){
            return "Password must be at least 5 characters";
        } else {

            // return a funny message for common passwords
            for(var i=0; i < commonPasswords.length; i++){
                if(pass === commonPasswords[i]){
                    return "Is that the best you could come up with? Puh-leaze.";
                }
            }

            return false;
        }
    }

}

