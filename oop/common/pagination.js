define(['jquery',
    'tweenMax',
    'app',
    'mobile/common/touch-controller'
], function ($, TweenMax, App, TouchController) {
  'use strict';

  var Pagination = function(el, scrollEl, scope) {

    console.log('Pagination initialized');
    
    var _this = this;

    this.$el = el;

    this.$scrollEl = scrollEl;

    this.scope = scope;

    this.pageSelector = '.page';

    this.numPages = this.$el.find(this.pageSelector).size();

    this.isMoving = false;

    this.curPage = 0;

    this.direction;

    this.sectionHeight = $($(this.pageSelector)[0]).height();

    this.maxOffset = this.sectionHeight * (this.numPages - 1);

    this.curOffset = 0;

    this.curProgress = 0;

    this.pageTweener;

    this.$pages = [];

    this.performScroll = true;

    this.animSpeed = .5;

    this.ease = 'easeOutQuad';

    $.each($(_this.pageSelector), function(i) {
      _this.$pages.push($(this));
    });

  };

  Pagination.prototype.init = function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 200);

    
    this.touch = new TouchController(this.$el, 10, this);
    this.touch.init();

    this.addListeners();
    
 
  };

  Pagination.prototype.destroy = function() {
    var _this = this;

    if(this.pageTimeout) {
      clearTimeout(_this.pageTimeout);
    }

    this.$el = null;

    this.$scrollEl = null,

    this.scope = null;

    this.pageSelector = null;

    this.numPages = null;

    this.isMoving = null;

    this.curPage = null;

    this.direction = null;

    this.sectionHeight = null;

    this.maxOffset = null;

    this.curOffset = null;

    this.curProgress = null;

    this.pageTweener = null;

    this.$pages = [];

    this.performScroll = null;

    this.animSpeed = null;

    this.ease = null;

    this.touch = null;

  };

   Pagination.prototype.handleOnStart = function() {
     if(this.scope.handleScrollStart) {
      this.scope.handleScrollStart();
    }
  };

  Pagination.prototype.handleOnComplete = function() {

    var _this = this;
    if(this.scope.handleScrollComplete) {
      this.scope.handleScrollComplete();
    }
    this.pageTimeout = setTimeout(function() {
      _this.isMoving = false;
      _this.touch.handleScrollComplete();
    }, 400);
   
    this.$pages[this.curPage].addClass('active');
    if(this.$pages[this.prevPage]) {
      this.$pages[this.prevPage].removeClass('active');
    }

    
  };

  Pagination.prototype.handleOnUpdate = function() {
    if(this.performScroll == true) {
      TweenMax.set(this.$scrollEl, {
        'y': -this.curOffset
      });
    }

    if(this.scope.handleScrollUpdate) {
      this.scope.handleScrollUpdate();
    }

  };


  Pagination.prototype.handleVerticalTouch = function(dir) {  

    if(this.isMoving == true || App.utils.getDeviceOrientation() == 'landscape') {
      return;
    }

    this.direction = dir;    

    this.setPage();


    if(this.curPage !== this.prevPage) {
      this.isMoving = true;
      this.performMovement();
    }
    
  };
  Pagination.prototype.setPage = function() {
    this.prevPage = this.curPage;

    if(this.direction == 'down') {
      this.curPage++;
      this.curPage = Math.min(this.curPage, this.numPages - 1);
    } else if(this.direction == 'up') {
      this.curPage--;
      this.curPage = Math.max(this.curPage, 0);
    }
  };
  Pagination.prototype.performMovement = function(speed) {

    if (this.curPage == this.prevPage) {
      return;
    }
    
    var pos = this.sectionHeight * (this.$pages[this.curPage].data('page-scroll'));
    
    var progress = this.sectionHeight * (this.curPage);

    if(speed) {
       var speed = speed;
    } else {
      var speed = this.animSpeed;
    }

    this.pageTweener = TweenMax.to(this, speed, {
      curOffset: pos,
      curProgress: progress,
      ease: this.ease,
      'onStart': function(){
        this.handleOnStart();
      },
      'onStartScope': this,
      'onUpdate': function(){
        this.handleOnUpdate();
      },
      'onUpdateScope': this,
      'onComplete': function() {
        this.$scrollEl.trigger('scrollComplete');
        this.handleOnComplete();
      },
      'onCompleteScope': this    
    });
  };

  Pagination.prototype.addListeners = function() {
    var _this = this;

    $('.down-arrow a').on('touchstart', function(e) {
      e.preventDefault();

      _this.movePageDown();
    });
  };

  Pagination.prototype.cancelScroll = function() {
    this.performScroll = false;
  };
  Pagination.prototype.restartScroll = function() {
    this.performScroll = true;
  };

  Pagination.prototype.movePageDown = function() {
    this.direction = 'down';
    this.setPage();

    this.performMovement();
  };

  Pagination.prototype.goToPage = function(index, speed) {
    this.direction = 'down';
    this.curPage = index;
    this.performMovement(speed);
  };


  return Pagination;

});
