'use strict';

var DK = DK || {};

var Player = Backbone.View.extend({
 
  APIloaded: false,

  initialize: function() {

    debug.log('Video player initialized');

    this.loadAPI();

  },

  loadAPI: function() {
    var _this = this;
    window.onYouTubeIframeAPIReady = function() {
      _this.APIloaded = true;
    };
    $.getScript('//www.youtube.com/iframe_api');
  },
  loadVideo: function(container, videoId, scope) {

    var _this = this;
    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
      window.onYouTubeIframeAPIReady = function() {
        _this.loadPlayer(container, videoId, scope);
      };
      $.getScript('//www.youtube.com/iframe_api');
    } else {
      _this.loadPlayer(container, videoId, scope);
    }
  },

  loadPlayer: function(container, videoId, scope) {
    var videoPlayer = new YT.Player(container, {
      videoId: videoId,
      width: 356,
      height: 200,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        showInfo: 0
      },
      events: {
        'onReady': function(e) { scope.onPlayerReady(e); },
        'onStateChange': function(e) { scope.onStateChange(e); }
      }
    });
    return videoPlayer;
  }
   
});

DK.app.run('player', Player);
