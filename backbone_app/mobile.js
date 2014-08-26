'use strict';

var DK = DK || {};

var MobileView = Backbone.View.extend({
  
  initialize: function() {

    debug.log('Mobile View initialized');

    this.setUpCarousel();    

  },
  carouselOptions: { 
    speed: 400,
    mode: 'fade',
    controls: true,
    pager: true,
    pagerSelector: $('.product_pager'),
    prevText: '',
    nextText: ''
  },
  setUpCarousel: function() {
    this.carousel = new CarouselView({ el: '#varieties .flex_wrapper' }); //define the carousel
    
     this.carousel.initCarousel(this.carouselOptions);
  
  }
    
});


