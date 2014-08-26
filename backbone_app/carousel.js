'use strict';
var DK = DK || {};

var CarouselView = Backbone.View.extend({
  slider: null,

  initCarousel: function(options, slide) {
    this.slider = this.$el.bxSlider(options);
    if(slide) {
      this.slider.goToSlide($(slide).index());
    }
  },
  reloadSlider: function(slide) {
    this.slider.reloadSlider();
    if(slide) {
      this.slider.goToSlide($(slide).index());
    }
  },
  stopAuto: function() {
    if(this.slider) {
      this.slider.stopAuto();
    }
  },
  startAuto: function() {
    if(this.slider) {
      this.slider.startAuto();
    }
  }
 
});
