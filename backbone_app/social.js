'use strict';

var DK = DK || {};

var SocialView = Backbone.View.extend({
  el: '.section_social',
  modal: null,
  events: {
    'click #social_content a': 'triggerModal'
  },

  initialize: function() {

    debug.log('Social View initialized');

    this.modal = new ModalView();
    this.modal.load();

  },
  triggerModal: function(e) {
    e.preventDefault();
    this.modal.open(e);
    var label;
    if($(e.currentTarget).parent().hasClass('youtube')) {
      label = $(e.currentTarget).data('video-id');
    } else {
      label = $(e.currentTarget).find('img').attr('alt');
    }
    DK.analyticsView.trigger('clickEvent', {category: 'join_the_convo', action: 'module_click', label: label});
  }
    
});

DK.app.run('socialView', SocialView);

