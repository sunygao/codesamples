/**
 * QuBit implementation Helper
 * Library is used to create bridge to 
 */
var uvHelpers = (function () {

    // Private variables
    var pub = {};

    //HTML Events
    var htmlEvents = { // list of real events
        //<body> and <frameset> Events
        onload: 1,
        onunload: 1,
        //Form Events
        onblur: 1,
        onchange: 1,
        onfocus: 1,
        onreset: 1,
        onselect: 1,
        onsubmit: 1,
        //Image Events
        onabort: 1,
        //Keyboard Events
        onkeydown: 1,
        onkeypress: 1,
        onkeyup: 1,
        //Mouse Events
        onclick: 1,
        ondblclick: 1,
        onmousedown: 1,
        onmousemove: 1,
        onmouseout: 1,
        onmouseover: 1,
        onmouseup: 1
    };

    /** Private Function
     *  Triggers an Event against a dom element in a cross compatable way
     *
     *  @param el  - element to trigger event against
     *  @param eventName - the name of the event
     */
    function triggerEvent(el, eventName) {
        var event;
        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(eventName, true, true);
        } else if (document.createEventObject) { // IE < 9
            event = document.createEventObject();
            event.eventType = eventName;
        }
        event.eventName = eventName;
        if (el.dispatchEvent) {
            el.dispatchEvent(event);
        } else if (el.fireEvent && htmlEvents['on' + eventName]) { // IE < 9
            el.fireEvent('on' + event.eventType, event); // can trigger only real event (e.g. 'click')
        } else if (el[eventName]) {
            el[eventName]();
        } else if (el['on' + eventName]) {
            el['on' + eventName]();
        }
    }

    /** Private Function
     *  Adds an event to an element in a cross compatable way
     *
     *  @param el  - element to trigger event against
     *  @param type - the name of the event
     *  @param handler - function to call when event triggers
     */
    function addEvent(el, type, handler) {
        if (el.addEventListener) {
            el.addEventListener(type, handler, false);
        } else if (el.attachEvent && htmlEvents['on' + type]) { // IE < 9
            el.attachEvent('on' + type, handler);
        } else {
            el['on' + type] = handler;
        }
    }

    /** Private Function
     *  Adds an event to an element in a cross compatable way
     *
     *  @param el  - element to trigger event against
     *  @param type - the name of the event
     *  @param handler - function to call when event triggers
     */
    function removeEvent(el, type, handler) {
        if (el.removeventListener) {
            el.removeEventListener(type, handler, false);
        } else if (el.detachEvent && htmlEvents['on' + type]) { // IE < 9
            el.detachEvent('on' + type, handler);
        } else {
            el['on' + type] = null;
        }
    }

    //if(!window.addEventListener) {
    //  ie = true;
    //  window.addEventListener = function(t, h) { addEvent(window, t, h); };
    //}

    /** 
     *  Bind filter on listen for OpenTag Event
     *
     *  @param el  - element to trigger event against
     *  @param type - the name of the event
     *  @param handler - function to call when event triggers
     */
    pub.listen = function (fn) {
        addEvent(window, "OpenTagEvent", fn);
    };
    
    /**
     * Helper function to offload filter callbacks
     *
     * @param string category The category of the filter you want to trigger, or empty string for all categorys
     * @param string action The action of the filter you want to trigger, or empty string for all actions
     * @param string label the label of the filter you want to trigger, or empty string for all lables
     */
    pub.setStarter = function(category, action, label, cb) {
        var anon = function(){
            var i = window.universal_variable.events.length;
            while (i--) {
                e = window.universal_variable.events[i];
                if (e.type == 'struct' && (e.category==category || category == "")&& (e.action==action|| action == "") && (e.label==label || label=="")) {
                     window.universal_variable.current_event = e;
                     cb();
                     window.universal_variable.events.splice(i, 1);
                }
            }
        };
        addEvent(window, "OpenTagEvent", anon);
    };  

    // To identify all events to listen for in OpenTag
    /**
     * Tracks a structured event in QuBIT OpenTag's
     * Universal Variable.
     *
     * Compatible with Google Analytics and SnowPlow.
     *
     * @param string category The name you supply for
     *        the group of objects you want to track
     * @param string action A string that is uniquely
     *        paired with each category, and commonly
     *        used to define the type of user
     *        interaction for the web object
     * @param string label An optional string
     *        to provide additional dimensions to the
     *        event data
     * @param string property An optional string
     *        describing the object or the action
     *        performed on it. This might be the
     *        quantity of an item added to basket
     * @param int|float|string value An integer that
     *        you can use to provide numerical data
     *        about the user event
     */
    pub.trackStructEvent = function (category, action, label, property, value) {

        // Safe initialization
        window.universal_variable = window.universal_variable || {};
        window.universal_variable.events = window.universal_variable.events || [];

        // Push the event
        window.universal_variable.events.push({
            // Standard UV fields - see: https://github.com/QubitProducts/UniversalVariable
            'type': 'struct',
            'time': null,
            'cause': null,
            'effect': null,
            // Extension for GA/SP structured events
            'category': category,
            'action': action,
            'label': label,
            'property': property,
            'value': value
        });

        // Notify OpenTag
        triggerEvent(window, "OpenTagEvent");

    };

    /**
     * Tracks an unstructured event in QuBIT OpenTag's
     * Universal Variable.
     *
     * Compatible with MixPanel, KISSmetrics et al.
     *
     * @param string name A string which identifies
     *        the type of event
     * @param object properties An arbitrary,
     *        unstructured JSON envelope containing all
     *        properties relating to this event
     */
    pub.trackUnstructEvent = function (name, properties) {

        // Safe initialization
        window.universal_variable = window.universal_variable || {};
        window.universal_variable.events = window.universal_variable.events || [];

        // Push the event
        window.universal_variable.events.push({
            // Standard UV fields - see: https://github.com/QubitProducts/UniversalVariable
            'type': 'unstruct',
            'time': null,
            'cause': null,
            'effect': null,
            // Extension for MX/KS/etc unstructured events
            'name': name,
            'properties': properties
        });

        // Notify OpenTag
        triggerEvent(window, "OpenTagEvent");
    };

    return pub; // Only the two functions are public.
}());
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());