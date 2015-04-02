define(['jquery',
		'preloadjs'
], function ($, preloadjs) {
	'use strict';

	var Globe = function() {
		console.log('globe initialized');

		this.images = [];

		this.length = 6;

		this.path = 'assets/images/mobile/globe-sprite-320-100/';

		this.imageName = 'globe';

		this.$image = $('#globe0');

		this.sprites = -1;

		this.spritesJSON = [];

		this.frames = [];

		this.curSprite = 0;

		this.curFrame = 0;

		this.frameLength = 0;

		this.init();

		this.scaleGlobe();
	};
	Globe.prototype.scaleGlobe = function() {
		var globeWidth = $('.globe-wrapper').width();
		var windowWidth = $(window).width();
		var scale = windowWidth/globeWidth;

		$('.globe-wrapper').css('transform', 'scale(' + scale + ')');
	};


	Globe.prototype.init = function() {

		var start = null;
		var _this = this;
		var jsonPreload = new createjs.LoadQueue();
		var imgPreload = new createjs.LoadQueue();
	    imgPreload.addEventListener("fileload", handleImgLoaded);
	    jsonPreload.addEventListener("fileload", handleJSONLoaded);

		for(var i = 0; i < this.length; i++) {
			imgPreload.loadFile(_this.path + _this.imageName + i + '.jpg');
			jsonPreload.loadFile(_this.path + _this.imageName + i + '.json');
		}
		
		function handleImgLoaded(e) {
			
			_this.images.push(e.result);
		};

		function handleJSONLoaded(e) {

			$(e.result).each(function(i, val) {
			 	_this.sprites++;
			 	_this.spritesJSON[_this.sprites] = [];

			 	$.each(val.frames, function(i, val) {
			 		_this.spritesJSON[_this.sprites].push(val.frame);
			 	});
				if(_this.sprites == _this.length - 1) {
					$('.loading').hide();
			 		window.requestInterval(updateFrame, 60);
			 	}
			});
			
		};
	  

		function updateFrame(timestamp) {

			//if current sprite is between 0 and last sprite, play forward
			//if current sprite is last sprite, play backward

			console.log(_this.curSprite, _this.length);
			_this.frameLength = _this.spritesJSON[_this.curSprite].length; //frames in the current sprite
			_this.curFrame++; //play forward

			if(_this.curFrame == _this.frameLength) { //we are on the last frame
				_this.curFrame = 0; //reset current frame to 0
				_this.curSprite++; //go to the next sprite
				if(_this.curSprite == _this.length) { //now we're on the last sprite


					_this.curSprite = 0; //reset sprite to one
				}
				$('.globe').hide();
				_this.$image = $('#globe' + _this.curSprite);
				_this.$image.show();
				
			}

			updateImage();			
		}

		function updateImage() {
			var x = -1 * _this.spritesJSON[_this.curSprite][_this.curFrame].x + 'px';
			var y = -1 * _this.spritesJSON[_this.curSprite][_this.curFrame].y + 'px';
			_this.$image.css('background-position', x + ' ' + y);
		}
	};

	Globe.prototype.get3D = function(num) {
		if( num.toString().length < 2 ) {
			num = '00' + num; 
		}
	       
	    if( num.toString().length < 3 ) {
	        num = '0' + num; 
	    }
	    return num.toString(); 
	};

	return Globe;

});
