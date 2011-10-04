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
     
    // render toolbar
    renderToolbar(true);

    // begin periodic data transmission to server
    
  }

  // This function is to turn off edit mode
  function deactivateEditMode(){

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
    }).use('node', 'box', 'picbox', 'audiobox', 'videobox', 'sensor', 'event-synthetic', function (Y) {

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
            box.setState('move');
        });
        
        var picCounter = 0;
        Y.one('#addPhoto').on('click',function(){
            var pic = new Y.pixel.PicBox({
                parentNode:'#content',
                pic:'/images/Capture'+picCounter%15+'.JPG'
            });
            pic.render(Y.one('#content'));
            pic.setState('move');
            picCounter++;
        });
        
        Y.one('#addAudio').on('click',function(){
            var audio = new Y.pixel.AudioBox({
                parentNode:'#content',
                mp3Src:'/js/modules/box/audio.mp3',
                oggSrc:''
            });
            audio.render(Y.one('#content'));
            audio.setState('move');
        });


        Y.one('#addVideo').on('click',function(){
            var video = new Y.pixel.VideoBox({
                parentNode:'#content',
                videoLink:'http://youtu.be/QH2-TGUlwu4',
            });
            video.render(Y.one('#content'));
            video.setState('move');
        });

       
        // Edit button toggling 
        var editModeOn = false;
        Y.one('#edit').on('click',function(){
            if(editModeOn){
                // turn off edit mode
                Y.log('turning off edit mode', 'debug');
                editModeOn = false;
                sensor.broadcastState('done');
                Y.one('#page').removeClass('grid'); 
                Y.one('#edit').set('text', 'Edit');
            }else{
                // turn on edit mode
                Y.log('turning on edit mode', 'debug');
                editModeOn = true;
                sensor.broadcastState('move');
                Y.one('#page').addClass('grid');
                Y.one('#edit').set('text', 'Done');
            }

        });
  
    }); // end domready
    
});// end YUI
