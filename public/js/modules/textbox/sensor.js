YUI.add('sensor', function(Y){

var Sensor;

function Sensor(config) {
    Sensor.superclass.constructor.apply(this, arguments);
}

Sensor.NAME = "sensor";

Sensor.ATTRS = {

    // the selected node is tracked
    nodesSelected : {
        value:[]
    }
    
}

Y.extend(Sensor, Y.Base, {

    initializer : function(cfg) {
    },


    destructor : function() {
    },
    
    // bind some event handlers to the sensor
    bindHandlers: function() {
        // listen to the setState for updates
        Y.after('box:setState',function(e){
            Y.log('sensor has heard a state change to '+e.state);
        },this);
        
    }
    
});

Y.namespace("pixel").Sensor = Sensor;

}, "0.1", { requires: ['base'] });