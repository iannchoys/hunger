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

        var $form = $(this);
        var $status = $("#bookingStatus");

        $status
            .removeClass("booking__status--success booking__status--error")
            .text("Sending...");

        $.ajax({
            url: "/booking/create/",
            type: "POST",
            data: $form.serialize(),
            success: function (response) {
                $status
                    .addClass("booking__status--success")
                    .text(response.message);

                $form[0].reset();
            },
            error: function (response) {
                var message = "Something went wrong.";

                if (response.responseJSON && response.responseJSON.message) {
                    message = response.responseJSON.message;
                }

                $status
                    .addClass("booking__status--error")
                    .text(message);
            }
        });
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
        function showAuthStatus($status, type, message) {
        $status
            .removeClass("auth-modal__status--success auth-modal__status--error")
            .addClass("auth-modal__status--" + type)
            .text(message);
    }

    function makeLogoutMenuItem() {
        $("#authMenuItem").html(
            '<a class="hero__menu-link" href="#" id="logoutLink">LOGOUT</a>'
        );
    }

    function makeLoginMenuItem() {
        $("#authMenuItem").html(
            '<a class="hero__menu-link" href="#" data-toggle="modal" data-target="#authModal">LOGIN</a>'
        );
    }

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();

        var $form = $(this);
        var $status = $("#loginStatus");

        showAuthStatus($status, "success", "Sending...");

        $.ajax({
            url: "/users/login/",
            type: "POST",
            data: $form.serialize(),
            success: function (response) {
                showAuthStatus($status, "success", response.message);
                makeLogoutMenuItem();

                setTimeout(function () {
                    $("#authModal").modal("hide");
                    $form[0].reset();
                    $status.text("");
                }, 700);
            },
            error: function (response) {
                var message = "Something went wrong.";

                if (response.responseJSON && response.responseJSON.message) {
                    message = response.responseJSON.message;
                }

                showAuthStatus($status, "error", message);
            }
        });
    });

    $("#registerForm").on("submit", function (event) {
        event.preventDefault();

        var $form = $(this);
        var $status = $("#registerStatus");

        showAuthStatus($status, "success", "Sending...");

        $.ajax({
            url: "/users/register/",
            type: "POST",
            data: $form.serialize(),
            success: function (response) {
                showAuthStatus($status, "success", response.message);
                makeLogoutMenuItem();

                setTimeout(function () {
                    $("#authModal").modal("hide");
                    $form[0].reset();
                    $status.text("");
                }, 700);
            },
            error: function (response) {
                var message = "Something went wrong.";

                if (response.responseJSON && response.responseJSON.message) {
                    message = response.responseJSON.message;
                }

                showAuthStatus($status, "error", message);
            }
        });
    });

    $(document).on("click", "#logoutLink", function (event) {
        event.preventDefault();

        var csrfToken = $("input[name='csrfmiddlewaretoken']").first().val();

        $.ajax({
            url: "/users/logout/",
            type: "POST",
            data: {
                csrfmiddlewaretoken: csrfToken
            },
            success: function () {
                makeLoginMenuItem();
            }
        });
    });
});