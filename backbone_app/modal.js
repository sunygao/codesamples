'use strict';
var DK = DK || {};

var ModalView = Backbone.View.extend({
  template: { },
  videos: { },
  carousel: null,
  el: '#social_modal',
  carouselOptions: { 
    speed: 300,
    mode: 'fade',
    pager: false,
    slideWidth: 'auto',
    prevText: '',
    nextText: '',
    adaptiveHeight: false,
    adaptiveHeightSpeed: 200
  },

  load: function() {
    this.createModal();
  },
  open: function(e) {
    this.$el.fadeIn(300);
    $('body').addClass('disable_scroll');
    if(!this.carousel) { //carousel not initialized
      this.carousel = new CarouselView({el: '#social_modal .modal_carousel' });
     
      this.addListeners();
      this.loadVideos($($(e.currentTarget).attr('href'))); //load the video on the current slide, if there is one
      
      var _this = this; //cache this

      this.carouselOptions.onSlideAfter = function($destination, prev, next) { 
        _this.pauseVideo(prev); //if the previous slide is a video, pause the video
        _this.loadVideos($destination); //if the next slide is a video, load the video
      }

      this.carouselOptions.onSliderLoad = function(currentIndex) {
        _this.addTrackingListeners(currentIndex);
      }

      if(!DK.isMobile && !DK.isTablet) { //if it's not mobile or tablet, initalize the carousel
        this.carousel.initCarousel(this.carouselOptions, $(e.currentTarget).attr('href'), this.carousel);
      } else { //else just show the target slide
        $($(e.currentTarget).attr('href')).show();
      }
      
    } else { //carousel has been initialized
      if(!DK.isMobile && !DK.isTablet) {
        this.carousel.reloadSlider($(e.currentTarget).attr('href'));
      } else {
        $($(e.currentTarget).attr('href')).show();
      }
      this.loadVideos($($(e.currentTarget).attr('href')));
    }
    
  },
  loadVideos: function($item) {
    var vidId = $item.data('video-id');
    if(vidId && !this.videos[$item.data('video-id')]) {
      var video = new Player();
      this.videos[$item.data('video-id')] = video.loadPlayer($item.find('.iframe_wrapper').get(0), vidId, this);
    }
  },
  pauseVideo: function(slide) {
    var $slide = this.getSlide(slide);
    if($slide.data('video-id') && this.videos[$slide.data('video-id')]) {
      try {
        this.videos[$slide.data('video-id')].pauseVideo();
      } catch(e) {
        
      }
    }
  },
  onPlayerReady: function(e) {
    if(!DK.isMobile && !DK.isTablet) {
      var $currentSlide = this.getSlide(this.carousel.slider.getCurrentSlide());
      if($currentSlide.data('video-id')) {
        this.videos[$currentSlide.data('video-id')].playVideo();
        DK.analyticsView.trigger('clickEvent', {category: 'video', action: 'video_start', label: $currentSlide.data('video-id') });
      }
    }
  },
  onStateChange: function(e) {
    var vidId = e.target.getVideoUrl().match(/[?&]v=([^&]+)/)[1];
    if(e.data == 0) { //ended
      DK.analyticsView.trigger('clickEvent', {category: 'video', action: 'video_complete', label: vidId });
    }
  },
  getSlide: function(index) {
    return $(this.$el.find('.modal_carousel li').get(index));
  },
  addListeners: function() {
    var _this = this;
    this.$el.find('.btn_close, .overlay').on('click', function(e) {
      e.preventDefault();
      _this.close(e);
    });
    this.$el.find('.text_wrapper .cta').on('click', function(e) {
      DK.analyticsView.trigger('clickEvent', {category: 'join_the_convo', action: 'external_click', label: $(this).find('em').text().toLowerCase()});
    });
    this.$el.find('.image_wrapper a, .text_wrapper p a').on('click', function(e) {
      //join_the_convo > external_click > hashtag > etc.
      var url = $(this).attr('href');
      DK.analyticsView.trigger('clickEvent', {category: 'join_the_convo', action: 'external_click', label: 'hashtag', value: url });
    });
    this.$el.find('.title_card a').on('click', function(e) {
      //join_the_convo > external_click > hashtag > etc.
      DK.analyticsView.trigger('clickEvent', {category: 'join_the_convo', action: 'external_click', label: 'twitter' });
    });
  },
  addTrackingListeners: function() {
    var _this = this;
    this.$el.find('.bx-controls a').on('click', function() {
      var $destination = _this.getSlide(_this.carousel.slider.getCurrentSlide());
      var label = $destination.data('alttext') ? $destination.data('alttext') : $destination.data('video-id');
      DK.analyticsView.trigger('clickEvent', {category: 'join_the_convo', action: 'nav_arrow_click', label: label});
    });
  },
  close: function() {
    this.$el.find('.video_wrapper').each(function() {
      $(this).html('<div class="iframe_wrapper"></div>');
    });
    this.videos = {};
    this.$el.find('li').hide();
    this.$el.fadeOut(300);
    $('body').removeClass('disable_scroll');
  },
  createModal: function() {
    this.collection = new ModalCollection();
    this.collection.load();
    this.collection.on('add', this.addOne, this);
  },
  addOne: function(item) {
    var type = item.get('type');
    switch (type) {
      case 'facebook':
        this.template = Handlebars.compile($('#facebook-template').html());
        this.render(item);
        break;
      case 'twitter':
        this.template = Handlebars.compile($('#twitter-template').html());
        this.render(item);
        break;
      case 'twitter text':
        this.template = Handlebars.compile($('#text-twitter-template').html());
        this.render(item);
        break;
      case 'facebook text':
        this.template = Handlebars.compile($('#text-facebook-template').html());
        this.render(item);
        break;
      case 'youtube':
        this.template = Handlebars.compile($('#youtube-template').html());
        this.render(item);
        break;
      default:
        break;
    }
  },
  render: function(item) {
    var $container = this.$el.find('.modal_carousel');
    $container.append(this.template(item.toJSON()));   
  }
});





