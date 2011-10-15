/*
Page module
This module is in charge of saving and retrieving page data. The page represents a single page of somebody's wiki.
*/


module.exports =  {

    // takes in data and saves to mongo
    save: function(){
    
        // do some parsing

        // save into mongo
    
    }

    // retrieves data from mongo
    get: function(Page, username, page, callback){

       if(session.user.login !== username){
           // User is checking another user's page

           // if private, then render private message

           // else load page from mongo 

           // return elements

       }else{
           // user is checking own page

           // load page from mongo

           // return elements
       }

    }

}

