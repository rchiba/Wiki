/*
Page test module
tests the page.js module (used for page manipulation)
*/

// Module to test

// dbs
var Mongoose = require('mongoose');
var db = Mongoose.connect('mongodb://localhost/db');

// module to test
var pageController = require('../myModules/page');
var Page = db.model('Page');

module.exports =  {

    // Normative scenario
    'testValidCreate': function(beforeExit, assert){
        
        var counter = 0; 
        // pages are built using these objects
        var cfg1 = {
            title: 'A Page Title',
            privacy: 'private',
            owner: 'test1',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg1, function(err, msg){
            assert.isNull(err);
            assert.eql(msg, 'Successfully created page.');
            Page.findOne({owner:'test1', title:'A Page Title'}, function(err, doc){
                // check if the page is in the db
                assert.isNull(err);
                assert.isNotNull(doc);
                
                // teardown
                Page.remove({owner:'test1', title:'A Page Title'}, function(){
                    counter++;
                }); 

            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    }, 
    
    // Creating duplicate pages will result in
    // correct error
    'testDuplicateCreate': function(beforeExit, assert){
        var counter = 0;

        // pages are built using these objects
        var cfg2 = {
            title: 'A Page Title',
            privacy: 'private',
            owner: 'test2',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg2, function(err, msg){
            assert.isNull(err);
            assert.eql(msg, 'Successfully created page.');
            Page.findOne({owner:'test2', title:'A Page Title'}, function(err, doc){

                // check if the page is in the db
                assert.isNull(err);
                assert.isNotNull(doc);
                
                // create an identical page
                pageController.create(db, cfg2, function(err, msg){
                    //console.log('testDuplicateCreate: '+err+msg);
                    assert.eql(err, 'Page already exists.');
                    assert.isNull(msg);
                    Page.remove({owner:'test2', title:'A Page Title'}, function(){
                        counter++;
                    }); 
                });
            });
        });
        
        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    },
    
    // Test invalid title input
    'testInvalidCreateTitle': function(beforeExit, assert){
        
        var counter = 0; 
        // pages are built using these objects
        var cfg3 = {
            title: '',
            privacy: 'private',
            owner: 'test3',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg3, function(err, msg){
            //console.log('testInvalidCreateTitle:  '+err.errors.title.type+msg);
            assert.isNull(msg);
            assert.eql(err.errors.title.type, 'Please enter a valid title.');
            Page.findOne({owner:'test3'}, function(err, doc){
                // make sure the page is not in the db
                assert.isNull(doc);
                
                // end of test
                counter++;

            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    }, 
    
    // Test invalid title input
    'testInvalidCreatePrivacy': function(beforeExit, assert){
        
        var counter = 0; 
        // pages are built using these objects
        var cfg4 = {
            title: 'A title',
            privacy: '',
            owner: 'test4',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg4, function(err, msg){
            //console.log('testInvalidCreatePrivacy:  '+err.errors.privacy+msg);
            assert.isNull(msg);
            assert.eql(err.errors.privacy.type, 'enum');
            Page.findOne({owner:'test4'}, function(err, doc){
                // make sure the page is not in the db
                assert.isNull(doc);
                
                // end of test
                counter++;

            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    },
 
    // Test valid get of a public page
    'testValidGetPublic': function(beforeExit, assert){
        
        var counter = 0; 

        // first, create the page to be tested
        
        var cfg5 = {
            title: 'test5Page',
            privacy: 'public',
            owner: 'test5',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg5, function(err, msg){
            //console.log('testValidGetPublic: '+err+msg);
            // then try to get the page
            // request should have these things in it
            req = {
                params:{
                    page:'test5Page',
                    username: 'test5'
                },
                session:{user:{username:'test5'}}
            }
            pageController.get(db, req, function(err, doc){
                //console.log('testValidGetPublic:  '+err+doc);
                assert.eql(doc.owner,'test5');
                assert.eql(doc.privacy, 'public');
                assert.eql(doc.title, 'test5Page');
                Page.remove({owner:'test5', title:'test5Page'}, function(){
                    counter++;
                });
            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    }, 
    
    // Test valid get of a public page that is not one's own
    'testValidGetPublicNonOwnerPage': function(beforeExit, assert){
        
        var counter = 0; 

        // first, create the page to be tested
        
        var cfg6 = {
            title: 'test6Page',
            privacy: 'public',
            owner: 'test6',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg6, function(err, msg){
            //console.log('testValidGetPublicNonOwnerPage: '+err+msg);
            // then try to get the page
            // request should have these things in it
            req = {
                params:{
                    page:'test6Page',
                    username: 'test6'
                },
                session:{user:{username:'anotherUser'}}
            }
            pageController.get(db, req, function(err, doc){
               //console.log('testValidGetPublicNonOwnerPage:  '+err+doc);
                assert.eql(doc.owner,'test6');
                assert.eql(doc.privacy, 'public');
                assert.eql(doc.title, 'test6Page');
                Page.remove({owner:'test6', title:'test6Page'}, function(){
                    counter++;
                });
            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    }, 
    
    // Test valid get of private page that is your own
    'testValidGetPrivate': function(beforeExit, assert){
        
        var counter = 0; 

        // first, create the page to be tested
        
        var cfg7 = {
            title: 'test7Page',
            privacy: 'private',
            owner: 'test7',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg7, function(err, msg){
            //console.log('testValidGetPrivate: '+err+msg);
            // then try to get the page
            // request should have these things in it
            req = {
                params:{
                    page:'test7Page',
                    username: 'test7'
                },
                session:{user:{username:'test7'}}
            }
            pageController.get(db, req, function(err, doc){
                //console.log('testValidGetPrivate:  '+err+doc);
                assert.eql(doc.owner,'test7');
                assert.eql(doc.privacy, 'private');
                assert.eql(doc.title, 'test7Page');
                Page.remove({owner:'test7', title:'test7Page'}, function(){
                    counter++;
                });
            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    }, 
    
    // Test valid get of private page that is not
    'testValidGetPrivateNonOwnerPage': function(beforeExit, assert){
        
        var counter = 0; 

        // first, create the page to be tested
        
        var cfg8 = {
            title: 'test8Page',
            privacy: 'private',
            owner: 'test8',
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg8, function(err, msg){
            //console.log('testValidGetPrivateNonOwnerPage: '+err+msg);
            // then try to get the page
            // request should have these things in it
            req = {
                params:{
                    page:'test8Page',
                    username: 'test8'
                },
                session:{user:{username:'anotherUser'}}
            }
            pageController.get(db, req, function(err, doc){
                //console.log('testValidGetPrivateNonOwnerPage:  '+err+doc);
                assert.isNull(doc);
                assert.eql(err, 'This page is private.');
                Page.remove({owner:'test8', title:'test8Page'}, function(){
                    counter++;
                });
            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    },
 
    // Test valid update of own page
    'testValidUpdatePage': function(beforeExit, assert){
        
        var counter = 0; 
        var user = 'test9';
        // first, create the page to be tested
        
        var cfg9 = {
            title: user+'Page',
            privacy: 'private',
            owner: user,
            allowed: [],
            elements: []
        }

        pageController.create(db, cfg9, function(err, msg){
            console.log('testValidUpdatePage1: '+err+msg);
            // then try to get the page
            // request should have these things in it
            req = {
                params:{
                    page:user+'Page',
                    username: user
                },
                session:{user:{username:user}},
                // takes in an html array of elements
                body:{
                    "elements":"[\"<div>element1</div>\", \"<div>element2</div>\"]"
                }
            }
            pageController.update(db, req, function(err){
                console.log('testValidUpdatePage2:  '+err);
                
                // now, read from mongo to verify update
                Page.findOne({owner:user, title:user+'Page'},function(err, doc){
                    // verify mongo entry
                    console.log('testValidUpdatePage3: '+err+doc);
                    console.log('testValidUpdatePage4: '+JSON.stringify(doc.elements[0]));
                    assert.isNull(err);
                    Page.remove({owner:user, title:user+'Page'}, function(){
                        counter++;
                    });
                });
            });
        });

        beforeExit(function(){
            // make sure all tests have executed here
            assert.eql(counter, 1);   
        });

    } 
}

