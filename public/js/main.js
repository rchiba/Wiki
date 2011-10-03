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
  

});

YUI({
    debug:true,
    useBrowserConsole: true,
    }).use('node', 'box', 'picbox', 'audiobox', 'sensor', 'event-synthetic', function (Y) {

    Y.on('domready', function(){
    
        // Sensor class keeps track of all nodes
        var sensor = new Y.pixel.Sensor();
        var boxes = [];

        Y.one('#addTextBox').on('click',function(){
            var box = new Y.pixel.Box({
                parentNode:'#content',
                defaultClass:'contrast'
            });
            box.render(Y.one('#content'));
            sensor.bindBoxes();
            box.setState('move');
            boxes.push(box);
        });
        
        Y.one('#addPhoto').on('click',function(){
            var pic = new Y.pixel.PicBox({
                parentNode:'#content',
                pic:'/js/modules/box/shadow.JPG'
            });
            pic.render(Y.one('#content'));
            sensor.bindBoxes();
            pic.setState('move');
            boxes.push(pic);
        });

        Y.one('#addAudio').on('click',function(){
            var audio = new Y.pixel.AudioBox({
                parentNode:'#content',
                mp3Src:'/js/modules/box/shadow',
                oggSrc:''
            });
            audio.render(Y.one('#content'));
            sensor.bindBoxes();
            audio.setState('move');
            boxes.push(audio);
        });

        Y.one('#edit').on('click',function(){
            var buttonContent = Y.one('#edit').get('text');
            // Use the contents of the button to determine state
            Y.log('buttonContent is '+buttonContent, 'debug');
            if(buttonContent == 'Done'){
                boxes.forEach(function(item){
                    item.destroyDD();
                });
            }else{
                boxes.forEach(function(item){
                    item.initializeDD(); 
                });
            }
        });
  
    }); // end domready
    
});// end YUI
