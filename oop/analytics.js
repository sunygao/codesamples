define([
		'jquery'
], function ($) {
	'use strict';
	
	var AnalyticsView = function() {
		this.init();
		this.videoStarted = false;
	};

	AnalyticsView.prototype.init = function() {
		this.trackGAPageView('/moto360');

		this.setupBinds();
	};

	AnalyticsView.prototype.setupBinds = function() {
		var _this = this;

		$(document.body).on('click', '.click_track', function() {
			var category = $(this).data('tracking-category'),
					action = $(this).data('tracking-action'),
					label =  $(this).data('tracking-label');

			_this.trackGAEvent(category, action, label);
		});
	};

	AnalyticsView.prototype.trackGAPageView = function(page) {
		_gaq.push(['_trackPageview', page]);
	 };
			
	AnalyticsView.prototype.trackGAEvent = function(category, action, label) {
		_gaq.push(['_trackEvent', category, action, label]);
	};

	AnalyticsView.prototype.trackVideoEvents = function(e) {
		if(e.data == 0) {
			this.trackGAEvent('film', 'video_ended');
		} else if(e.data == 1 && this.videoStarted == false) {
			this.trackGAEvent('film', 'video_started');
			this.videoStarted = true;
		}
	};
	return AnalyticsView;
	
});