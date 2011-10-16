
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

// My Controllers/Modules
var regController = require('./myModules/register');
var pageController = require('./myModules/page');

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
require('./models/users');
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
    console.log('register route hit');
    regController.handle(req, User, function(type, msg){
        console.log('in regController callback');
        req.flash(type, msg);   
        res.render('login',{
            title:'Login',    
            locals:{
                redir: req.query.redir
            }
        });
    })
});
    

app.get('/sessions/destroy', function(req, res) {
    delete req.session.user;
    res.redirect('/sessions/new');
});


app.get('/:username/:page?', requiresLogin, function(req, res){

    // no page goes to index
    if(!page){
        page = 'index';
    }

    // use pageController to load mongo data
    pageController.get(db, req, function(err, elements){
        // page module
        res.render('page', {
            title: username+'\'s Pixlwiki - '+page,
            elements: elements
        });
    });
  
});

app.get('/', requiresLogin, function(req, res){
  res.render('index', {
    title: 'Pixlwiki'
  });
});

app.get('/pixlwiki/about', function(req, res){
  res.render('about', {
    title: 'About Pixlwiki'
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
