'use strict';
var DK = DK || {};

var HeroView = Backbone.View.extend({
  el: '.section_hero',
  carousel: null,
  carouselInitialized: false,
  modals: {},
  autoPlayCarousel: true,
  events: {
    'click #hero_content a': 'handleClick',
    'click .hero_pager a': 'trackPagerClick'
  },
  carouselOptions: { 
    speed: 800,
    mode: 'fade',
    auto: true,
    controls: false,
    pagerSelector: $('.hero_pager'),
    autoHover: true,
    pause: 5800
  },
  initialize: function() {
    debug.log('Hero View initialized');

    var _this = this; //cache this
  
    //if the first slide is video, play the video
    if(DK.videoSupport) {

      this.carouselOptions.onSliderLoad = function(currentIndex) {
       if($($('#hero_content').children().get(currentIndex)).find('video').size() > 0) {
        _this.playVideo(currentIndex);
       }
      }
      this.carouselOptions.onSlideBefore = function($destination, prev, next) { 
        if($($('#hero_content').children().get(prev)).find('video').size() > 0) {
         // the old slide is video
         _this.pauseVideo(prev);
        }
        if($($('#hero_content').children().get(next)).find('video').size() > 0) {
          _this.playVideo(next);
        }
      }
    }

    this.buildHeroContent();


    this.on('heroModalOpen', function() {
      this.autoPlayCarousel = false;
      this.carousel.stopAuto();
    });

    this.on('heroModalClose', function() {
      this.autoPlayCarousel = true;
      this.carousel.startAuto();
    });
  },
  buildHeroContent: function() {
    var _this = this;
    _this.carousel = new CarouselView({ el: '#hero_content' });  //load the carousel with the default images
    $('#hero_content').children().each(function() {
      var $this = $(this).find('a');
      var previewImage = $this.data('preview-image');
      var previewVideoMp4 = $this.data('preview-video-mp4');
      var previewVideoOgv = $this.data('preview-video-ogv');
      var previewImageMobile = $this.data('preview-image-mobile');
      var previewImageAltText = $this.data('image-alttext') || '';

      //load hero images based on device
      if(DK.isMobile) { //mobile devices only
        $this.append('<img class="full_screen" src="' + previewImageMobile + '" alt="' + previewImageAltText + '"/>');
        //_this.carousel.reloadSlider();
      } else if(DK.isTablet || !DK.videoSupport) { //ipad or no video support
        $this.append('<img class="full_screen" src="' + previewImage + '" alt="' + previewImageAltText + '"/>');
       // _this.carousel.reloadSlider();
      } else { //everything else
        $this.append('<img class="full_screen" src="' + previewImage + '" alt="' + previewImageAltText + '"/>');
        if(previewVideoMp4 && previewVideoOgv) {
          $this.find('img').remove();
          var html = '<video preload muted loop>';
              html += '<source src="' + previewVideoMp4 + '" type="video/mp4">';
              html += '<source src="' + previewVideoOgv + '" type="video/ogg">';
              html += '<img src="' + previewImage + '" alt="' + previewImageAltText + '"/>';
              html += '</video>';
          $this.append(html);
          $this.find('video').get(0).addEventListener("loadedmetadata", function() {
            $this.find('video').get(0).volume = 0;
             _this.initializeCarousel(); 
          }, false);
        }
      }
    });

    var posts = $('#hero_content li');
    imagesLoaded(posts, function() {
      _this.initializeCarousel();
    });
  },
  initializeCarousel: function() {
    if(this.carouselInitialized == false) {
      this.carousel.initCarousel(this.carouselOptions);
      this.carouselInitialized = true;
    } else {
      this.carousel.reloadSlider(); //reload to prevent sizing issues
    }
  },
  playVideo: function(index) {
    if(DK.videoSupport) {
      var video = $($('#hero_content li')[index]).find('video').get(0);
      if(video.readyState == 0) { //not loaded
        $($('#hero_content li')[index]).find('video').get(0).addEventListener("canplay", function() {
          video.play();
        }, false);
      } else {
        video.currentTime = 0;
        video.play();
      }  
    }
   
  },
  pauseVideo: function(index) {
    $($('#hero_content li')[index]).find('video').get(0).pause();
  },
  handleClick: function(e) {
    if($(e.currentTarget).hasClass('open_video')) {
      this.launchModal(e);
    } 
    var label = $(e.currentTarget).data('video-id') ? $(e.currentTarget).data('video-id') : $(e.currentTarget).data('image-alttext');
    var index =  $(e.currentTarget).parent().index() + 1;
    DK.analyticsView.trigger('clickEvent', {category: 'carousel', action: 'carousel_panel' + index + '_click', label: label});
  },
  trackPagerClick: function(e) {
    var $targetElement =  $($('#hero_content li')[$(e.currentTarget).data('slide-index')]).find('a');
    var label = $targetElement.data('video-id') ? $targetElement.data('video-id') : $targetElement.data('image-alttext');
    DK.analyticsView.trigger('clickEvent', {category: 'carousel', action: 'carousel_nav_btn' + $(e.currentTarget).text() + '_click', label:label });
  },
  launchModal: function(e) {
    e.preventDefault();
    if(this.carousel) {
      this.carousel.stopAuto();
    }
    var vidId = $(e.currentTarget).data('video-id');
    if(!this.modals[vidId]) {
      this.modals[vidId] = new ModalHeroView();
    }
    this.modals[vidId].open(e); 
  }
  
});


DK.app.run('heroView', HeroView);

