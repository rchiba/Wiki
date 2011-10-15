/*
Register test module
A controller test for the register.js handler 
*/

// Module to test
var regController = require('../myModules/register');

// mongodb the register.js interacts with
var Mongoose = require('mongoose');
var db = Mongoose.connect('mongodb://localhost/db');
require('../models/users');
var User = db.model('User');

module.exports =  {

    'testNoName': function(beforeExit, assert){
        var req = {
            body:{
                username: '',
                password: '',
                confirm_password:''
            }
        }
        
        regController.handle(req, User, function(type, msg){
            assert.isNotNull(type);
            assert.isNotNull(msg);
            assert.eql(type, 'warn');
            assert.eql(msg, 'Please enter a password.');
        });
    },

    'testExistingUser': function(beforeExit, assert){
        var req = {
            body:{
                username: 'ryo',
                password: 'asdf',
                confirm_password:'asdf'
            }
        }
        
        regController.handle(req, User, function(type, msg){
            assert.isNotNull(type);
            assert.isNotNull(msg);
            assert.eql(type, 'warn');
            assert.eql(msg, 'Username is in use.');
        });
    },
    
    'testNonmatchingPass': function(beforeExit, assert){
        var req = {
            body:{
                username: 'test',
                password: '123456',
                confirm_password:'1234567'
            }
        }
        
        regController.handle(req, User, function(type, msg){
            assert.isNotNull(type);
            assert.isNotNull(msg);
            assert.eql(type, 'warn');
            assert.eql(msg, 'Password does not match.');
        });
    },

    'testShortPass': function(beforeExit, assert){
        var req = {
            body:{
                username: 'test',
                password: '1',
                confirm_password:'1'
            }
        }
        
        regController.handle(req, User, function(type, msg){
            assert.isNotNull(type);
            assert.isNotNull(msg);
            assert.eql(type, 'warn');
            assert.eql(msg, 'Password must be at least 5 characters.');
        });
    },
    
    'testValid': function(beforeExit, assert){
        var req = {
            body:{
                username: 'test',
                password: '1234567',
                confirm_password:'1234567'
            }
        }
        
        regController.handle(req, User, function(type, msg){
            assert.isNotNull(type);
            assert.isNotNull(msg);
            assert.eql(type, 'info');
            assert.eql(msg, 'User created');

            // Tear down
            User.findOne({username: 'test'}, function(err, doc){
                doc.remove();
            });

        });
    }

}

