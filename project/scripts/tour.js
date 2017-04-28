/**
 * Created by Angelica on 20.04.2017.
 */
$(document).ready(function () {
    $("audio")
        .on("play", function () {
            $(this).prev(".play-icon").css("background-image", "url(\"./images/pause.png\")");
            $(this).prev(".play-icon").off("click");
            $(this).prev(".play-icon").on("click", function () {
                $(this).next("audio")[0].pause();
            });
        })
        .on("pause", function () {
            $(this).prev(".play-icon").css("background-image", "url(\"./images/play.png\")");
            $(this).prev(".play-icon").off("click");
            $(this).prev(".play-icon").on("click", function () {
                $(this).next("audio")[0].play();
            });
        });

    $(".md-close").on("click", function () {
        $('.md-trigger').fadeIn();
        $('.md-modal').hide();

        var styles = {
            'transform': '',
            '-moz-transform': '',
            '-webkit-transform': '',
            '-o-transform': '',
            '-ms-transform': '',
            'top': 0,
            'left': 0
        };

        $('#bg-flex').css(styles);

        $(this).next(".play-icon").css("background-image", "url(\"./images/play.png\")");
        $(this).next(".play-icon").next("audio")[0].load();
    });

    $('.tour').click(function () {
        next(0);
    });

    function next(prev) {
        if (prev == $(".md-trigger").last()) {
            $('.md-modal').hide();
            $('#' + $(prev).data('modal')).find(".play-icon").css("background-image", "url(\"./images/play.png\")");
            $('#' + $(prev).data('modal')).find(".play-icon").next("audio")[0].load();
            return;
        }
        if (prev)
            var nextModal = $(prev).next(".md-trigger");
        else
            var nextModal = $(".md-trigger").first();
        var audio = $('#' + nextModal.data('modal')).find('audio');
        nextModal.click();
        audio.on('ended', function () {
            $('#' + nextModal.data('modal')).find('.md-close').click();
            console.log(nextModal.find('.md-close'));
            next(nextModal);
            audio.off('ended');
        });
    }

    function nextModalUser(prev) {
        if (prev.is($(".md-trigger").last())) {
            $('.md-modal').hide();
            $('#' + $(prev).data('modal')).find(".play-icon").css("background-image", "url(\"./images/play.png\")");
            $('#' + $(prev).data('modal')).find(".play-icon").next("audio")[0].load();
            next(0);
            return;
        }
        if (prev)
            var nextModal = $(prev).next(".md-trigger");
        else
            var nextModal = $(".md-trigger").first();
        $('.md-modal').hide();
        $('#' + $(prev).data('modal')).find(".play-icon").css("background-image", "url(\"./images/play.png\")");
        $('#' + $(prev).data('modal')).find(".play-icon").next("audio")[0].load();
        nextModal.click();
        console.log($(prev).data('modal'));
    }

    $('.next-modal').click(function () {
        console.log($('.md-trigger[data-modal=' + $('.md-modal:visible').attr('id') + ']'));
        nextModalUser($('.md-trigger[data-modal=' + $('.md-modal:visible').attr('id')));
    });
});