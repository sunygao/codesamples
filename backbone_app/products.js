'use strict';

var DK = DK || {};

var ProductView = Backbone.View.extend({
  cansVisible: false,
  el: '#varieties',
  initialize: function() {

    debug.log('Product View initialized');


    this.checkVisibility();

  },
  checkVisibility: function() {
    // var docViewTop = $(window).scrollTop();
    // var docViewBottom = docViewTop + $(window).height();

    // var elemTop = $('#varieties').offset().top - 100;
    // var elemBottom = elemTop + $('#varieties').height();
    if(this.isInView() === true) {
      this.animateInCans();
    } else {
      this.bindScrollEvent();
    }
  },
  bindScrollEvent: function() {
    var _this = this;
   
    $(window).on('scroll', function() {
       if(!_this.cansVisible) {
        if(_this.isInView() === true) {
          _this.animateInCans();
        }
      }
    });
  },
  isInView: function() {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $('#varieties').offset().top - 100;
    var elemBottom = elemTop + $('#varieties').height();

    return ((elemBottom <= docViewBottom)); 
  },
  
  animateInCans: function() {
    $('#varieties li:nth-child(1), #varieties li:nth-child(2), #varieties li:nth-child(4), #varieties li:nth-child(5)').addClass('animatedIn');
    this.cansVisible = true;
  }
    
});

DK.app.run('productView', ProductView);

