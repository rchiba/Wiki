
/**
 * Module dependencies.
 */

var express = require('express');

var Mongoose = require('mongoose');

var db = Mongoose.connect('mongodb://localhost/db');

var app = module.exports = express.createServer();

var connect = require('connect');
var MemStore = connect.session.MemoryStore;

var passwordHash = require('password-hash');

// My modules
var validate = require('./myModules/validate');

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.session({
        secret: "paris"
        /*store:MemStore( {
            reapInterval: 6000*10 // interval at which stale sessions are checked
        })*/
    }));
    app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Helpers
app.dynamicHelpers({
    session: function(req,res){
        return req.session;
    },
    flash: function(req,res){
        return req.flash();
    },
    redir: function(req, res){
        if(req.body && req.body.redir){
            return req.body.redir;
        }else{
            return null;
        }
    }});
// Models
require('./users');
var User = db.model('User');

// Session middleware
function requiresLogin(req, res, next){
    if(req.session.user){
        next();
    } else {
        res.redirect('/sessions/new?redir='+req.url);
    }
};

// Routes

// Login
app.get('/sessions/new', function(req, res){
    res.render('login',{
        title:'Login',    
        locals:{
            redir: req.query.redir
        }
    });
});

app.post('/sessions', function(req, res){
    User.authenticate(req.body.username, req.body.password, function(user){
        if(user){
            req.session.user = user;
            res.redirect(req.body.redir || '/');
        } else{
            req.flash('warn', 'Login failed');
            res.render('login', {
                title: 'Login',
                locals: {redir:req.body.redir}
            });
        }

    });
});


// Create a new user
app.post('/register', function(req, res){
    var data = req.body;
    // Search database for user
    User.findOne({username:data.username}, function(err, doc){
        console.log('findOne returned with '+err+doc);
        var err = '';
        var passErr = validate.password(data.password);
        console.log('passerr: '+typeof passErr);
        if(doc){
            req.flash('warn', 'Username is in use');
            res.render('login',{
            title:'Login',    
            locals:{
                redir: req.query.redir
            }
            });
        } else if(data.password != data.confirm_password){
            req.flash('warn', 'Password does not match');
            res.render('login',{
            title:'Login',    
            locals:{
                redir: req.query.redir
            }
            });
        } else if(typeof passErr == 'string'){
            req.flash('warn', passErr);
            res.render('login',{
            title:'Login',    
            locals:{
                redir: req.query.redir
            }
            });
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
                    req.flash('warn', 'User created');
                    res.render('login',{
                    title:'Login',    
                    locals:{
                        redir: req.query.redir
                    }
                    });
                } else {
                    req.flash('warn', err);
                    res.render('login',{
                    title:'Login',    
                    locals:{
                        redir: req.query.redir
                    }
                    });
                }
            });       
        }

    });

});
    

app.get('/sessions/destroy', function(req, res) {
    delete req.session.user;
    res.redirect('/sessions/new');
});

app.get('/', requiresLogin, function(req, res){
  res.render('index', {
    title: 'Wikibox'
  });
});

app.get('/test', function(req, res){
    articleProvider.findAll(function(error, docs){
        res.send(docs);
    });
});

app.get('/about', function(req, res){
  res.render('about', {
    title: 'About Wikibox'
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
