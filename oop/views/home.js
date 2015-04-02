define(['jquery',
		'tweenMax',
		'app',
		'mobile/common/pagination',
		'mobile/common/scroller',
		'mobile/common/carousel',
		'mobile/views/globe'
], function ($, TweenMax, App, Pagination, Scroller, Carousel, Globe) {
	'use strict';

	var Home = function() {
		console.log('homepage initialized');

		var _this = this;

		this.getRandomFeature();

		this.$carouselEl = $('#stories-gallery .carousel ul');

		this.$carouselParent = $('#stories-gallery');

		this.carousel = new Carousel(this.$carouselEl, this);
		this.carousel.init();

		if(App.pagination) {
      		App.pagination.destroy();
      		App.pagination = null;
    	}

		App.pagination = new Pagination($('#content'), $('#main'), this);
    	App.pagination.init();
    	
		if(App.globe) {
	      App.globe.destroy();
	      App.globe = null;
	    }
		App.globe = new Globe();
		App.globe.init();

		if(this.bannerTimer) {
			window.clearRequestInterval(_this.bannerTimer);
		}

		this.getNews();

		this.$banner = $('#banner');

		this.$news = [];

		this.$newsDomEls = [];

		this.bannerTimer;

		this.totalNews;

		this.currentNewsEl = 0;

		this.hash = window.location.hash.replace('#', '');

		this.hash = this.hash.split('/')[1] || this.hash;
	
		if(this.hash) {
			var _this = this;
			this.gotoHash();
		} 
	};

	Home.prototype.getNews = function() {
		var _this = this;

		$.ajax('/api/news', {
            success: function(response) {
            	if(response.data && response.data.length > 0) {
            		_this.totalNews = response.data.length;

            		$.each(response.data, function(i, item) {
            			var $domEl = $('<span class="news">' + item.copy + '</span>');
            			_this.$news.push(item);
            			_this.$newsDomEls.push($domEl);
            			$('#banner #news-cta').append($domEl);
            		});

            		_this.animateBanner();
            	}
            
            },
            error: function(var1, var2, var3) {
               console.log('error');
            }
        });
	};

	Home.prototype.getRandomFeature = function() {
		var bgImage = $('#intro .image-preload').attr('src');
		
		$('#intro').css('backgroundImage', 'url(' + bgImage + ')');
	};

	Home.prototype.onSlideChange = function() {
		var curIndex = this.carousel.getCurrentSlide();
		var curSlide = this.$carouselEl.find('[index="' + curIndex +'"]')[0];
		var id = $(curSlide).find('div').attr('data-id');

		this.$carouselParent.removeClass().addClass('page ' + id);
	};

	Home.prototype.animateBanner = function(duration) {
		var _this = this;

		TweenMax.to($('#banner'), duration, { 
			y: 0,
			'onComplete': function() {
				_this.$newsDomEls[this.currentNewsEl].show();
				TweenMax.to(_this.$newsDomEls[this.currentNewsEl], .2, {
					'opacity': 1,
					'onComplete': function() {
						$('#news-cta').attr('href', _this.$news[_this.currentNewsEl].url);
						_this.rotateBanner();
					}
				});
			},
			'onCompleteScope': this
		});  		
		
	};

	Home.prototype.gotoHash = function() {
		if(this.hash) {
			var _this = this;
			var hash = this.hash;
			App.pagination.goToPage(1, .5);
			$('#content').on('scrollComplete', function() {
				App.pagination.goToPage(2, .5);
				$('#content').off('scrollComplete');
			});
			this.carousel.goToSlide(hash);
		}
	};

	Home.prototype.handleScrollStart = function() {
		if(App.pagination.direction == 'up') {
			switch(App.pagination.curPage) {
				case 1:
					$('.down-arrow').show();
				break;

				default:
				
				break;
			}
		}
      
	};

	Home.prototype.handleScrollComplete = function() {
		if(App.pagination.direction == 'down') {
			switch(App.pagination.curPage) {
				case 2:
					$('.down-arrow').hide();
				break;

				default:
				
				break;
			}
		} 
	};

	Home.prototype.handleScrollUpdate = function() {	
		var tweenProgress = App.pagination.pageTweener.progress() * (2 - App.pagination.pageTweener.progress());

		if(App.pagination.direction == 'down') {
			switch(App.pagination.curPage) {
				case 1:
					this.updateGlobePos(tweenProgress);
				break;

				case 2:
					this.moveStoryNav(tweenProgress);
					this.fadeArrow(tweenProgress);
				break;

				default:
				
				break;
			}
		} else if(App.pagination.direction == 'up') {
			switch(App.pagination.curPage) {
				case 0:
					this.updateGlobePos(1 - tweenProgress);
				break;

				case 1:
					this.moveStoryNav(1 - tweenProgress);
					this.fadeArrow(1 - tweenProgress);
				break;

				default:
				
				break;
			}
		}
	};

	Home.prototype.updateGlobePos = function(tweenProgress) {
		TweenMax.set($('#globeWrapper'), { y : 30 * tweenProgress + '%'} ); 
		TweenMax.set($('#globeWrapper .headline-2'), { 'y': 20 * (1- tweenProgress) + '%'}); 
	};

	Home.prototype.updateArrowPos = function(segPercent) {
		TweenMax.set( $('.down-arrow'), { 'bottom': 100 * segPercent + '%' });
	};

	Home.prototype.fadeArrow = function(segPercent) {
		TweenMax.set($('.down-arrow'), { 
			'opacity': 1 * (1-segPercent)
		});
	};


	Home.prototype.moveStoryNav = function(tweenProgress) {
	
		TweenMax.set( $('#stories-gallery'), { 'y': -100 * tweenProgress + '%' });
	};

	Home.prototype.rotateBanner = function (){
		var _this = this;
  		this.bannerTimer = window.requestInterval(function() {
			_this.showBanner();
		}, 4000);
	};

	Home.prototype.showBanner = function () {
		var _this = this;
		
		// $(this.$newsDomEls).each(function() {
		// 	$(this).css('opacity', 0);
		// });

		TweenMax.to(_this.$newsDomEls[_this.currentNewsEl], .2, {
			'opacity': 0,
			'onComplete': function() {
				_this.$newsDomEls[_this.currentNewsEl].hide();
				_this.currentNewsEl++;
				if(_this.currentNewsEl == (_this.totalNews)) {
					_this.currentNewsEl = 0;
				}
				_this.$newsDomEls[_this.currentNewsEl].show();
				TweenMax.to(_this.$newsDomEls[_this.currentNewsEl], .2, {
					'opacity': 1,
					'onComplete': function() {
						$('#news-cta').attr('href', _this.$news[_this.currentNewsEl].url);
					}
				});
				//_this.rotateBanner();
			}
		});
		// this.currentNewsEl++;

		// if(this.currentNewsEl == (this.totalNews)) {
		// 	this.currentNewsEl = 0;
		// }

  		//this.$newsDomEls[this.currentNewsEl].css('opacity', 1);
  		
	};

	return Home;

});
