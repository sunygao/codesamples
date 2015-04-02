define(['jquery',
		'slick'
], function ($, Utils) {
	'use strict';

	var TouchController = function($el, threshold, scope) {
		console.log('TouchController initialized');

		this.$el = $el;

		this.threshold = threshold;

		this.scope = scope;

		this.startX;

		this.startY;

		this.pageX;

		this.pageY;

		this.newX;

		this.newY;

		this.diffX;

		this.diffY;

		this.distance;

		this.isTouching = false;

		this.isDragging = false;

		this.touchDir;

		this.verticalDir;

	};


	TouchController.prototype.init = function() {
		this.addListeners();
	};

	TouchController.prototype.destroy = function() {
		
		this.$el = null

		this.threshold = null;

		this.scope = null;

		this.startX = null;

		this.startY = null;

		this.pageX = null;

		this.pageY = null;

		this.isTouching = null;

		this.isDragging = null;

		this.touchDir = null;

		this.verticalDir = null;
	};

	TouchController.prototype.addListeners = function() {
		var _this = this;

		$(document.body).on('touchmove', function(e) {
			e.preventDefault();
		});	


		this.$el.on('touchstart', function(e) {
			_this.handleTouchStart(e);
		});	

		this.$el.on('touchend', function(e) {
			_this.handleTouchEnd(e);
		});
	};

	TouchController.prototype.handleTouchStart = function(e) {
		var _this = this;
		this.isTouching = true;
		this.startX = e.originalEvent.touches[0].pageX;
		this.startY = e.originalEvent.touches[0].pageY;

		this.$el.on('touchmove', function(e) {
			_this.handleTouchMove(e);
		});
	};

	TouchController.prototype.handleScrollComplete = function() {
		if(this.isDragging) {
			this.startY = this.pageY;
		}
	};
	TouchController.prototype.handleTouchMove = function(e) {
		this.pageX = e.originalEvent.touches[0].pageX;
		this.pageY = e.originalEvent.touches[0].pageY;
		this.newX = this.pageX;
		this.newY = this.pageY;
		this.diffX = Math.abs(this.newX - this.startX);
		this.diffY = Math.abs(this.newY - this.startY);
		this.distance = this.diffX * this.diffX + this.diffY * this.diffY;

		if (this.distance > Math.pow(this.threshold, 2)) {
			if(this.isDragging == false) {
				this.isDragging = true;
				if(this.diffX > this.diffY) {					
					this.touchDir = 'horizontal';
				} else {
					this.touchDir = 'vertical';
				}
			}	
		}


	
		if(this.touchDir == 'horizontal') {
			// e.stopPropagation();
			if(this.scope.handleHorizontalTouch) {
				this.scope.handleHorizontalTouch(e);
			}	
		} else if(this.touchDir == 'vertical') {
			if (this.startY > this.newY) {
				this.verticalDir = 'down';
			} else if (this.startY < this.newY) {
				this.verticalDir = 'up';
			}
			if(this.scope.handleVerticalTouch) {
				this.scope.handleVerticalTouch(this.verticalDir);
			}	
		}


	};
	TouchController.prototype.handleTouchEnd = function(e) {
		this.isTouching = false;
		this.isDragging = false;
		this.touchDir = null;
		if(this.scope.handleTouchEnd) {
			this.scope.handleTouchEnd(e);
		}	
	};

	return TouchController;

});
