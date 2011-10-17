
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
    if(!req.session || !req.session.user){
        res.redirect('/sessions/new?redir='+req.url);
    } else {
        next();
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
            res.redirect(req.body.redir || '/'+req.body.username+'/index');
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
        
        if(type==='warn'){
            req.flash(type, msg);   
            res.render('login',{
                title:'Login',    
                locals:{
                    redir: req.query.redir
                }
            });
        }
        else{
            console.log('Successful registration');

            // create user's first page
            // create a new page
            console.log('username is '+req.session.user.username);
            var cfg = {
                title: 'index',
                privacy: 'private',
                owner: req.session.user.username,
                allowed: [],
                elements: []
            }
            console.log('about to create index page');
            pageController.create(db, cfg, function(err, msg){
                console.log('about to load index page with '+err+msg);

                // load up the index
                res.redirect('/'+req.session.user.username+'/index');
            });
        }
    });
});
    

app.get('/sessions/destroy', function(req, res) {
    delete req.session.user;
    res.redirect('/sessions/new');
});

function renderPage(doc, res){
    res.render('page', {
        title: doc.owner+'\'s Pixlwiki - '+doc.title,
        elements: doc.elements
    });

}

app.get('/:username/:page?/:operation?', requiresLogin, function(req, res){

    if(req.session.user.username !== req.params.username){
        // user creating a page for another user
    } else{
        // user creating a page for themselves
        var page = req.params.page;
        var username = req.params.username;
        // no page goes to index
        if(!page){
            page = 'index';
        }
        if(!req.params.operation){
            // load a page
            // use pageController to load mongo data
            pageController.get(db, req, function(err, doc){
                renderPage(doc, res);
            });
            
        } else if(req.params.operation === 'create'){
            // create a new page
            var cfg = {
                title: page,
                privacy: 'private',
                owner: username,
                allowed: [],
                elements: []
            }
            pageController.create(db, cfg, function(err, msg){
                pageController.get(db, req, function(err, doc){
                    renderPage(doc, res);
                });
            });
        } else if(req.params.operation === 'delete'){
            // delete a page
        }
    }
});

// update a page (ajax)
app.post('/:username/:page/update', requiresLogin, function(req, res){

    // update an existing page
    pageController.update(db, req, function(err,msg){
          
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
