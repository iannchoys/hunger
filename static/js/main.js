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
        $(".food-menu__tab").on("click", function () {
        var category = $(this).data("category");
        var menuItems = $(".food-menu__item-col").toArray();

        $(".food-menu__tab").removeClass("food-menu__tab--active");
        $(this).addClass("food-menu__tab--active");

        if (category === "all") {
            $(menuItems).css("display", "block");
            return;
        }

        var filteredItems = menuItems.filter(function (item) {
            return $(item).data("category") === category;
        });

        $(menuItems).css("display", "none");
        $(filteredItems).css("display", "block");
    });
        $("#contactForm").on("submit", function (event) {
        event.preventDefault();

        var $form = $(this);
        var $status = $("#contactStatus");

        $status
            .removeClass("contact__status--success contact__status--error")
            .text("Sending...");

        $.ajax({
            url: "/contact/create/",
            type: "POST",
            data: $form.serialize(),
            success: function (response) {
                $status
                    .addClass("contact__status--success")
                    .text(response.message);

                $form[0].reset();
            },
            error: function (response) {
                var message = "Something went wrong.";

                if (response.responseJSON && response.responseJSON.message) {
                    message = response.responseJSON.message;
                }

                $status
                    .addClass("contact__status--error")
                    .text(message);
            }
        });
    });
});