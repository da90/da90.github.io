$(document).ready(function () {

    $(".jq--section-features").waypoint(function (direction) {
        if (direction == "down") {
            $("nav").addClass("docked");
        } else {
            $("nav").removeClass("docked");
        }
    }, {
        offset: "60px"
    });


    /*button scroll*/
    $(".jq--scroll--plan").click(function() {
        $("html, body").animate({ scrollTop: $(".jq--section-plans").offset().top }, 1000);
    });

    $(".jq--scroll--start").click(function () {
        $("html, body").animate({ scrollTop: $(".jq--section-features").offset().top }, 1000);
    });

    /*navigation scroll*/
    $(function () {
        $('a[href*="#"]:not([href="#"])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });

    /*scroll animations*/
    $(".js--wpt01").waypoint(function (direction) {
        $(".js--wpt01").addClass("animated fadeIn");
    }, {
        offset: "50%"
    });

    $(".js--wpt02").waypoint(function (direction) {
        $(".js--wpt02").addClass("animated fadeInUp");
    }, {
        offset: "50%"
    });

    $(".js--wpt03").waypoint(function (direction) {
        $(".js--wpt03").addClass("animated fadeIn");
    }, {
        offset: "50%"
    });

    $(".js--wpt04").waypoint(function (direction) {
        $(".js--wpt04").addClass("animated pulse");
    }, {
        offset: "50%"
    });

    /*mobile nav*/
    $(".jq--nav-icon").click(function () {
        var n = $(".js--main-nav");
        var i = $(".jq--nav-icon i");

        n.slideToggle(200);

        if (i.hasClass("ion-navicon-round")) {
            i.addClass("ion-close-round")
            i.removeClass("ion-navicon-round")
        } else {
            i.addClass("ion-navicon-round")
            i.removeClass("ion-close-round")
        }


    });

    //new GMaps({
    //    div: '.map',
    //    lat: -12.043333,
    //    lng: -77.028333
    //});
});