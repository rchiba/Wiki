
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
        rBox.setStyle('background-color','#abc');
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
            Y.log('somebody clicked a parentNode');
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
                this.destroyDD();
                this.get('rBox').setAttribute('contentEditable', 'false');
            break;
            case 'move':
                this.initializeDD();
                this.get('rBox').setAttribute('contentEditable', 'false');
            break;
            case 'edit':
                this.destroyDD();
                this.get('rBox').setAttribute('contentEditable', 'true');
            break;
        }
    
    },
    
    initializeDD: function(){
    
        Y.log('initializing DD');
    
        var rBox = this.get('rBox');
        var bBox = this.get('bBox')
    
        var dd = new Y.DD.Drag({
            node: rBox
        }).plug(Y.Plugin.DDConstrained, {
            constrain2node: bBox.get('parentNode'),
            tickX:8,
            tickY:8
        });
        
        var resize = new Y.Resize({
            node:rBox
        }).plug(Y.Plugin.ResizeConstrained, {
            constrain: bBox.get('parentNode'),
            tickX:8,
            tickY:8
        });
        
        this.set('dd',dd);
        this.set('resize',resize);
        
    },
    
    destroyDD: function(){
    
        Y.log('destroyingDD');
    
        this.get('dd').destroy();
        this.get('resize').destroy();
        this.bindRBox();
    },
    
    bindRBox: function(){
        Y.log('bindRBox');
        
        var that = this;
        
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
        
        dd:{},
        
        resize:{},
        
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
        }
    }
});

Y.namespace('Box').regular = Box;

}, "0.1", { requires: ['widget', 'substitute', 'jsonp', 'base', 'dd-constrain', 'resize'] });