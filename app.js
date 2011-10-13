
/**
 * Module dependencies.
 */

var express = require('express');

var Mongoose = require('mongoose');

var db = Mongoose.connect('mongodb://localhost/db');

var app = module.exports = express.createServer();

var connect = require('connect');
var MemStore = connect.session.MemoryStore;

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
    }
});
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

app.get('/sessions/new', function(req, res){
    res.render('login',{
        title:'Login',    
        locals:{
            redir: req.query.redir
        }
    });
});

app.post('/sessions', function(req, res){
    User.authenticate(req.body.login, req.body.password, function(user){
        if(user){
            req.session.user = user;
            res.redirect(req.body.redir || '/');
        } else{
            req.flash('warn', 'Login failed');
            res.render('sessions/new', {
                title: 'Login',
                locals: {redir:req.body.redir}
            });
        }

    });
});

app.post('/register', function(req, res){
    var data = req.body;
    
    // Search database for user
    User.findOne({login:data.username}, function(err, doc){
        if(doc){
            res.render('login',{flash: 'Username is in use'});
        } else if(data.password != data.confirm_password){
            res.render('login',{flash: 'Password does not match'});
        } else{
            delete data.confirm_password;
            // store user data
            var newUser = new User();
            newUser.username = data.username;
            newUser.password = data.password;
            newUser.role = 'user';
            newUser.save(function(err){
                if(!err){
                    res.render('login', {flash: 'User created'});
                } else {
                    res.render('login', {flash: 'Something went wrong during user creation!'});
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
