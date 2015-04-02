define(['jquery',
		'preloadjs',
		'app',
		'common/scroller'
], function ($, preloadjs, App, Scroller) {
	'use strict';

	var GlobeScroll = function() {
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

		this.lastScrollPos = 0;


		this.scroller = App.home.scroller;
		

		this.scaleGlobe();


	};
	GlobeScroll.prototype.scaleGlobe = function() {
		var globeWidth = $('.globe-wrapper').width();
		var windowWidth = $(window).width();
		var scale = windowWidth/globeWidth;

		$('.globe-wrapper').css('transform', 'scale(' + scale + ')');
	};

	GlobeScroll.prototype.init = function() {

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
					$(document.body).on('touchmove', function(e) {
						// var newY = this.scroller.getScrollTop();
						// var dir;
						// if(newY > _this.lastScrollPos) {

						// }
					
						updateFrame();
					});

			 		//window.requestInterval(updateFrame, 60);
			 	}
			});
			
		};
	  

		function updateFrame() {
			_this.frameLength = _this.spritesJSON[_this.curSprite].length;
			
			_this.curFrame++;

			if( _this.curFrame == _this.frameLength) {
				_this.curFrame = 0;
				_this.curSprite++;
				if(_this.curSprite == _this.length) {
					_this.curSprite = 0;
				}
				$('.globe').hide();
				_this.$image = $('#globe' + _this.curSprite);
				_this.$image.show();
				
			}
			var x = -1 * _this.spritesJSON[_this.curSprite][_this.curFrame].x + 'px';
			var y = -1 * _this.spritesJSON[_this.curSprite][_this.curFrame].y + 'px';

			_this.$image.css('background-position', x + ' ' + y);
		}
	};

	GlobeScroll.prototype.get3D = function(num) {
		if( num.toString().length < 2 ) {
			num = '00' + num; 
		}
	       
	    if( num.toString().length < 3 ) {
	        num = '0' + num; 
	    }
	    return num.toString(); 
	};

	return GlobeScroll;

});
