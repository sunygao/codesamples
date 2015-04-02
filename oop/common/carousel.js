define(['mobile/common/touch-controller'
], function (TouchController) {
	'use strict';

	var Carousel = function($el, scope) {
		console.log('Carousel initialized');

		this.$el = $el;

		this.carousel;

		this.scope = scope;

		this.startX;

		this.startY;

		this.pageX;

		this.pageY;

		this.touch = new TouchController(this.$el, 30, this);
        this.touch.init();
	};


	Carousel.prototype.init = function() {
		var _this = this;
		
		this.carousel = this.$el.slick({
		  infinite: true,
		  speed: 300,
		  slide: '.slide-el',
		  cssEase: 'linear',
		  arrows: false,
		  dots: true,
		  onInit: function() {
		  	$(document.body).trigger('carouselInitialized');
		  },
		  onAfterChange: function() {
		  	if(_this.scope) {
		  		_this.scope.onSlideChange();
		  	}
		  }
		});	

	};

	Carousel.prototype.handleHorizontalTouch = function(e) {
		//e.stopPropagation();
	};

	Carousel.prototype.getCurrentSlide = function() {
		return this.carousel.slickCurrentSlide();
	};

	Carousel.prototype.goToSlide = function(slide) {
		var slideName = slide;
		var slideEl = this.$el.find('[data-id="' + slideName + '"]')[0];
		
		if(slideEl) {
			var index = $(slideEl).parent().attr('index');
			this.carousel.slickGoTo(index);
		}
	};

	return Carousel;

});
