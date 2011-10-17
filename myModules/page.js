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
    update: function(db, req, callback){
    
        if(!db || !req || !req.body || !(typeof req.body.elements == 'string')){
            callback('Update called with wrong params.');
        } else{
            var page = req.params.page;
            var username = req.params.username;
            var loginUsername = req.session.user.username;
            if(loginUsername !== username){
                // authentication check
                callback('User not authorized to change this page.', null);
            } else {
                // user is allowed to update page
                console.log('pageController: user allowed to update page');
                if(!Page){
                    Page = db.model('Page');
                }
                
                // do some parsing
                var elementsString = req.body.elements;
                console.log('pageController: just before parse with '+elementsString);
                var myElements = JSON.parse(elementsString);
                console.log('pageController: just after parse');
                // save into mongo
                Page.update({title:page, owner:username}, {elements:myElements}, function(err){
                    if(err){
                        callback(err, null);
                    } else {
                        callback(null, 'Successfully updated page');
                    }
                });
            }            
        }
    },

    // retrieves data from mongo
    get: function(db, req, callback){
       
       console.log('pageController: get called');
       
       // error checker
       if(!db || !req){
           callback('Invalid params for pageController.get', null);
       } else {
 
           if(!Page){
               Page = db.model('Page');
           }
           
           var page = req.params.page;
           var username = req.params.username;
           var loginUsername = req.session.user.username;

           if(loginUsername !== username){
               // User is checking another user's page
                console.log('pageController: user checking another users page'); 
                Page.findOne({owner:username, title:page}, function(err, doc){
                    console.log('pageController: findOne returned with '+err+doc);
                    if(!err && !doc){
                        callback('Page does not exist.', null);
                    }
                    else if(err){
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
               console.log('pageController: user checking own page with '+username+page); 
               Page.findOne({owner:username, title:page}, function(err, doc){
                   console.log('pageController: findOne returned with '+err+doc);
                    if(!err && !doc){
                        callback('Page does not exist', null);
                    }
                    else if(err){
                        callback(err, null);
                    } else{
                        callback(null, doc);
                    }
                });
           }
        }
    }

}

