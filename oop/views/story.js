define(['jquery',
    'app',
    'mobile/common/pagination',
    'mobile/common/carousel',
    'mobile/common/drag-slider',
    'mobile/common/image-sequence'
], function ($, App, Pagination, Carousel,  DragSliderController, ImageSequence) {
  'use strict';


  var Story = function() {
    console.log('story paginated initialized');

    var _this = this;

    this.currentStory = $('#page-wrapper').data('story');

    this.$video = $('.story .main-video');

    this.$videoWrapper = $('.story .video');

    this.videoTimeElapsed = 0;

    this.progressBar = $('.progress-track .progress');

    this.curWipeSlide = 0;

    this.$wipeCarousel = $('.wipe-carousel');

    this.$wipeCarouselImages = [];

    this.$wipeCarouselHeadlines = [];

    this.curHeadline = 0;

    this.introCinemagraphImagesToLoad = $('#back-layer .image-preload-sequence').size();
    this.introCinemagraphImagesLoaded = 0;

    this.contentCinemagraphImagesToLoad = $('#main .image-preload-sequence').size();
    this.contentCinemagraphImagesLoaded = 0;

    this.loadCinemagraphs();

    $('.wipe-carousel .slide').each(function() {
      _this.$wipeCarouselImages.push($(this));
    });

    $('.wipe-carousel .headline-wrapper').each(function() {
      _this.$wipeCarouselHeadlines.push($(this));
    });

    if(App.pagination) {
      App.pagination.destroy();
      App.pagination = null;
    }
    App.pagination = new Pagination($('#content'), $('#main'), this);
    App.pagination.init();

    if(App.introCinemagraph) {
      App.introCinemagraph.destroy();
      App.introCinemagraph = null;
    }

    if(App.contentCinemagraph) {
      App.contentCinemagraph.destroy();
      App.contentCinemagraph = null;
    }


    $('.carousel').each(function() {
      _this.carousel = new Carousel($(this).find('ul'));
      _this.carousel.init();
    });


    $('.slider').each(function() {
      if($('body').hasClass('neesha')) {
        _this.slider = new DragSliderController({$el: $(this), mode: 'carousel'});
        _this.slider.init();
      } else {
        _this.slider = new DragSliderController({$el: $(this), mode: 'animation'});
        _this.slider.init();
      }
    });

    this.addListeners();
  };

  Story.prototype.loadCinemagraphs = function() {
    var _this = this;

    if(this.introCinemagraphImagesToLoad > 0) {
        $('#back-layer .image-preload-sequence').each(function(i) {
            $(this).attr('src', $(this).data('src')).load(function() {
                _this.introCinemagraphImagesLoaded++;
                $('#back-layer').find('#' + $(this).data('id')).css('background-image', 'url(' + $(this).data('src') + ')');

                if(_this.introCinemagraphImagesLoaded == _this.introCinemagraphImagesToLoad) {
                   _this.initIntroCinemagraph();
                }

            });
        });
    }

    if(this.contentCinemagraphImagesToLoad > 0) {
        $('#main .image-preload-sequence').each(function(i) {
            $(this).attr('src', $(this).data('src')).load(function() {
                _this.contentCinemagraphImagesLoaded++;
                $('#main').find('#' + $(this).data('id')).css('background-image', 'url(' + $(this).data('src') + ')');

                if(_this.contentCinemagraphImagesLoaded == _this.contentCinemagraphImagesToLoad) {
                   _this.initContentCinemagraph();
                }
            });
        });
    }
  };

  Story.prototype.initIntroCinemagraph = function() {
    App.introCinemagraph = new ImageSequence($('#back-layer .image-sequence'), $('#back-layer .sequence').data('path'), $('#back-layer .sequence').data('name'), $('#back-layer .sequence').children().length, 60);
    App.introCinemagraph.init();
    $('#back-layer .image-sequence').on('JSONLoaded', function() {
      App.introCinemagraph.play();
    });
  };

  Story.prototype.initContentCinemagraph = function() {
     if($('#main .cinemagraph').size() > 0) {
      App.contentCinemagraph = new ImageSequence($('#main .image-sequence'), $('#main .sequence').data('path'), $('#main .sequence').data('name'), $('#main .sequence').children().length, 100);
      App.contentCinemagraph.init();
    }
  };

  Story.prototype.addListeners = function() {
    var _this = this;

    $('.story .btn-play').on('touchstart', function(e) {
      _this.playVideo();
    });

    $('.btn-fb, .btn-twitter').on('touchstart', function(e) {
      e.preventDefault();
      var category    = $.trim( $( this ).attr( 'data-tracking' ).split( ',')[0] );
      var action      = $.trim( $( this ).attr( 'data-tracking' ).split( ',')[1] ) || 'click';
      var opt_label   = $.trim( $( this ).attr( 'data-tracking' ).split( ',')[2] );
      window.open($(this).data('href'));

      App.analytics.trackEvent(category, action, opt_label);
    });

    this.$video.on('timeupdate', function() {
      var currentTime = parseInt($(this)[0].currentTime);

      if(currentTime % 5 == 0) {
        if(_this.videoTimeElapsed !== currentTime) {
          _this.videoTimeElapsed = currentTime;
          App.analytics.trackEvent('story-video', 'video-watch', $(this).data('story') + '-watch-' + currentTime + '-seconds');
        } 
      }
    });

    this.$video.on('webkitendfullscreen', function() {
      _this.closeVideo();
    });

    this.$video.on('ended', function() {
      _this.closeVideo();
      App.analytics.trackEvent('story-video', 'video-watch', $(this).data('story') + '-ended');
    });

    this.$videoWrapper.find('.overlay').on('touchstart', function() {
      _this.closeVideo();
    });
  };

  Story.prototype.playVideo = function() {
    this.$videoWrapper.addClass('active');
    this.$video[0].play();
  };

  Story.prototype.closeVideo = function() {
    this.$video[0].pause();
    this.$videoWrapper.removeClass('active');
  };

  Story.prototype.handleScrollStart = function() {
    if(this.$videoWrapper.hasClass('active')) {
      this.closeVideo();
    }

    if(App.introCinemagraph) {
      if(App.pagination.curPage == 0 || App.pagination.curPage == 1) {
          App.introCinemagraph.play();
      } else {
          App.introCinemagraph.destroy();
      }

    }


    if(App.contentCinemagraph) {
      if(App.pagination.curPage == 3) {
        if(App.contentCinemagraph.JSONLoaded == true) {
          App.contentCinemagraph.play();
        } else {
          $('#main .image-sequence').on('JSONLoaded', function() {
            App.contentCinemagraph.play();
          });
        }
      } else {
        App.contentCinemagraph.destroy();
      }
    }
  };

  Story.prototype.handleScrollComplete = function() {
      
  };

  Story.prototype.handleScrollUpdate = function() {

    var tweenProgress = App.pagination.pageTweener.progress() * (2 - App.pagination.pageTweener.progress());
   
    if(App.pagination.direction == 'down') {
      switch(App.pagination.curPage) {
        case 2:
           this.moveArrow(tweenProgress);
        break;

        case 4:
          this.wipeSlides(0, 1-tweenProgress);
          this.transitionHeadlines(1);
        break;

        case 5:
          this.wipeSlides(1, 1-tweenProgress);
          this.transitionHeadlines(2);
        
        break;

        case 6:
          this.wipeSlides(2, 1-tweenProgress);
          this.transitionHeadlines(3);
        break;

        case 7:
          if(this.currentStory == 'lian') {
            this.wipeSlides(3, 1-tweenProgress);
            this.transitionHeadlines(4);
          }
        break;
  

        default:
        
        break;
      }
    } else if(App.pagination.direction == 'up') {
      switch(App.pagination.curPage) {
        case 1:
          this.moveArrow(1 - tweenProgress);
        break;

        case 6:
          if(this.currentStory == 'lian') {
            this.wipeSlides(3, tweenProgress);
            this.transitionHeadlines(3);
          }
        break;

        case 5:
          this.wipeSlides(2, tweenProgress);
          this.transitionHeadlines(2);
        break;

        case 4:
          this.wipeSlides(1, tweenProgress);
          this.transitionHeadlines(1);
        break;

        case 3:
          this.wipeSlides(0, tweenProgress);
          this.transitionHeadlines(0);
        break;

        default:
        
        break;
      }
    }
    this.updateProgressBar();
  };


  Story.prototype.wipeSlides = function(i, tweenProgress) {
    if(this.$wipeCarousel.size() == 0) {
        return;
    }
     var $image = this.$wipeCarouselImages[i];

     TweenMax.set($image, {
        'height': 100 * tweenProgress + '%'
      });

  };

  Story.prototype.transitionHeadlines = function(i) {
    if(this.$wipeCarousel.size() == 0) {
        return;
    }
     $.each(this.$wipeCarouselHeadlines, function() {
        $(this).removeClass('active');
     });
    this.$wipeCarouselHeadlines[i].addClass('active');
  };

   Story.prototype.moveArrow = function(segPercent) {
    TweenMax.set( $('.down-arrow'), { 'bottom': 100 * segPercent + '%' }); 
  };

  Story.prototype.wipeSections = function(segPercent) {
     TweenMax.set($('.wipe'), {
        'y': 50 * segPercent + '%'
      });
      TweenMax.set($('.wipe-layer-1'), {
        'height': 50 * (1 - segPercent) + '%'
      });

      TweenMax.set($('.wipe-layer-1 .image'), {
        'y': -15 * (segPercent) + '%'
      });
  };

  Story.prototype.updateProgressBar = function() {
    var totalProgress = App.pagination.curProgress / App.pagination.maxOffset;
    var progressWidth = totalProgress * 100 + '%';
    TweenMax.set(this.progressBar, { 'width': progressWidth });
  };



  return Story;

});
