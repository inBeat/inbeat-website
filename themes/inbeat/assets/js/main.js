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
  var mediaQuery = window.matchMedia('(min-width: 768px)');
  mediaQuery.addEventListener("change", function (e) {
    close();
  });


  if (menuBtn === null) return;
  var open = function () {
    isOpen = true;
    menuBtn.classList.add('is-active');
    document.body.classList.add('with-menu');
  };

  var close = function () {
    isOpen = false;
    menuBtn.classList.remove('is-active');
    document.body.classList.remove('with-menu');
    var arrow = document.querySelectorAll('.arrow-ico');
    for (var i = 0; i < arrow.length; i++) {
      arrow[i].classList.remove('open');
    }
  };

  menuBtn.addEventListener('click', function (e) {
    if (!menuBtn.classList.contains('is-active')) {
      open();
    } else {
      close();
    }
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

function testimonial() {
  if (!window.jQuery) {
    return;
  }
  $('.slider').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    speed: 5000,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 0,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    variableWidth: true,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToShow: 3
      }
    }, {
      breakpoint: 520,
      settings: {
        slidesToShow: 3
      }
    }]
  });
}

function pricing() {
  //set toggle 
  var toggle = document.querySelectorAll('.toggle-container')
  if (toggle.length === 0) { return }
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
    console.log('monthlySelector.children', monthlySelector.children[0]);
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

// TODO: Refactor the video popup
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
    this.content = this.popup.querySelector(".content-wrapper");

    this.openPopup = function () {
      isOpen = true;
      this.popup.classList.toggle('show');
      document.body.style.overflow = 'hidden';
      if (this.force) {
        document.querySelectorAll('.preventPointer').forEach(function (item) {
          item.classList.add("noTrigger");
        })
      }
      if (this.content.querySelector('video')) {
        this.content.querySelector('video').play();
        this.content.querySelector('video').volume = 0.2;
      }
    }
    this.closePopup = function () {
      isOpen = false
      this.popup.classList.toggle('show');
      document.body.style.overflow = 'hidden visible';
      if (this.content.querySelector('video')) {
        this.content.querySelector('video').pause();
        this.content.querySelector('video').currentTime = 0;
      }
    }

    this.popup.addEventListener('click', function (e) {
      if (!e.target.classList.contains('closeOverlay')) return;
      self.closePopup();
    })

    // Close popup if click on X button
    if (close !== null) {
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

  document.querySelectorAll('.popupTrigger').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var thisPopup = allPopup.find(function (x) {
        if (x.id === e.target.dataset.popupId)
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
  if (acc.length === 0) { return }
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
  if (acc.length === 0) { return }
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
function banner() {
  var banner = document.getElementById('banner');
  var text = banner.querySelector('#banner-text');
  var prevScrollpos = window.scrollY;
  window.onscroll = function () {
    if (!banner) return;
    var currentScrollPos = window.scrollY;
    if (prevScrollpos > currentScrollPos) {
      banner.style.height = '28px';
      text.classList.remove('hide');
    } else {
      banner.style.height = '0px';
      text.classList.add('hide');
    }
    prevScrollpos = currentScrollPos;
  };
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

  function getScroll() {
    var scrollTop = document.documentElement["scrollTop"] || document.body["scrollTop"];
    var scrollBottom = (document.documentElement["scrollHeight"] || document.body["scrollHeight"]) - document.documentElement.clientHeight - footer.offsetHeight;
    var scrollPercentValue = scrollTop / scrollBottom * 100;
    for (var i = 0; i < progressBar.length; i++) {
      if (scrollPercentValue >= barWidth * i) {
        progressBar[i].style.width = scrollPercentValue - barWidth * i + "%";
      } else {
        progressBar[i].style.width = 0 + "%";
      }
    }
  }
  getScroll();
}

// submenu for the navigation
function navigation() {
  var hasSubMenu = document.querySelectorAll('.has-submenu');
  for (var index = 0; index < hasSubMenu.length; index++) {
    var element = hasSubMenu[index];
    element.addEventListener('mouseenter', function (e) {
      e.preventDefault();
      e.target.children[1].classList.add('show-nav')
    })
    element.addEventListener('mouseleave', function (e) {
      e.preventDefault();
      e.target.children[1].classList.remove('show-nav')
    })
  }

}
function dropdown() {
  var activeEle = null
  var triggers = document.querySelectorAll('.dropdown')
  for (var i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function (e) {
      if (e.target.parentElement === activeEle) {
        e.target.parentElement.nextElementSibling.classList.toggle('show')
        e.target.nextElementSibling.classList.toggle('open')
      } else {
        activeEle = e.target.parentElement
        for (var j = 0; j < triggers.length; j++) {
          if (triggers[j] != activeEle) {
            if (triggers[j].children[1].classList.contains('open')) {
              triggers[j].children[1].classList.remove('open')
              triggers[j].nextElementSibling.classList.remove('show')
            } else {
              e.target.parentElement.nextElementSibling.classList.add('show')
              e.target.nextElementSibling.classList.add('open')
            }
          }
        }
      }
    })
  }
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

function isValidEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

(function () {
  home();
  scrollTo();
  header();
  pricing();
  affiliate();
 // popup();
  faq();
  banner();
  articleProgressBar();
  testimonial();
  navigation();
  dropdown();
  industries();
})();

