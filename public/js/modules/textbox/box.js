
YUI.add('box', function(Y){

var Box;

/*
 * Textbox Widget
 * Used for editable widgetness
 */
 
Box = Y.Base.create("box", Y.Widget, [], {
    
    // nothing to be initialized so far
    initializer: function(config) {
        Y.log('initializing');
        
        this.publish('setState', {
            broadcast: 1,
            emitFacade: true
        });
        
    },
    
    // detach event handlers, etc.
    destructor: function(){
        Y.log('destructing');
    },
    
    renderUI: function() {
        Y.log('renderUI');
        
        var bBox = this.get('boundingBox');
        var cBox = this.get('contentBox');
        var rBox = Y.Node.create('<div>');
        
        rBox.setStyle('width', '80px');
        rBox.setStyle('height', '80px');
        rBox.setStyle('position', 'absolute');
        rBox.setStyle('backgroundColor','#abc');
        rBox.setStyle('padding','10px');
        rBox.setStyle('opacity','.7');
        rBox.setAttribute('contentEditable', 'true');
        cBox.insert(rBox);
        this.set('rBox', rBox);
        this.set('bBox', bBox);
        
        this.initializeDD();
      
    },
    
    bindUI: function(){
        Y.log('bindUI');
        var that = this;
        
        Y.one('#initializeDD').on('click', function(e){
            that.initializeDD();
        });
        Y.one('#destroyDD').on('click', function(e){
            that.destroyDD();
        });

        that.bindRBox();

        that.get('bBox').get('parentNode').on('click', function(e){
            that.setState('static');
        });
       
        
    },
    
    syncUI: function(){
        Y.log('syncUI');
    },
    
    // begin non-YUI functions
    isDraggable: function(){
        if(this.get('state')=='move'){
            Y.log('isDraggable returning true');
            return true
        }
        else{
            Y.log('isDraggable returning false');
            return false
        }
    },
    
    setState: function(state){
        Y.log('setting state to '+state);
        this.set('state',state);
        switch(state){
            case 'static':
                //this.destroyDD();
                this.hideDD();
                this.get('rBox').setAttribute('contentEditable', 'false');
                this.get('rBox').setStyle('opacity',this.get('opacity'));
            break;
            case 'move':
                this.fire('setState',{state:'move',node:this});
                this.initializeDD();
                this.showDD();
                this.get('rBox').setAttribute('contentEditable', 'false');
                this.get('rBox').setStyle('opacity',this.get('opacity'));
            break;
            case 'edit':
                this.destroyDD();
                var o = parseFloat(this.get('rBox').getStyle('opacity'));
                Y.log('o is '+o);
                Y.log(typeof o);
                this.get('rBox').setStyle('opacity',o+.2);
                this.get('rBox').setAttribute('contentEditable', 'true');
            break;
        }
    
    },
    
    initializeDD: function(){
    
        Y.log('initializing DD');
        
        var rBox = this.get('rBox');
        var bBox = this.get('bBox')
        
        if(this.get('dd') == null){
            var dd = new Y.DD.Drag({
                node: rBox
            }).plug(Y.Plugin.DDConstrained, {
                constrain2node: bBox.get('parentNode'),
                tickX:8,
                tickY:8
            });
            this.set('dd',dd);
        }
        
        if(this.get('resize') == null){
            var resize = new Y.Resize({
                node:rBox
            }).plug(Y.Plugin.ResizeConstrained, {
                constrain: bBox.get('parentNode'),
                tickX:8,
                tickY:8
            });
            this.set('resize',resize);
        }
        
    },
    
    destroyDD: function(){
    
        Y.log('destroyingDD');
    
        if(this.get('dd') != null){
            this.get('dd').destroy();
            this.set('dd', null);
        }
        
        if(this.get('resize') != null){
            this.get('resize').destroy();
            this.set('resize', null);
        }
        
        this.bindRBox();
    },
    
    hideDD: function(){
        this.get('rBox').all('.yui3-resize-handles-wrapper').each(function(item){ 
            Y.log('checking display and inside is '+item.get('text').trim()+typeof item.get('text'));
            if(item.get('text').trim()==''){
            // to fix a bug in IE
                Y.log('setting to display:none');
                item.setStyle('display','none');
            }
        });
    },
    
    showDD: function(){
        this.get('rBox').all('.yui3-resize-handles-wrapper').each(function(item){
            item.setStyle('display','block');
        });
    },
    
    bindRBox: function(){
        Y.log('bindRBox');
        
        var that = this;
        
        Y.one(that.get('rBox')).on('mousedown', function(e){
            Y.log('rBox click');
            
            switch(that.get('state')){
                case  'static':
                    that.setState('move');
                    break;
            }
            e.stopPropagation();
        });
        
        Y.one(that.get('rBox')).on('click', function(e){
            Y.log('rBox click');
            
            switch(that.get('state')){
                case  'static':
                    that.setState('move');
                    break;
            }
            e.stopPropagation();
        });
       
        that.get('rBox').on('dblclick', function(e){
            Y.log('rBox dblclick');
            that.setState('edit');
            e.stopPropagation();
        });
        
    }

},{
ATTRS: {
        username: {},

        count: {
            value: 10,
            validator: Y.Lang.isNumber
        },
        
        // parent node to render within
        rBox: {},
        
        bBox: {},
        
        // YUI DD plugin
        dd:{
            value: null
        },
        
        // YUI Resize plugin
        resize:{
            value: null
        },
        
        
        // state can be static, move, or edit
        state: {
                value:'static',
                validator: Y.Lang.isString
        },

        strings: {
            value: {
                title:  'Latest Updates',
                error:  'Oops!  We had some trouble connecting to Twitter :('
            }
        },

        includeTitle: {
            value: true,
            validator: Y.Lang.isBoolean
        },
        
        // style things
        
        // opacity of static state
        opacity: {
            value: .7 // defaults to .7
        }
    }
});

Y.namespace('pixel').Box = Box;

}, "0.1", { requires: ['widget', 'substitute', 'jsonp', 'base', 'dd-constrain', 'resize'] });