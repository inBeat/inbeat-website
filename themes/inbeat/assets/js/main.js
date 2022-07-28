// Utils
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Found here to manipulate cookies: https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Open the menu overlay on click
function header() {
    var menuBtn = document.getElementById('menu-icon');
    if(menuBtn === null) return;
    menuBtn.addEventListener('click', function (e) {
        if (!menuBtn.classList.contains('is-active')) {
            menuBtn.classList.add('is-active');
            document.body.classList.add('with-menu');
        } else {
            menuBtn.classList.remove('is-active');
            document.body.classList.remove('with-menu');
        }
    });
}

function home() {
    // Icons in the extras section
    var homeIcons = ['unlimited-searches', 'blazingly-fast', 'affordable-pricing', 'inbeat-animated-logo'];
    homeIcons.forEach(function (iconName) {
        var icon = document.getElementById(iconName);
        if (!icon) {
            return;
        }
        var anim = bodymovin.loadAnimation({
            container: icon, // Required
            path: '/animations/' + iconName + '.json', // Required
            renderer: 'svg', // Required
            loop: false, // Optional
            autoplay: false, // Optional
            name: iconName, // Name for future reference. Optional.
        });
        icon.addEventListener('mouseenter', function (e) {
            anim.play();
        });
        icon.addEventListener('mouseleave', function (e) {
            anim.stop();
        });
    });
}

// Vanilla JS Smooth Scroll
function scrollTo() {
    var links = document.querySelectorAll('.scroll');
    links.forEach(function (each) {
        each.onclick = scrollAnchors
    });
}

function scrollAnchors(e, respond) {
    var distanceToTop = function (el) { return Math.floor(el.getBoundingClientRect().top) };
    e.preventDefault();
    var targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
    var targetAnchor = document.querySelector(targetID);
    if (!targetAnchor) return;
    var originalTop = distanceToTop(targetAnchor);
    // Need some adjustment because of navbar. TODO: mobile navbar is narrower
    window.scrollBy({ top: originalTop - 84, left: 0, behavior: 'smooth' });
    var checkIfDone = setInterval(function () {
        var atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
        if (distanceToTop(targetAnchor) === 0 || atBottom) {
            targetAnchor.tabIndex = '-1';
            targetAnchor.focus();
            window.history.pushState('', '', targetID);
            clearInterval(checkIfDone);
        }
    }, 100);
}

// function testimonial() {
//     if(!window.jQuery) {
//         return;
//     }
//         $('.slider').slick({
//           slidesToShow: 6,
//           slidesToScroll: 1,
//           speed: 5000,
//           cssEase: 'linear',
//           autoplay: true,
//           autoplaySpeed: 0,
//           arrows: false,
//           dots: false,
//           pauseOnHover: false,
//           variableWidth: true,
//           responsive: [{
//             breakpoint: 768,
//             settings: {
//                 slidesToShow: 3
//             }
//             }, {
//             breakpoint: 520,
//             settings: {
//                 slidesToShow: 3
//             }
//         }]
//     });
// }

function pricing() {
    //set toggle 
    var toggle = document.querySelectorAll('.toggle-container')
    if(toggle.length === 0){return}
    var currentActive = toggle[0];
    var creatorStudioActive = function (item) {
        item.classList.add('--active')
        document.querySelector('.toggle_database').classList.remove('--active')
        document.querySelector('.pricing_creator-studio').classList.add('--show')
        document.querySelector('.pricing_database').classList.remove('--show')
    };
    var creatorStudioInactive = function (item) {
        item.classList.add('--active')
        document.querySelector('.toggle_creator-studio').classList.remove('--active')
        document.querySelector('.pricing_creator-studio').classList.remove('--show')
        document.querySelector('.pricing_database').classList.add('--show')
    };
    creatorStudioInactive(currentActive);

    for (i = 0; i < toggle.length; i++) {
        toggle[i].addEventListener('click', function (e) {
            e.preventDefault();
                this.classList.contains('toggle_creator-studio') ? creatorStudioActive(this) : creatorStudioInactive(this)
        }, true);
    }
    // Select pricing interval
    var schedule = document.getElementById('pricing-row');
    if (schedule) {
        var monthlySelector = document.getElementById('monthly-schedule');
        var yearlySelector = document.getElementById('yearly-schedule');
        console.log('monthlySelector.children',monthlySelector.children[0] );
        monthlySelector.addEventListener('click', function (e) {
            schedule.className = 'row monthly';
            monthlySelector.classList.remove('disabled');
            yearlySelector.children[0].classList.add('disabled');

        });
        yearlySelector.addEventListener('click', function (e) {
            schedule.className = 'row yearly';
            yearlySelector.children[0].classList.remove('disabled');
            monthlySelector.classList.add('disabled');
        });
    }
}

function affiliate() {
    var slider = document.getElementById('customer-range');
    if (slider) {
        var width = slider.clientWidth;
        var earnings = document.getElementById('earnings');
        var customerNb = document.getElementById('customer-nb');
        var calcPosition = function (e) {
            var v;
            if (e) {
                v = e.target.valueAsNumber;
            } else {
                v = slider.valueAsNumber;
            }
            customerNb.textContent = v;
            earnings.textContent = v * 20;

            // position the customer nb
            var pos = v / 500;
            var thumbCorrect = 18 * (pos - 0.5) * -1;
            var nbLengthCorrect = 1;
            if (v >= 100) {
                nbLengthCorrect = -5;
            } else if (v >= 10) {
                nbLengthCorrect = -2;
            }
            customerNb.style.left = (pos * width - 4.5 + thumbCorrect + nbLengthCorrect) + 'px';
        }
        window.addEventListener('resize', debounce(function () {
            width = slider.clientWidth;
            calcPosition();
        }, 150));
        slider.addEventListener('input', calcPosition)
    }
}

function topInfluencers() {
    // Select the form
    var popup = document.getElementById('top-popup');
    if (popup) {
        // If the cookie is active, no popup
        if (getCookie('guide-popup')) {
            return;
        }

        // Else, set the cookie for no more popup
        setCookie('guide-popup', true, 60);

        // Popup after 8 seconds
        setTimeout(function () {
            popup.style.display = 'table';
        }, 8000);

        var close = document.getElementById('form-close');
        close.addEventListener('click', function (e) {
            popup.style.display = 'none';
        });

        popup.querySelector('.modal-wrapper').addEventListener('click', function (e) {
            if (e.target !== this) {
                return;
            }
            popup.style.display = 'none';
        })

        var form = document.getElementById('top-form');
        var email = document.getElementById('top-email');
        var ml = document.getElementById('ml');
        var btn = document.getElementById('top-submit');
        var err = document.getElementById('form-error');
        var se = /^[\w\.\-_]{1,}@[\w\.\-]{6,}/
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (email.value == '' || ml.value !== '1') {
                err.style.display = 'block';
                err.innerText = 'Fill out the form';
                return;
            }

            if (!se.test(email.value)) {
                err.style.display = 'block';
                err.innerText = 'Check your email address';
                return;
            }

            btn.innerText = 'Sending...';

            var request = new XMLHttpRequest();
            request.open('POST', this.action, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    popup.classList.add('completed');
                    btn.innerText = 'Perfectly Sent!';
                } else {
                    err.style.display = 'block';
                    btn.innerText = 'Send again';
                }
            };

            request.onerror = function () {
                err.style.display = 'block';
                btn.innerText = 'Send again';
            };
            request.send('fields%5Bemail%5D=' + encodeURI(email.value) + '&ml-submit=1');
        })

    }
}
var allPopup = [];
function popup() {
    var Popup = function (options) {
        var self = this
        this.popup = options.popup;
        this.innerPopup = this.popup.querySelector('.popup');
        this.id = this.popup.id
        var isOpen = false;
        this.force = this.popup.dataset.force || false;
        close = this.popup.querySelector(".close")
        defaultWidth = this.innerPopup.style.width;
        defaultHeight = this.innerPopup.style.height;
        this.content = this.popup.querySelector(".content-wrapper");
        this.innerPopup.style.transition = "all .25s ease-in-out";
        
        this.openPopup = function () { 
            isOpen = true;
            this.popup.classList.toggle('popupOverlay--fadeIn');
            this.innerPopup.classList.toggle('popupInner--fadeIn');
            document.body.style.overflow = 'hidden';
            document.querySelectorAll('section').forEach(function (item) {
                item.classList.toggle("blur");
            })
            if (this.force) {
                document.querySelectorAll('.preventPointer').forEach(function (item) {
                    item.classList.add("noTrigger");
                })      
            }
            if(this.content.querySelector('video')){
                this.content.querySelector('video').play();
                this.content.querySelector('video').volume = 0.2;
            }
        }
        this.closePopup = function () {
            isOpen = false
            this.popup.classList.toggle('popupOverlay--fadeIn');
            this.innerPopup.classList.toggle('popupInner--fadeIn');
            document.body.style.overflow = 'visible';
            document.querySelectorAll('section').forEach(function (item) {
                item.classList.remove("blur");
            })
            if(this.content.querySelector('video')){
                this.content.querySelector('video').pause();
                this.content.querySelector('video').currentTime = 0;
            }
        }

        this.popup.addEventListener('click', function (e) {
            if (!e.target.classList.contains('closeOverlay')) return;
            self.closePopup();
        })

        // Close popup if click on X button
        if(close !== null){
            close.addEventListener('click', function () {
                self.closePopup();
            })
        }
        this.getState = function () {
          return isOpen
        }
        this.getId = function () {
          return id
        }
    };
    
    document.querySelectorAll('.popup').forEach(function (item, i) {
        allPopup.push(new Popup({
            force: true,
            popup: document.getElementById(item.parentElement.id)
        }))
    })

    document.querySelectorAll('.popupTrigger').forEach( function (item) {
        item.addEventListener('click',  function (e) {
            e.preventDefault();
            var thisPopup  = allPopup.find(function (x) {
                if(x.id === e.target.dataset.popupId)
                    return x;
            })
            if (thisPopup.getState === true) {
                thisPopup.closePopup();
            }
            thisPopup.openPopup()
        })
    })
}

function faq() {
    var acc = document.getElementsByClassName('accordion-heading');
    if(acc.length === 0){return}
    var currentActive = acc[0];
    var toggleAccordionState = function (accordion) {
        accordion.nextElementSibling.classList.toggle("active");
        accordion.lastElementChild.classList.toggle('open');
        accordion.classList.toggle("new-padding");
    };
    var reset = function (accordion) {
        accordion.nextElementSibling.classList.remove("active");
        accordion.lastElementChild.classList.remove('open');
        accordion.classList.remove("new-padding");
    };

    // toggleAccordionState(currentActive);

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener('mousedown', function (e) {
            e.preventDefault();
            toggleAccordionState(this);
            if (this != currentActive) {
                reset(currentActive);
                currentActive = this;
            }
        }, true);
    }
}

function industries() {
    var acc = document.getElementsByClassName('switcher_accordian-item');
    if(acc.length === 0){return}
    var currentActive = acc[0];
    var toggleAccordionState = function (accordion) {
        accordion.classList.add("--active");
        accordion.nextElementSibling.classList.add("--hidden");
        accordion.previousElementSibling.classList.add("--hidden");
    };
    var reset = function (accordion) {
        accordion.classList.remove("--active");
        accordion.nextElementSibling.classList.remove("--hidden");
        accordion.previousElementSibling.classList.remove("--hidden");
    };

    toggleAccordionState(currentActive);

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener('mousedown', function (e) {
            e.preventDefault();
            if (this != currentActive) {
                reset(currentActive);
                currentActive = this;
            }
            toggleAccordionState(this);
        }, true);
    }
}
function banner(){
    var banner = document.getElementById('banner');
    if(!banner) {
        return;
    }
    var text = banner.querySelector('#popup-trigger')
    var close = banner.querySelector('#close')
    var closeBtn = document.getElementById('close');
    var hero = document.getElementById('hero');
    var hero_cmp = document.getElementById('hero_cmp');
    var prevScrollpos = window.pageYOffset;
    if(hero == null){
       hero = document.getElementById('hero-industries');
    }
    window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
            banner.style.height =  '28px';
            text.classList.remove("hide");
            close.style.top = '0';
        } else {
            banner.style.height = "0px"
            text.classList.add("hide");
            close.style.top = '-30px'
        }
        prevScrollpos = currentScrollPos;
    }
    // if (getCookie('banner-hide')) {
    //     banner.classList.add("hide-banner");
    //     if(hero == null){return}hero.classList.remove('has-banner');
    //     return;
    // }
    banner.classList.remove("hide-banner");
    closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setCookie('banner-hide', true, 60);
        banner.remove();
        if(hero !== null){
            hero.classList.remove('has-banner');
        }
        if(hero_cmp !== null){
            hero_cmp.classList.remove('has-banner');
        }
    })
    if(hero !== null){
        hero.classList.add('has-banner');
    }
    if(hero_cmp !== null){
        hero_cmp.classList.add('has-banner');
    }
}

function articleProgressBar() {
  var footer = document.querySelector("footer");
  var progressBar = document.querySelectorAll(".progress-bar");
  var barWidth = 100 / progressBar.length;

  for (var i = 0; i < progressBar.length; i++) {
    progressBar[i].style.left = barWidth * i + "%";
  }

  document.addEventListener("scroll",
    function () {
      getScroll()
    },
    { passive: true }
  );

  function getScroll(){
    var scrollTop = document.documentElement["scrollTop"] || document.body["scrollTop"];
    var scrollBottom = (document.documentElement["scrollHeight"] || document.body["scrollHeight"]) - document.documentElement.clientHeight - footer.offsetHeight ;
    var scrollPercentValue = scrollTop / scrollBottom * 100;
    for (var i = 0; i < progressBar.length; i++) {
     // progressBar[i].style.backgroundColor = barBG[i]
      if (scrollPercentValue >= barWidth * i) {
        progressBar[i].style.width = scrollPercentValue - barWidth * i + "%";
      } else {
        progressBar[i].style.width = 0 + "%";
      }
    }
  }
  getScroll();
}



(function () {
  scrollTo();
  header();
  home();
  pricing();
  affiliate();
  topInfluencers();
  popup();
  faq();
  banner();
  articleProgressBar();
  industries();
//   testimonial();
})();
