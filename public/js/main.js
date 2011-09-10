$(document).ready(function() {

  // Login button functionality
  var showOrHide = false;
   $("#loginButton").click(function() {
     console.log('hello world');
     if ( showOrHide == true ) {
        $('#loginOverlay').css('visibility','hidden');
        showOrHide = false;
      } else if ( showOrHide == false ) {
        $('#loginOverlay').css('visibility','visible');
        showOrHide = true;
      }
   });
   
  // Login button stuff
  $("#loginButton").mouseover(function() {
  console.log('helloworld');
    $("#loginButton").css('background-color','f9b11c');
  });
});