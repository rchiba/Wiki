// User controller

module.exports = {

    // /users
    index: function(req, res){
        res.render(users);
    },

    // /users/:id
    show: function(req, res, next){
        
    }

}
