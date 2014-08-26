'use strict';

var DK = DK || {};

var ModalCollection = Backbone.Collection.extend({
  url: $('#social_content').data('social-json'),
  parse: function(response) {
    response = response.posts;
    return response;
  },
  load: function() {
    this.fetch({
      add: true,
      success: function(response) {
      
      },
      error: this.errorHandler
    }, this);
  },
  errorHandler: function() {
    debug.log('there was an error fetching the collection');
  }
});

