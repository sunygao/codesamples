define(['jquery'
], function ($) {
	'use strict';

	var Nav = function() {
		console.log('nav initialized');

		this.setupBinds();
	};

	Nav.prototype.setupBinds = function() {
		var _this = this;

		$('#menu-cta').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('close');
			_this.toggleMenu();
		});
		
	};

	Nav.prototype.toggleMenu = function() {
		$('#menu').toggleClass('active');
	};

	return Nav;

});
