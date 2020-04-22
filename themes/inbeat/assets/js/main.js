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

// Icons in the features section
var searchAnim = document.getElementById('search-animation');
var anim = bodymovin.loadAnimation({
    container: searchAnim, // Required
    path: '/animations/placeholder.json', // Required
    renderer: 'svg', // Required
    loop: true, // Optional
    autoplay: true, // Optional
    name: 'Search', // Name for future reference. Optional.
}); 

// Icons in the extras section
var homeIcons = ['unlimited-searches', 'blazingly-fast'];
homeIcons.forEach(function(iconName) {
    var icon = document.getElementById(iconName);
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
