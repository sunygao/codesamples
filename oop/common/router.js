define(['jquery',
		'app',
		'mobile/views/home',
        'mobile/views/story'
], function ($, App, Home, Story) {
	'use strict';

	var Router = function(e) {
		console.log('Router initialized');

		this.addListeners();

        this.onHashChange();
        
	};

	Router.prototype.addListeners = function() {
		var _this = this;
		$(window).on('hashchange', function() {
			_this.onHashChange();
		});
	};

	Router.prototype.onHashChange = function() {
        
        var hash = window.location.hash;
        if(hash) {
            if (window.location.hash.indexOf('/story') == 1) { 
                hash = window.location.hash.replace('#', '');
             } else {
                hash = '/';
             }
        }

        // Check if device is set, if so, add to the URL
        var device = App.utils.getUrlParameter('device');
        device = (device ? '?device=' + device : '' );

        // Run the request for the page, if there's a response, lets
        // populate the site - otherwise throw an error.
        $.ajax(hash + device, {
            // On success, add the body class (if needed), and replace
            success: function( response ) {
                $('body').attr('class', response.body_class);
              
                $('#content').html(response.content);
               
                if($('body').hasClass('home')) {
                	App.home = new Home();
                }
                if($('body').hasClass('story')) {
                	App.story = new Story();
                }
            },
            error: function(var1, var2, var3) {
               
            }
        });
	};


	return Router;

});



            