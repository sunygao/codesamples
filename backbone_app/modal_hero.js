'use strict';

var DK = DK || {};

var ModalHeroView = Backbone.View.extend({
  $modal: null,
  template: null,
  videoPlayer: null,  
  open: function(e) {
    DK.heroView.trigger('heroModalOpen');
    $('body').addClass('disable_scroll');
    if(!this.$modal) {
      this.createModal(e);
    } else {
      var _this = this;
      this.$modal.fadeIn(300, function() {
        if(_this.videoPlayer && !DK.isMobile && !DK.isTablet) {
          try {
            _this.videoPlayer.playVideo();
          } catch(e) {
            debug.log('err thrown ' + e);
          } 
        }
      });

    }
  },
  createModal: function(e) {
    var vidId = $(e.currentTarget).data('video-id');
    this.template = Handlebars.compile($('#hero-modal-template').html());
    $('body').append(this.template({id: vidId}));   
    this.$modal = $('#hero_modal_' + vidId);
    this.$modal.fadeIn(300);
    this.addListeners();
    var video = new Player();
    this.videoPlayer = video.loadPlayer(this.$modal.find('.iframe_wrapper').get(0), vidId, this);
  },
  onPlayerReady: function(e) {
    if(!DK.isMobile && !DK.isTablet) {
      this.videoPlayer.playVideo();
      var vidId = e.target.getVideoUrl().match(/[?&]v=([^&]+)/)[1];
      DK.analyticsView.trigger('clickEvent', {category: 'video', action: 'video_start', label: vidId});
    }
  },
 onStateChange: function(e) {
  var vidId = e.target.getVideoUrl().match(/[?&]v=([^&]+)/)[1];
  if(e.data == 0) { //ended
    DK.analyticsView.trigger('clickEvent', {category: 'video', action: 'video_complete', label: vidId });
  }
 },
  addListeners: function() {
    var _this = this;
    this.$modal.find('.btn_close, .overlay').on('click', function(e) {
      e.preventDefault();
      _this.close();
    });
  },
  close: function() {
    DK.heroView.trigger('heroModalClose');
    $('body').removeClass('disable_scroll');
    this.$modal.remove();
    this.$modal = null;
  }
});