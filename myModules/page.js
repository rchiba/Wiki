/*
Page controller 
This controller is in charge of saving and retrieving page data. The page represents a single page of somebody's wiki.
*/

// define schema
require('../models/pages');
var Page;

module.exports =  {

    // called when creating a new page
    create: function(db, cfg, callback){
        if(!Page){
            Page = db.model('Page');
        }

        // see if this page already exists
        Page.findOne({owner: cfg.owner, title:cfg.title}, function(err, doc){
            // if page already exists, then 
            // respond with error
            if(doc){
                callback('Page already exists.',null);
            } else{
                // not creating a repeat page
                var newPage = new Page();
                newPage.title = cfg.title;
                newPage.date = new Date();
                newPage.privacy = cfg.privacy;
                newPage.owner = cfg.owner;
                newPage.allowed = cfg.allowed;
                newPage.elements = cfg.elements;
                newPage.save(function(err){
                    if(err){
                        callback(err, null);
                    } else{
                        callback(null, 'Successfully created page.');
                    }
                });
            }
        });

    },

    // takes in data and saves to mongo
    update: function(){
    
        // do some parsing

        // save into mongo
    
    },

    // retrieves data from mongo
    get: function(db, req, callback){
       
       console.log('pageController: get called');
       var page = req.params.page;
       var username = req.params.username;
       var loginUsername = req.session.user.login;

       // error checker
       if(!db || !req){
           callback('Invalid params for pageController.get', null);
       } else {
 
           if(!Page){
               Page = db.model('Page');
           }

           if(loginUsername !== username){
               // User is checking another user's page
                console.log('pageController: user checking another users page'); 
                Page.findOne({owner:username, title:page}, function(err, doc){
                    console.log('pageController: findOne returned with '+err+doc);
                    if(err){
                        callback(err, null);
                    } else{
                        // successfully pulled page
                        // check if private
                        if(doc.privacy == 'private'){
                            callback('This page is private.', null);
                        } else if(doc.privacy == 'protected'){
                            // check if user is part of allowed users
                            if(doc.allowed.indexOf(username)){
                                // user is allowed to see protected page
                                callback(null, doc);
                            } else{
                                // user is not allowed to see protected page
                                callback('This page is private.', null);
                            }
                        } else if(doc.privacy == 'public'){
                            // return the page
                            callback(null, doc);
                        }

                    }

                });
           }else{
               // user is checking own page
                Page.findOne({owner:username, title:page}, function(err, doc){
                    if(err){
                        callback(err, null);
                    } else{
                        callback(null, doc);
                    }
                });
           }
        }
    }

}

