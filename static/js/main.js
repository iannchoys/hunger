$(function () {
    var $header = $(".hero__header");

    function updateHeader() {
        if ($(window).scrollTop() > 40) {
            $header.addClass("hero__header--fixed");
        } else {
            $header.removeClass("hero__header--fixed");
        }
    }

    updateHeader();

    $(window).on("scroll", updateHeader);

    $(".hero__anchor").on("click", function (event) {
        var targetId = $(this).attr("href");
        var $target = $(targetId);

        if ($target.length === 0) {
            return;
        }

        event.preventDefault();

        var headerHeight = $header.outerHeight() || 0;
        var targetPosition = Math.max(
            $target.offset().top - headerHeight,
            0
        );

        $("html, body").stop().animate(
            {
                scrollTop: targetPosition
            },
            600
        );

        $("#mainMenu").collapse("hide");
    });
        $("#bookingForm").on("submit", function (event) {
        event.preventDefault();
    });
        $(".specialities__slider").slick({
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500
    });
});