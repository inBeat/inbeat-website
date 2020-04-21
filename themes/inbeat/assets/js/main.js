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