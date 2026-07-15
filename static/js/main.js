$(function () {
    var $header = $(".hero__header");

    function getCookie(name) {
        var cookieValue = null;

        if (document.cookie && document.cookie !== "") {
            var cookies = document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();

                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }

        return cookieValue;
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!(/^GET|HEAD|OPTIONS|TRACE$/i.test(settings.type))) {
                xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
            }
        }
    });

    function updateHeader() {
        if ($(window).scrollTop() > 40) {
            $header.addClass("hero__header--fixed");
        } else {
            $header.removeClass("hero__header--fixed");
        }
    }

    if ($header.length) {
        updateHeader();
        $(window).on("scroll", updateHeader);
    }

    $(".hero__anchor").on("click", function (event) {
        var targetId = $(this).attr("href");

        if (!targetId || targetId.charAt(0) !== "#") {
            return;
        }

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

        if ($.fn.collapse) {
            $("#mainMenu").collapse("hide");
        }
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

    if ($(".specialities__slider").length && $.fn.slick) {
        $(".specialities__slider").slick({
            arrows: false,
            dots: true,
            infinite: true,
            speed: 500
        });
    }

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

        $.ajax({
            url: "/users/logout/",
            type: "POST",
            success: function () {
                makeLoginMenuItem();
                window.location.reload();
            },
            error: function () {
                alert("Logout error. Please refresh the page.");
            }
        });
    });

    $("#passwordResetRequestForm").on("submit", function (event) {
        event.preventDefault();

        var $form = $(this);
        var $status = $("#passwordResetRequestStatus");

        showAuthStatus($status, "success", "Sending...");

        $.ajax({
            url: "/users/password-reset/request/",
            type: "POST",
            data: $form.serialize(),
            success: function (response) {
                showAuthStatus($status, "success", response.message);
                $form[0].reset();
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

    $("#resetPasswordConfirmForm").on("submit", function (event) {
        event.preventDefault();

        var $form = $(this);
        var $status = $("#resetPasswordConfirmStatus");
        var url = $form.data("url");

        $status
            .removeClass("password-reset-page__status--success password-reset-page__status--error")
            .addClass("password-reset-page__status--success")
            .text("Sending...");

        $.ajax({
            url: url,
            type: "POST",
            data: $form.serialize(),
            success: function (response) {
                $status
                    .removeClass("password-reset-page__status--error")
                    .addClass("password-reset-page__status--success")
                    .text(response.message);

                $form[0].reset();
            },
            error: function (response) {
                var message = "Something went wrong.";

                if (response.responseJSON && response.responseJSON.message) {
                    message = response.responseJSON.message;
                }

                $status
                    .removeClass("password-reset-page__status--success")
                    .addClass("password-reset-page__status--error")
                    .text(message);
            }
        });
    });
});