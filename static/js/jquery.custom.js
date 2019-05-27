/*------------------------------------------------------------------
jQuery document ready
-------------------------------------------------------------------*/
$(document).ready(function () {
	"use strict";
	if (jQuery.isFunction(jQuery.fn.paroller) && screen.width > 800 ) {
		$("[data-paroller-factor]").paroller();
	}
	// Pricing switcher button
	$(".switcher__button").on('click', function(e) { 
	    $(".switcher__button").toggleClass('switcher__button--enabled');
		$(".pricing__value").removeClass('pricing__value--hidden');
		$(".pricing__value").toggleClass('pricing__value--show pricing__value--hide');	
	});
	
	// Modal login and signup
	$('.modal-toggle').on('click', function(e) {
	  e.preventDefault();
	  var modalopen = $(this).data("openpopup");
	  $('.modal--'+modalopen).toggleClass('modal--visible');
	  var modaltype = $(this).data("popup");
	  $('.modal__content--'+modaltype).toggleClass('modal__content--visible');
			$('.modal__switch').on('click', function(e) {
			  $('.modal__content').removeClass('modal__content--visible');
			  var modaltypeb = $(this).data("popup");
			  $('.modal__content--'+modaltypeb).toggleClass('modal__content--visible');
			});
	});

	$('.modal__overlay--toggle').on('click', function(e) {
	  e.preventDefault();
	  $('.modal').removeClass('modal--visible');
	  $('.modal__content').removeClass('modal__content--visible');
	});

	var $shareButtonsTop,
			$shareButtonsBottom;

	function defineElementSize() {
    if (jQuery('.section--article-content').length) {
        $shareButtonsTop = jQuery('.section--article-content').offset().top;
    } else {
        $shareButtonsTop = 0;
    }
    jQuery('.share-post').css('top', $shareButtonsTop);
    if (jQuery('.footer').length) {
        $shareButtonsBottom = jQuery('.footer').offset().top - 800;
    } else {
        $shareButtonsBottom = 0;
    }
  }

  defineElementSize();

	function showShareBox() {
    jQuery(window).scroll(function() {
      if (jQuery(this).scrollTop() > $shareButtonsTop) {
        jQuery('.share-post').addClass('stick');
      } else {
        jQuery('.share-post').removeClass('stick');
      }
      if (jQuery(this).scrollTop() > $shareButtonsTop + 200) {
        jQuery('.share-post').addClass('show');
      } else {
        jQuery('.share-post').removeClass('show');
      }
      if (jQuery(this).scrollTop() > $shareButtonsBottom) {
        jQuery('.share-post').addClass('invisible');
      } else {
        jQuery('.share-post').removeClass('invisible');
      }
    });
  }
  showShareBox();
  jQuery(window).bind('resize', function() {
     showShareBox();
     defineElementSize();
  });
	
});