// Open the menu overlay on click
var menuBtn = document.getElementById('menu-icon');
var headerContainer = document.getElementById('header-container');
menuBtn.addEventListener('click', function(e) {
    if (!menuBtn.classList.contains('is-active')) {
        menuBtn.classList.add('is-active');
        headerContainer.classList.add('with-menu');
    } else {
        menuBtn.classList.remove('is-active');
        headerContainer.classList.remove('with-menu');
    }
});

var unlimitedSearchesIcon = document.getElementById('unlimited-searches');
var unlimitedSearches = bodymovin.loadAnimation({
    container: unlimitedSearchesIcon, // Required
    path: '/icons/unlimited-searches.json', // Required
    renderer: 'svg/canvas/html', // Required
    loop: true, // Optional
    autoplay: false, // Optional
    name: "Unlimited Searches", // Name for future reference. Optional.
});
unlimitedSearchesIcon.addEventListener('mouseenter', function(e) {
    unlimitedSearches.play();
});
unlimitedSearchesIcon.addEventListener('mouseleave', function(e) {
    unlimitedSearches.stop();
});

var unlimitedSearchesIcon2 = document.getElementById('unlimited-searches-2');
var unlimitedSearches2 = bodymovin.loadAnimation({
    container: unlimitedSearchesIcon2, // Required
    path: '/icons/unlimited-searches.json', // Required
    renderer: 'svg/canvas/html', // Required
    loop: false, // Optional
    autoplay: false, // Optional
    name: "Unlimited Searches", // Name for future reference. Optional.
});
unlimitedSearchesIcon2.addEventListener('mouseenter', function(e) {
    unlimitedSearches2.play();
});
unlimitedSearchesIcon2.addEventListener('mouseleave', function(e) {
    unlimitedSearches2.pause();
});


var blazinglyFast = bodymovin.loadAnimation({
    container: document.getElementById('blazingly-fast'), // Required
    path: '/icons/blazingly-fast.json', // Required
    renderer: 'svg/canvas/html', // Required
    loop: true, // Optional
    autoplay: true, // Optional
    name: "blazingly-fast", // Name for future reference. Optional.
});