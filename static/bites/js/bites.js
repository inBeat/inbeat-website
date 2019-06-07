/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

/* 
ouibounce.js
Taken from https://github.com/carlsednaoui/ouibounce
Originally created by Carl Sednaoui from MailCharts. Maintained and improved by generous contributors.
Ouibounce: A small library enabling you to display a modal before a user leaves your website.
*/
function ouibounce(el, custom_config) {
  "use strict";

  var config     = custom_config || {},
    aggressive   = config.aggressive || false,
    sensitivity  = setDefault(config.sensitivity, 20),
    timer        = setDefault(config.timer, 1000),
    delay        = setDefault(config.delay, 0),
    callback     = config.callback || function() {},
    cookieExpire = setDefaultCookieExpire(config.cookieExpire) || '',
    cookieDomain = config.cookieDomain ? ';domain=' + config.cookieDomain : '',
    cookieName   = config.cookieName ? config.cookieName : 'viewedOuibounceModal',
    sitewide     = config.sitewide === true ? ';path=/' : '',
    _delayTimer  = null,
    _html        = document.documentElement;

  function setDefault(_property, _default) {
    return typeof _property === 'undefined' ? _default : _property;
  }

  function setDefaultCookieExpire(days) {
    // transform days to milliseconds
    var ms = days*24*60*60*1000;

    var date = new Date();
    date.setTime(date.getTime() + ms);

    return "; expires=" + date.toUTCString();
  }

  setTimeout(attachOuiBounce, timer);
  function attachOuiBounce() {
    if (isDisabled()) { return; }

    _html.addEventListener('mouseleave', handleMouseleave);
    _html.addEventListener('mouseenter', handleMouseenter);
    _html.addEventListener('keydown', handleKeydown);
  }

  function handleMouseleave(e) {
    if (e.clientY > sensitivity) { return; }

    _delayTimer = setTimeout(fire, delay);
  }

  function handleMouseenter() {
    if (_delayTimer) {
      clearTimeout(_delayTimer);
      _delayTimer = null;
    }
  }

  var disableKeydown = false;
  function handleKeydown(e) {
    if (disableKeydown) { return; }
    else if(!e.metaKey || e.keyCode !== 76) { return; }

    disableKeydown = true;
    _delayTimer = setTimeout(fire, delay);
  }

  function checkCookieValue(cookieName, value) {
    return parseCookies()[cookieName] === value;
  }

  function parseCookies() {
    // cookies are separated by '; '
    var cookies = document.cookie.split('; ');

    var ret = {};
    for (var i = cookies.length - 1; i >= 0; i--) {
      var el = cookies[i].split('=');
      ret[el[0]] = el[1];
    }
    return ret;
  }

  function isDisabled() {
    return checkCookieValue(cookieName, 'true') && !aggressive;
  }

  // You can use ouibounce without passing an element
  // https://github.com/carlsednaoui/ouibounce/issues/30
  function fire() {
    if (isDisabled()) { return; }

    if (el) { el.style.display = 'block'; }

    callback();
    disable();
  }

  function disable(custom_options) {
    var options = custom_options || {};

    // you can pass a specific cookie expiration when using the OuiBounce API
    // ex: _ouiBounce.disable({ cookieExpire: 5 });
    if (typeof options.cookieExpire !== 'undefined') {
      cookieExpire = setDefaultCookieExpire(options.cookieExpire);
    }

    // you can pass use sitewide cookies too
    // ex: _ouiBounce.disable({ cookieExpire: 5, sitewide: true });
    if (options.sitewide === true) {
      sitewide = ';path=/';
    }

    // you can pass a domain string when the cookie should be read subdomain-wise
    // ex: _ouiBounce.disable({ cookieDomain: '.example.com' });
    if (typeof options.cookieDomain !== 'undefined') {
      cookieDomain = ';domain=' + options.cookieDomain;
    }

    if (typeof options.cookieName !== 'undefined') {
      cookieName = options.cookieName;
    }

    document.cookie = cookieName + '=true' + cookieExpire + cookieDomain + sitewide;

    // remove listeners
    _html.removeEventListener('mouseleave', handleMouseleave);
    _html.removeEventListener('mouseenter', handleMouseenter);
    _html.removeEventListener('keydown', handleKeydown);
  }

  return {
    fire: fire,
    disable: disable,
    isDisabled: isDisabled
  };
}

/*exported ouibounce */




jQuery(function($) {
    
    $("form.form-signup").submit(function () {
      var clikedForm = $(this);
      var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      if (!email_regex.test(clikedForm.find(".email-address").val())) {
        $('.modal-dialog').attr('class', 'modal-dialog animated fast');  
        $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else if (clikedForm.find(".email-address").val() == '' && clikedForm.find(".input-password").val() == '') {
          $('.modal-dialog').attr('class', 'modal-dialog animated fast');
          $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else if (clikedForm.find(".email-address").val() == '' || clikedForm.find(".input-password").val() == '') {
          $('.modal-dialog').attr('class', 'modal-dialog animated fast');
          $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else {
          return true;
      }
    });

    $("form.form-subscribe-with-name").submit(function () {
      var clikedForm = $(this);
      var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      if (!email_regex.test(clikedForm.find(".email-address").val())) {
        $('.modal-dialog').attr('class', 'modal-dialog animated fast');  
        $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else if (clikedForm.find(".email-address").val() == '' && clikedForm.find(".input-name").val() == '') {
          $('.modal-dialog').attr('class', 'modal-dialog animated fast');
          $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else if (clikedForm.find(".email-address").val() == '' || clikedForm.find(".input-name").val() == '') {
          $('.modal-dialog').attr('class', 'modal-dialog animated fast');
          $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else {
          return true;
      }
    });

    $("form.form-subscribe").submit(function () {
      var clikedForm = $(this);
      var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      if (!email_regex.test(clikedForm.find(".email-address").val())) {
        $('.modal-dialog').attr('class', 'modal-dialog animated fast');  
        $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else {
          return true;
      }
    });


    $("form.form-callback").submit(function () {
      var clikedForm = $(this);
      if (clikedForm.find(".input-phone").val() == '') {
          $('.modal-dialog').attr('class', 'modal-dialog animated fast');
          $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else {
          return true;
      }
    });

    $("form.form-question").submit(function () {
      var clikedForm = $(this);
      var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      if (!email_regex.test(clikedForm.find(".email-address").val())) {
        $('.modal-dialog').attr('class', 'modal-dialog animated fast');
        $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else if (clikedForm.find(".email-address").val() == '' && clikedForm.find(".message").val() == '') {
          $('.modal-dialog').attr('class', 'modal-dialog animated fast');
          $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else if (clikedForm.find(".email-address").val() == '' || clikedForm.find(".message").val() == '') {
          $('.modal-dialog').attr('class', 'modal-dialog animated fast');
          $('.modal-dialog').addClass('headShake');
        var removeShake = setTimeout(function(){
            $('.modal-dialog').removeClass('headShake');
        }, 1000);
        return false;
      } else {
          return true;
      }
    });
    // show and hide password in input
    $(".password-icon-inner a").on('click', function(event) {
        event.preventDefault();
        if($('.input-password').attr("type") == "text"){
            $('.input-password').attr('type', 'password');
            $('.password-icon-inner i').addClass( "fa-eye-slash" );
            $('.password-icon-inner i').removeClass( "fa-eye" );
        } else if($('.input-password').attr("type") == "password"){
            $('.input-password').attr('type', 'text');
            $('.password-icon-inner i').removeClass( "fa-eye-slash" );
            $('.password-icon-inner i').addClass( "fa-eye" );
        }
    });
    
    // animation show/hide bites
    
    function modalAnim(x) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog ' + x + ' animated');
    }; 
    
    $('.modal').each(function(index){
        if ($(this).attr('bite-show') == 'fadeIn') {
            $(this).on('show.bs.modal', function (e) {
                  modalAnim('fadeIn');
            });
        }
        
        if ($(this).attr('bite-hide') == 'fadeOut') {
            $(this).on('hide.bs.modal', function (e) {
                  modalAnim('fadeOut');
            });
        }
        
        if ($(this).attr('bite-show') == 'zoomIn') {
            $(this).on('show.bs.modal', function (e) {
                  modalAnim('zoomIn');
            });
        }
        
        if ($(this).attr('bite-hide') == 'zoomOut') {
            $(this).on('hide.bs.modal', function (e) {
                  modalAnim('zoomOut');
            });
        }
        
        if ($(this).attr('bite-show') == 'bounceIn') {
            $(this).on('show.bs.modal', function (e) {
                  modalAnim('bounceIn');
            });
        }
        
        if ($(this).attr('bite-hide') == 'bounceOut') {
            $(this).on('hide.bs.modal', function (e) {
                  modalAnim('bounceOut');
            });
        }
        
        if ($(this).attr('bite-show') == 'slideInDown') {
            $(this).on('show.bs.modal', function (e) {
                  modalAnim('slideInDown');
            });
        }
        
        if ($(this).attr('bite-hide') == 'slideOutUp') {
            $(this).on('hide.bs.modal', function (e) {
                  modalAnim('slideOutUp');
            });
        }
        
        if ($(this).attr('bite-show') == 'slideInUp') {
            $(this).on('show.bs.modal', function (e) {
                  modalAnim('slideInUp');
            });
        }
        
        if ($(this).attr('bite-hide') == 'slideOutDown') {
            $(this).on('hide.bs.modal', function (e) {
                  modalAnim('slideOutDown');
            });
        }
    });
    
    if (jQuery(window).width() <= 1024) {
        $('.modal').each(function(){
            if($(this).hasClass('position-bottom-center') && $(this).attr('bite-show') == 'slideInUp') {
                $(this).on('show.bs.modal', function (e) {
                      modalAnim('fadeIn');
                });
            }
            if($(this).hasClass('position-bottom-center') && $(this).attr('bite-hide') == 'slideOutDown') {
                $(this).on('hide.bs.modal', function (e) {
                      modalAnim('fadeOut');
                });
            }
        });
        
        $('.modal').each(function(){
            if($(this).hasClass('position-bottom-right') && $(this).attr('bite-show') == 'slideInUp') {
                $(this).on('show.bs.modal', function (e) {
                      modalAnim('fadeIn');
                });
            }
            if($(this).hasClass('position-bottom-right') && $(this).attr('bite-hide') == 'slideOutDown') {
                $(this).on('hide.bs.modal', function (e) {
                      modalAnim('fadeOut');
                });
            }
        });
        
        $('.modal').each(function(){
            if($(this).hasClass('position-bottom-left') && $(this).attr('bite-show') == 'slideInUp') {
                $(this).on('show.bs.modal', function (e) {
                      modalAnim('fadeIn');
                });
            }
            if($(this).hasClass('position-bottom-left') && $(this).attr('bite-hide') == 'slideOutDown') {
                $(this).on('hide.bs.modal', function (e) {
                      modalAnim('fadeOut');
                });
            }
        });
    }
    
    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false') {
                var modalWidth = $(this).find('.modal-dialog').css('max-width').slice(0,-2);
                $(this).css({
                    'right': 'auto',
                    'left': '50%',
                    'margin-left': '-' + (modalWidth/2) + 'px',
                    'margin-top': '0',
                    'padding-right': '0',
                    'top': '0',
                    'bottom': 'auto'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-top-left')) {
                $(this).css({
                    'right': 'auto',
                    'left': '0',
                    'margin-left': '0',
                    'margin-top': '0',
                    'padding-right': '0',
                    'top': '0',
                    'bottom': 'auto'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-top-right')) {
                $(this).css({
                    'right': '0',
                    'left': 'auto',
                    'margin-left': '0',
                    'margin-top': '0',
                    'padding-right': '0',
                    'top': '0',
                    'bottom': 'auto'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-center-left')) {
                var modalHeight = $(this).css('height').slice(0,-2);
                $(this).css({
                    'right': 'auto',
                    'left': '0',
                    'margin-left': '0',
                    'margin-top': '-' + (modalHeight/2) + 'px',
                    'padding-right': '0',
                    'top': '50%',
                    'bottom': 'auto'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-center-center')) {
                var modalWidth = $(this).find('.modal-dialog').css('max-width').slice(0,-2);
                var modalHeight = $(this).css('height').slice(0,-2);
                $(this).css({
                    'right': 'auto',
                    'left': '50%',
                    'margin-left': '-' + (modalWidth/2) + 'px',
                    'margin-top': '-' + (modalHeight/2) + 'px',
                    'padding-right': '0',
                    'top': '50%',
                    'bottom': 'auto'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-center-right')) {
                var modalHeight = $(this).css('height').slice(0,-2);
                $(this).css({
                    'right': '0',
                    'left': 'auto',
                    'margin-left': '0',
                    'margin-top': '-' + (modalHeight/2) + 'px',
                    'padding-right': '0',
                    'top': '50%',
                    'bottom': 'auto'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-bottom-left')) {
                $(this).css({
                    'right': 'auto',
                    'left': '0',
                    'margin-left': '0',
                    'margin-top': '0',
                    'padding-right': '0',
                    'top': 'auto',
                    'bottom': '0'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-bottom-right')) {
                $(this).css({
                    'right': '0',
                    'left': 'auto',
                    'margin-left': '0',
                    'margin-top': '0',
                    'padding-right': '0',
                    'top': 'auto',
                    'bottom': '0'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });

    $('.modal').each(function(){
        $(this).on('show.bs.modal', function (e) {
            if($(this).attr('data-backdrop') == 'false' && $(this).hasClass('position-bottom-center')) {
                var modalWidth = $(this).find('.modal-dialog').css('max-width').slice(0,-2);
                $(this).css({
                    'right': 'auto',
                    'left': '50%',
                    'margin-left': '-' + (modalWidth/2) + 'px',
                    'margin-top': '0',
                    'padding-right': '0',
                    'top': 'auto',
                    'bottom': '0'
                });
                $('body').addClass('modal-open-no-backdrop');
            }
        });
        $(this).on('hide.bs.modal', function (e) {
            var bodyDefault = setTimeout(function(){
                $('body').removeClass('modal-open-no-backdrop');
            }, 1000);
        });
    });
    
    var fewclicksmodal = $('.fewclicksmodal');
    
    function fewclicksShowModal(){
        fewclicksmodal.modal({show:true});
    }

    var count = 0;
    $(document).click(function(e) {
        if( $(e.target).closest("a").length ) return;
        count++;

        if(count == 3) {
            if (!Cookies.get('popupfewclicks')) {
                fewclicksShowModal();
            }
            fewclicksmodal.on('shown.bs.modal', function () {
            	Cookies.set('popupfewclicks', 'valid', { expires: 1, path: "/" }); // need to set the path to fix a FF bug
                Cookies.remove('popupfewclicks', { path: '/' }); // removed cookie!
            })
        }
    });
    
    var closedoc = $('.closedoc');
    
    function closedocShowModal(){
        closedoc.modal({show:true});
    }
    
    var _ouibounce = ouibounce(false, {
        aggressive: true,
        timer: 0,
        delay: 100,
        cookieExpire: 10,
        callback: function() {
            if (!Cookies.get('popupouibounce')) {
                closedocShowModal();
            }
            closedoc.on('shown.bs.modal', function () {
        		Cookies.set('popupouibounce', 'valid', { expires: 1, path: "/" }); // need to set the path to fix a FF bug
                Cookies.remove('popupouibounce', { path: '/' }); // removed cookie!
        	})
        }

    });
    
    var scrollshow = $('.scrollshow');

    function scrollShowModal(){
        scrollshow.modal({show:true});
    }
    
    if ($('.scrollshowpoint').length){
        var modalScrollUp = $('.scrollshowpoint').offset().top - $(window).height();
    }
                
    $(window).scroll(function() {
        if ($(document).scrollTop() > modalScrollUp && scrollshow.attr("displayed") === "false") {
            if (!Cookies.get('popupscroll')) {
                scrollShowModal();
            }
            scrollshow.on('shown.bs.modal', function () {
        		Cookies.set('popupscroll', 'valid', { expires: 1, path: "/" }); // need to set the path to fix a FF bug
                Cookies.remove('popupscroll', { path: '/' }); // removed cookie!
        	})
            scrollshow.attr("displayed", "true");
        }
    });
    
    var timeoutshow = $('.timeoutshow');
    
    var num = $('.timeoutshow').attr('bite-timeout');
    var ms = num * 1000;
    
    function timeOutShowModal(){
        timeoutshow.modal({show:true});
    }
    
    // Remove effect for a period of n days (expires: n)
    if (!Cookies.get('popup')) {
       window.setTimeout(function () {timeOutShowModal();}, ms); // Show modal after m seconds ({showModal();}, m)
    }
    timeoutshow.on('shown.bs.modal', function () {
        Cookies.set('popup', 'valid', { expires: 1, path: "/" }); // need to set the path to fix a FF bug
        Cookies.remove('popup', { path: '/' }); // removed cookie!
    });
});

 