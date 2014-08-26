
var DK  = DK || {};
DK.app = function () {
	// =================================================
	// = Private variables (example: var _foo = bar; ) =
	// =================================================
	var _queue = [];
	
	// =================================================
	// = public functions                              =
	// =================================================
	var self = {
		
		init: function () {

			self.setupBinds();

			self.registerHandlebarsHelpers();

	 		if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && screen.width < 600) {
	      DK.isMobile = true;
	      $('body').addClass('mobile');

	      //init mobile view
	     	self.run('mobileView', MobileView);
	    }

	    if(/iPad|Android/i.test(navigator.userAgent) && screen.width > 600) {
	    	$('body').addClass('tablet');
	      DK.isTablet = true;
	    }

	    if(Modernizr.video) {
			  DK.videoSupport = true;
			}


	    for (var i = 0; i < _queue.length; i++) {
	    	try {
	    		DK[_queue[i][0]] = new _queue[i][1]();
	    	} catch(e) {

	    	}
      }			

		},
		setupBinds: function() { //Global binds for nav, footer
			$('#site_nav a').on('click', function(e) {
				e.preventDefault();
				self.goToSection($(this));
				if($('#site_nav').hasClass('active')) {
					$('#site_nav').removeClass('active');
				}

				//analytics
				var label;
				switch($(this).attr('href')) {
					case '#social':
				    label = 'join_the_convo';
				    break;
					case '#taylor':
						label = 'taylor_swift_heart_diet_coke';
					  break;
					case '#varieties':
						label = 'varieties';
					  break;
					case '#rewards':
						label = 'my_coke_rewards';
					  break;
					default:
						label = $(this).attr('href').split('#')[1];
						break;
				}
				DK.analyticsView.trigger('clickEvent', {category: 'navigation', action: 'click', label: label});
			});

			$('#social_btns a').on('click', function() {
				DK.analyticsView.trigger('clickEvent', {category: 'navigation', action: 'external_click', label: $(this).text().toLowerCase()});
			});

			$('footer a').on('click', function() {
				var label;
				switch($(this).text()) {
					case 'The Coca-Cola Company':
				    label = 'coca_cola_company';
				    break;
					case 'Contact':
						label = 'contact_us';
					  break;
					case 'Privacy':
						label = 'privacy_policy';
					  break;
					case 'Terms & Conditions':
						label = 'terms_and_conditions';
					  break;
					default:
						label = $(this).text();
					  break;
				}
				DK.analyticsView.trigger('clickEvent', {category: 'navigation', action: 'external_click', label: label});
			});

			$('#hero_content a').on('click', function(e) {
				e.preventDefault();
        if($(this).attr('href')) {
        	if(/^[#]/.test($(this).attr('href'))) {
						//this is linking to an anchor
						self.goToSection($(this));
					} else {
						window.open($(this).attr('href'));
					}
				}
			});

			$('#show_nav').on('click', function(e) {
				e.preventDefault();
				$('#site_nav').toggleClass('active');
			});

			$('#varieties a').on('click', function(e) {
				DK.analyticsView.trigger('clickEvent', {category: 'varieties', action: 'external_click', label: $(this).attr('href')});
			});

			$('#rewards a').on('click', function(e) {
				DK.analyticsView.trigger('clickEvent', {category: 'my_coke_rewards', action: 'external_click', label: $(this).attr('href')});
			});
		},
		registerHandlebarsHelpers: function() {
			Handlebars.registerHelper('charCount', function(text, hashtags) {
				var string = text;
    		for (var i = 0; i < hashtags.length; i++) { 
					string = string + ' #' + hashtags[i];
				}
				if(string.length <= 47) {
					return 'small';
				} else if (string.length > 47 && string.length <= 94) {
					return 'medium';
				} else if (string.length > 94) {
					return 'large';
				}
      });

      Handlebars.registerHelper('assetPath', function() {
				return $('#social_content').data('asset-path');
      });

      Handlebars.registerHelper('cleanTag', function(text) {
				return text.split('#')[1];
      });
		},
		run: function(name, func) {
			_queue.push([name, func]);
		},
		goToSection: function($anchor) {
			$(window).off('scroll', DK.analyticsView.trackScroll);

			try {
				$.scrollTo($($anchor.attr('href')).offset().top  - $('header').outerHeight(), 500, {'axis':'y', onAfter: function() { 
						DK.analyticsView.tracked[$anchor.attr('href').split('#')[1]] = true;
						window.setTimeout(function() {
							DK.analyticsView.bindScrollEvent();
						}, 500);
					}
				});
			} catch(e) {

			}
			
		},
		rebindScroll: function() {
			//debug.log();
		}
	};
	
	return self;
	}();

/*
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */

window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})();

$(document).ready(function () {
	DK.app.init();
});

