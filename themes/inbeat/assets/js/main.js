// Open the menu overlay on click
function header() {
    var menuBtn = document.getElementById('menu-icon');
    menuBtn.addEventListener('click', function(e) {
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
    var homeIcons = ['unlimited-searches', 'blazingly-fast', 'affordable-pricing'];
    homeIcons.forEach(function(iconName) {
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
        icon.addEventListener('mouseenter', function(e) {
            anim.play();
        });
        icon.addEventListener('mouseleave', function(e) {
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
	var distanceToTop = function(el) { return Math.floor(el.getBoundingClientRect().top) };
	e.preventDefault();
	var targetID = (respond) ? respond.getAttribute('href') : this.getAttribute('href');
	var targetAnchor = document.querySelector(targetID);
	if (!targetAnchor) return;
    var originalTop = distanceToTop(targetAnchor);
    // Need some adjustment because of navbar. TODO: mobile navbar is narrower
	window.scrollBy({ top: originalTop - 84, left: 0, behavior: 'smooth' });
	var checkIfDone = setInterval(function() {
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
        monthlySelector.addEventListener('click', function(e) {
            schedule.className = 'row monthly';
        });
        yearlySelector.addEventListener('click', function(e) {
            schedule.className = 'row yearly';
        });
    }
}

(function() {
    scrollTo();
    header();
    home();
    pricing();
})();
