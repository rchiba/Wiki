$(document).ready(function() {

  // handling scrolling toolbar
  $(window).scroll(function(e){
    console.log('scrollin '+$('#toolbar').css('position')); 
    if($(window).scrollTop()>100&&$('#toolbar').css('position')!='fixed'){
      console.log('setting position to fixed');
      $('#toolbar').css('position','fixed');
    }else if($(window).scrollTop()<=100&&$('#toolbar').css('position')!='static'){
      $('#toolbar').css('position','static');
    }
  }); // END window.scroll

  $('#loginOverlay').dialog({
    autoOpen:false,
    show: 'blind',
    hide: 'explode',
    resizable: false,
    draggable:false,
    modal:true
  });

  // handling login window close      
  var overlayFlag = false; 
  $(document.body).click(function(e){
    if($(e.target).parents().index($('#loginOverlay'))<0&&$('#loginOverlay').css('visibility')=='visible'&&!overlayFlag){
      //$('#loginOverlay').css('visibility','hidden');
      $('#loginOverlay').dialog('close');
    }
    overlayFlag = false;
  });

  // Login button functionality
   $("#loginButton").click(function() {
      if($('#loginOverlay').css('visibility')=='visible'){
        //$('#loginOverlay').css('visibility','hidden');
        $('#loginOverlay').dialog('close');
      }
      else if($('#loginOverlay').css('visibility')=='hidden'){
        //$('#loginOverlay').css('visibility','visible');
        $('#loginOverlay').dialog('open');
        overlayFlag=true;
      }
   });
  

  // Edit button stuff
  $("#edit").toggle(function(){
    activateEditMode();
  },function(){
    deactivateEditMode();
  });
  
  // This function is to turn on edit mode
  function activateEditMode(){
     
    // add grid class, and other changes
    $('#page').addClass('grid');
    $('#edit').text('Done');

    // render toolbar
    renderToolbar(true);

    // begin periodic data transmission to server
    
  }

  // This function is to turn off edit mode
  function deactivateEditMode(){

    // remove grid class
    $('#page').removeClass('grid');
    $('#edit').text('Edit');
    
    // derender toolbar
    renderToolbar(false);

  }

  // this function renders or derenders the toolbar
  function renderToolbar(render){
    if(render){
      // turn on each of the edit buttons
        $('.editorButton').each(function(index){
          $(this).css('display','block');
        });
    }
    else{
      // turn off each of the edit buttons
        $('.editorButton').each(function(index){
          $(this).css('display','none');
        });
    }

  }
  
  // handler for add text
  $('#addTextBox').click(function(){
    var d = new Date();
    var newElement = $("<textarea>");
    $('#content').append(newElement);
    newElement.addClass("textElement").attr('id',d.getTime());
    newElement.css('height',200).css('width',200).css('background-color','#ccc').css('opacity',.5);
    newElement.resizable({
      containment: "#content",
      grid: [8,8],
      maxWidth:1024
    }).parent().draggable({
      containment: "#content",
      grid: [8,8],
      scroll: true,
      scrollSpeed:50,
      scrollSensitivity: 100
    });
  });

});
