/*
 * Textbox Widget
 * Used for editable widgetness
 */
 
function Textbox(config){
    Textbox.superclass.constructor.apply(this,arguments);
}

Textbox.NAME = "textbox";

// Vars
Textbox.ATTRS = {

    // the state of the textbox
    // can be display, move, or text
    state: {
        value:'display'
    }
   
    // strings to render on hover
    strings: {
        value: {
            tooltip: "Some hotkey tips here"
        }
    }

};

// Methods
Y.extend(Textbox, Widget, {



});