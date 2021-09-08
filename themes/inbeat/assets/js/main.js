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

function pricing() {
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

function popup() {
    // Get Popup from the DOM
    var id;
    var popupOverlay;
    var innerPopup;
    var closeBtn;
    var defaultWidth;
    var defaultHeight;
    var contentParent;
    var popupContent = document.getElementsByClassName('popupContent')[0];
    var isOpen = false;
    var mediaQuery = window.matchMedia('(max-width: 768px)')

    // Set the position of the popup to always be centered
    function position() {
        innerPopup.style.transition = "none";
        var pageWidth = window.innerWidth,
            pageHeight = window.innerHeight;
        // Check if the media query is true
        if (mediaQuery.matches) {
            if(popupContent != null){
                innerPopup.style.height = 112 + popupContent.offsetHeight + 'px';
                innerPopup.style.margin = 10 + 'px';
                popupContent.style.borderRadius = '0px';
                contentParent.style.padding = '0px';
            }
        } else {
            innerPopup.style.width = defaultWidth;
            innerPopup.style.height = defaultHeight;
            if(contentParent.querySelector("video")){
                contentParent.style.padding = '50px';
            }
        }
        innerPopup.style.top = (pageHeight / 2) - (innerPopup.offsetHeight / 2) + 'px';
        innerPopup.style.left = (pageWidth / 2) - (innerPopup.clientWidth / 2) - 10 + 'px';
        innerPopup.style.transition = "all .25s ease-in-out";
    }

    // Open/Close popup
    this.togglePopup = function(popupId) {
        
        id = popupId;
        popupOverlay = document.getElementById(id);
        innerPopup = popupOverlay.querySelector(".popup");
        closeBtn = popupOverlay.querySelector(".close")
        defaultWidth = innerPopup.style.width;
        defaultHeight = innerPopup.style.height;
        contentParent = popupOverlay.querySelector(".content-wrapper");
        popupOverlay.classList.toggle('popupOverlay--fadeIn');
        innerPopup.classList.toggle('popupInner--fadeIn');
        position();
        isOpen = !isOpen;
        // Toggle player play or pause
        if (isOpen) {
            if(contentParent.querySelector("video")){
                contentParent.querySelector("video").play();
                contentParent.querySelector("video").volume = 0.2;
            }
            document.body.style.overflow = 'hidden';
            document.querySelectorAll('section').forEach(function (item) {
                item.classList.add("blur");
            })
        } else {
            if(contentParent.querySelector("video")){
                contentParent.querySelector("video").pause();
                contentParent.querySelector("video").currentTime = 0;;
            }
            document.body.style.overflow = 'visible';
            document.querySelectorAll('section').forEach(function (item) {
                item.classList.remove("blur");
            })
        }

        // Close popup if click on overlay
        popupOverlay.addEventListener('click', function (e) {
            if (!e.target.classList.contains('popup-overlay')) return;
            togglePopup(id);
        })

        // Close popup if click on X button
        closeBtn.addEventListener('click', function () {
            togglePopup(id);
        })
    }
    // For each DIV that have the class .popupTrigger, when click open et set position of the popup form
    document.querySelectorAll('.popupTrigger').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            id = e.target.dataset.popupId
            togglePopup(e.target.dataset.popupId);
        })
    })

    // Listen to resize event and don't position if the popup is closed
    window.addEventListener('resize', function () {
        if (isOpen) {
            position();
        } else {
            return
        }
    });
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

    toggleAccordionState(currentActive);

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

function banner(){
    var banner = document.getElementById('banner');
    var closeBtn = document.getElementById('close');

    closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        banner.remove()
    })
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
})();
