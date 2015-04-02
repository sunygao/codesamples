define(['jquery',
		'preloadjs',
        'tweenMax',
        'app'
], function ($, preloadjs, TweenMax, App) {
	'use strict';

	var Globe = function() {
		console.log('globe initialized');

        if(App.useragent == 'iOS') {
            this.cloudSpeed = .3;
        } else {
            this.cloudSpeed = .5;
        }
        
        this.mapSpeed = this.cloudSpeed * .5;
        
        this.offsetX = 14;
        
        this.maxWidth = 640;
        
	};

	Globe.prototype.init = function() {
        this.start();     
	};

    Globe.prototype.destroy = function() {
        var _this = this;
       window.cancelAnimationFrame(_this.animationID);    
    };

	Globe.prototype.draw = function() {
		var _this = this;
        var cloudPos = this._getTransform($('#clouds'));
        var mapPos = this._getTransform($('#map'));

        if (cloudPos.translateX >= this.offsetX) {
            cloudPos.translateX = -($('#clouds').width() - $('#clouds').height()) + this.offsetX;
        }

        if (mapPos.translateX >= this.offsetX) {
            mapPos.translateX = -($('#map').width() - $('#map').height()) + this.offsetX;
        }


        this._transform($('#clouds'), (cloudPos.translateX + this.cloudSpeed), cloudPos.translateY);
        this._transform($('#map'), (mapPos.translateX + this.mapSpeed), mapPos.translateY);

        this.animationID = window.requestAnimFrame(function() {
        	_this.draw();
        });
    };


    Globe.prototype.start = function() {
    	var _this = this;
        this.animationID = window.requestAnimFrame(function() {
        	_this.draw(); 
        });
    };


     Globe.prototype.stop = function() {
     	var _this = this;
	    window.cancelAnimationFrame(_this.animationID);
	};

    Globe.prototype._transform = function( el, posX, posY )  {
        TweenMax.set(el, {
            y: posY,
            x: posX,
            z: 0
        });
    };

    Globe.prototype._getTransform = function(el) {
        var matrix = new WebKitCSSMatrix($(el).css('transform'));

        return {
            'translateX' : matrix.m41,
            'translateY' : matrix.m42
        };
    }

	return Globe;

});
