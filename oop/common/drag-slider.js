define(['jquery',
		'tweenMax',
		'mobile/common/touch-controller'
], function ($, TweenMax, TouchController) {
	'use strict';

	var DragSlider = function(options) {
		console.log('DragSlider initialized');
		
		this.$el = options.$el;

		this.mode = options.mode;

		if(this.$el.find('li').size() !== 0) {
			this.$images = this.$el.find('li');
		} else {
			this.$images = $('.slider-target li');
		}


		this.$dragEl = this.$el.find('.track');

		this.$dragger = this.$el.find('.dragger');

		this.$dragWrapper = this.$el.find('.track-wrapper');

		this.$trackWidth = this.$dragEl.width();

		this.$dragCta = this.$dragWrapper.find('.drag-cta');

		this.draggerWidth = this.$el.find('.dragger').outerWidth();

		this.min = this.$dragEl.offset().left;

		this.max = this.$dragEl.offset().left + this.$dragEl.outerWidth();

		this.totalFrames = this.$images.size();

		this.frameIndex = 0; 
        
        this.lastFrameIndex = 0;

        this.frameSpeed = 0;

        this.pageX;

        this.dragPercent = 0;

        this.touch = new TouchController(this.$dragEl, 5, this);
        this.touch.init();

        this.dragging = false;

        //carousel only
        this.$headlines = $('.slider-target').find('.headlines .headline-wrapper');

       	this.slideCount = 0;
       	
		this.slides = [0];

		this.eachSlide = this.$trackWidth / (this.totalFrames - 1);
		
		for (var i = 0; i < this.totalFrames - 1; i++) {
			this.slideCount = this.slideCount += this.eachSlide;
			this.slides.push(this.slideCount);
		}

	};

	DragSlider.prototype.init = function() {

	};

	DragSlider.prototype.handleHorizontalTouch = function(e) {
		e.stopPropagation();
		this.$dragCta.addClass('hide');
		this.animateDragger(e);
		if(this.mode == 'animation') {
			this.playAnim();
		} else if(this.mode == 'carousel') {
			this.playCarousel();
		}
		
	};

	DragSlider.prototype.playAnim = function() {
	
		var framePercent = Math.floor(this.dragPercent * this.totalFrames);
		
		if($(this.$images[framePercent]).size() > 0) {
			this.$images.css('visibility', 'hidden');
			$(this.$images[framePercent]).css('visibility', 'visible');
		}
	};

	DragSlider.prototype.playCarousel = function() {
		if(this.pageX) {
			var i;
			var len = this.slides.length;
			var offsetX = this.pageX - this.min;
		
			//animating the items
			for(var i = 0; i < len - 1; i++) {
				var segLen = 1 / (len - 1);
				var segPercent = (this.dragPercent - segLen * i) / segLen;
				segPercent = Math.max(0, Math.min(1, segPercent));

				var $image = $(this.$images[i]);
				var $leftImage = $image.find('.image-left');
				var $rightImage = $image.find('.image-right');
				var width = $leftImage.width();
				TweenMax.set($leftImage, { x : -100 * segPercent + '%'} );  
				TweenMax.set($rightImage, { x : 100 * segPercent + '%' } );
			}


			
 			
 			
		
			//fading text in and out
			for (var j = 0; j < len; j++) {
				var segLen = 1 / (len - 1);
				var segPercent = (this.dragPercent - segLen * j) / segLen
				
				if(segPercent > -.5 && segPercent <= .5) { //currently animating
					$(this.$headlines[j]).removeClass('inactive').addClass('active');	
				} else if(segPercent < .5) { //hasn't gotten here yet
					$(this.$headlines[j]).removeClass('active').addClass('inactive');	
				} else if(segPercent > .5) { //animated past
					$(this.$headlines[j]).removeClass('active').addClass('inactive');	
				} else if(segPercent == 0) { //last one
					$(this.$headlines[j]).removeClass('inactive').addClass('active');	
				}

			}
		}
	};


	DragSlider.prototype.animateDragger = function(e) {
		this.pageX = e.originalEvent.touches[0].pageX;
		var draggerX = this.pageX - this.min;

		this.dragPercent = (this.pageX - this.min)/this.$trackWidth;
		this.dragPercent = Math.min(Math.max(0, this.dragPercent), 1);

		if(this.pageX < this.min) {
			draggerX = 0;
		} else if (this.pageX > this.max) {
			draggerX = this.$trackWidth;
		} 
		TweenMax.set(this.$dragger, { x : Math.floor(draggerX)} );  

	}; 
	return DragSlider;

});
