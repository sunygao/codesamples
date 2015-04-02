define(['jquery',
		'skrollr',
		'tweenMax'
], function ($, skrollr, TweenMax) {
	'use strict';

	var Scroller = function() {

		console.log('Scroller initialized');

		var _this = this;

		this.debug = true;

		this.scroller;

		this.maxScrollTop;

		//defined in views
		this.sections;
		this.skrollrConstants;
	};

	Scroller.prototype.init = function() {
		var _this = this;

		//initialize skrollr
		this.scroller = skrollr.init({
			constants: _this.skrollrConstants,
			forceHeight: false
		});

		this.addListeners();
	};

	Scroller.prototype.refresh = function() {
		this.scroller.refresh();
	};

	Scroller.prototype.destroy = function() {
		this.scroller.destroy();
	};

	Scroller.prototype.getMaxScroll = function() {
		return this.scroller.getMaxScrollTop();;
	};

	Scroller.prototype.addListeners = function() {
		var _this = this;

		$(document.body).bind('carouselInitialized', function() {
			_this.refresh();
		});

		$('.down-arrow a').on('click', function(e) {
			e.preventDefault();
			var nextSection = _this.sections[_this.getSection() + 1];
			_this.goToPos(_this.skrollrConstants[nextSection]);
		});
	};

	Scroller.prototype.goToSection = function(section, duration) {
		var pos = this.skrollrConstants[section];
		this.goToPos(pos, duration);
	};

	Scroller.prototype.goToPos = function(pos, duration) {
		var _this = this;
		var duration = duration || 200;

		this.scroller.animateTo(pos, {
			duration: duration,
			easing: 'outCubic',
			done: function() {
				$(document.body).trigger('scrollAnimationComplete');
			}
		});
	};

	Scroller.prototype.getScrollTop = function() {
		return this.scroller.getScrollTop();
	};

	Scroller.prototype.getSection = function() {
		var y = this.scroller.getScrollTop();
		var i;
		var len = this.sections.length;


		for (i = 0; i < len; i++) {
			var section = this.sections[i];
			if (y < this.skrollrConstants[section]) {
			  break;
			}
		}

		var i = Math.max(0, i) - 1;

		return i;
	};


	return Scroller;

});
