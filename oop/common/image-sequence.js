define(['jquery',
		'tweenMax',
		'preloadjs'
], function ($, TweenMax, preloadjs) {
	'use strict';

	var ImageSequence = function(el, path, imageName, length, speed) {
		console.log('imagesequence initialized');

		this.images = [];

		this.length = length;

		this.path = path;

		this.speed = speed;

		this.imageName = imageName;

		this.$el = el;

		this.sprites = -1;

		this.spritesJSON = [];

		this.frames = [];

		this.curSprite = 0;

		this.curFrame = -1;

		this.frameLength = 0;

		this.direction = 'forwards';

		this.sequenceInterval;

		this.$imageSequences = [];

		this.isPlaying = false;

		this.JSONLoaded = false;

		for(var i = 0; i < this.length; i++) {
			this.$imageSequences[i] = $('#' + this.imageName + i);
		}

		this.$image = $('#' + this.imageName + this.curSprite);

		this.$image.css('visibility', 'visible');
	};

	ImageSequence.prototype.init = function() {
		var start = null;
		var _this = this;

		this.scaleImageSequence();

		var jsonPreload = new createjs.LoadQueue();
	    jsonPreload.addEventListener('fileload', function(e) {
	    	_this.handleJSONLoaded(e);
	    });

		for(var i = 0; i < this.length; i++) {
			jsonPreload.loadFile(_this.path + _this.imageName + i + '.json');
		}
	};

	ImageSequence.prototype.destroy = function() {
		var _this = this;
		if(this.isPlaying) {
			window.clearRequestInterval(_this.sequenceInterval);
			_this.isPlaying = false;
		}
	};

	ImageSequence.prototype.scaleImageSequence = function() {
		var elWidth = this.$el.width();
		var windowWidth = $(window).width();
		var scale = windowWidth/elWidth;

		TweenMax.set(this.$el, {'transform' : 'scale(' + scale + ')'});
		this.$el.show();
	};

	ImageSequence.prototype.playBackwards = function() {
		this.curFrame--; 
		if(this.curFrame == 0) { 
			this.curSprite--;
			if(this.curSprite < 0) {
				this.curSprite = 0;
				this.curFrame = 0;
				this.direction = 'forwards';
				return;
			
			}
			this.frameLength = this.spritesJSON[this.curSprite].length;
			this.curFrame = this.frameLength - 1;
			
		
			this.$el.find('.image').css('visibility', 'hidden');
			this.$image = this.$imageSequences[ this.curSprite ];
			this.$image.css('visibility', 'visible');
		}
		this.updateImage();
	};	

	ImageSequence.prototype.playForwards = function() {

		this.frameLength = this.spritesJSON[this.curSprite].length;
		this.curFrame++; 

		if(this.curFrame == this.frameLength) { 
			this.curFrame = 0; 
			this.curSprite++; 
			if(this.curSprite == this.length) {
				this.curSprite = this.length - 1;
				this.curFrame = this.frameLength;
				this.direction = 'backwards';
				
				return;
			}
			this.$el.find('.image').css('visibility', 'hidden');
			this.$image = this.$imageSequences[ this.curSprite ];
			this.$image.css('visibility', 'visible');
			
		}

		this.updateImage();
	};


	ImageSequence.prototype.handleJSONLoaded = function(e) {
		var _this = this;
		$(e.result).each(function(i, val) {
		 	_this.sprites++;
		 	_this.spritesJSON[_this.sprites] = [];
		 	$.each(val.frames, function(i, val) {
		 		_this.spritesJSON[_this.sprites].push(val.frame);
		 	});
			if(_this.sprites == _this.length - 1) {
				_this.JSONLoaded = true;
				_this.$el.trigger('JSONLoaded');
		 	}
		});
	};

	ImageSequence.prototype.play = function() {
		var _this = this;
		if(this.isPlaying == false) {
			_this.sequenceInterval = window.requestInterval(function() {
				_this.isPlaying = true;
				_this.updateFrame();
			}, _this.speed);
		}
	};

	ImageSequence.prototype.updateFrame = function(timestamp) {
	  	if(this.direction == 'forwards') {
	  		this.playForwards();
	  	} else {
	  		this.playBackwards();
	  	}
						
	};	

	ImageSequence.prototype.updateImage = function() {
		var x = -1 * this.spritesJSON[this.curSprite][this.curFrame].x + 'px';
		var y = -1 * this.spritesJSON[this.curSprite][this.curFrame].y + 'px';
		
		this.$image.css('background-position', x + ' ' + y);		
	};

	return ImageSequence;

});
