'use strict';

var DK = DK || {};

var FeaturedView = Backbone.View.extend({

  initialize: function() {

    debug.log('Featured View initialized');

    this.embedImage();

    this.addListeners();

  },
  addListeners: function() {
    $('#taylor a').on('click', function() {
      DK.analyticsView.trigger('clickEvent', {category: 'ts_heart_dko', action: 'external_click', label: $(this).attr('href')});
    });
    
  },
  embedImage: function() {
    var $featuredItem = $('.section_featured');

    $featuredItem.each(function() {
      var previewImage = $(this).find('a').data('preview-image');
      var previewImageMobile = $(this).find('a').data('preview-image-mobile');
      var previewImageAltText = $(this).find('a').data('image-alttext');
      if(DK.isMobile) { //mobile devices only
        $(this).find('a').append('<img class="full_screen" src="' + previewImageMobile + '" alt="' + previewImageAltText + '"/>');
      }  else {
        $(this).find('a').append('<img class="full_screen" src="' + previewImage + '" alt="' + previewImageAltText + '"/>');
      }
    });
  
  }
    
});

DK.app.run('featuredView', FeaturedView);

