'use strict';

var DK = DK || {};

var AnalyticsView = Backbone.View.extend({
  sectionsToTrack: ['social', 'taylor', 'varieties', 'rewards'],
  tracked: {},

  initialize: function() {

    debug.log('Analytics View initialized');

    this.setUpScrollTrack();
    this.bindScrollEvent();

    var _this = this;

    window.setTimeout(function() {
      _this.trackStructEvent('page', '/home');
    }, 2500);
    

    this.on('clickEvent', function(data) {
      this.trackStructEvent(data.category, data.action, data.label, data.value);
    });

  },
  trackStructEvent: function(category, action, label, value) {
    debug.log(category, action, label, value);
    uvHelpers.trackStructEvent(category, action, label, value);
  },
  bindScrollEvent: function() {
    var _this = this;
          
    $(window).on('scroll', function() {
      _this.trackScoll();
    });
  },
  trackScoll: function() {
    var _this = this;

    $.each(_this.sectionsToTrack, function(index, id) {
      var container = '#' + id;
      if(_this.isInView($(container)) && _this.tracked[$(container).attr('id')] == false) {
        var label;
        switch($(container).attr('id')) {
          case 'social':
            label = 'join_the_convo';
            break;
          case 'taylor':
            label = 'ts_heart_dko';
            break;
          case 'varieties':
            label = 'varieties';
            break;
          case 'rewards':
            label = 'my_coke_rewards';
            break;
          default:
            $(container).attr('id');
            break;
        }
        _this.tracked[$(container).attr('id')] = true;
        _this.trackStructEvent('scroll', label, 'scroll_to_' + label);
      }
    });
  },
  setUpScrollTrack: function() {
    var _this = this;
    $.each(this.sectionsToTrack, function(index, id) {
      _this.tracked[id] = false;
    });
  },
  
  isInView: function($container) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $container.offset().top;
    var elemBottom = elemTop + $container.height();

    return ((docViewTop < elemTop) && (docViewBottom > elemBottom));
  }
    
});

DK.app.run('analyticsView', AnalyticsView);

