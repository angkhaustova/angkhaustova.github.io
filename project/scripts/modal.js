$(document).ready(function () {
    $(".settings").click(function () {
        $(".settings-window").toggle();
    });

    $('.md-trigger').each(function () {
        var modalName = $(this).data('modal');
        var modal = $('#' + modalName);
        console.log(modal);
        if ($(this).data('shift-x') < 0)
            modal.css('left', '60px');

        modal.find('button').after('<button class="play-icon" onclick="document.getElementById(\'' + modalName + '\-audio\').play()"></button><audio src="audio/' + modalName + '.mp3" type="audio/mp3" id="' + modalName + '\-audio"><\/audio>');

    });

    $("#high_quality_img").off().on("load", function () {
        $("#bg-flex").css({
            "background-image": "url(./images/garden-full.jpg)"
        });
    });

    $('.md-modal').hide();
    $('.md-trigger').click(function () {
        $('.settings-window').hide();
        $('.md-trigger').fadeOut();
        var mdId = $(this).data('modal');
        console.log(mdId);
        $('#' + mdId).show();
        if ($("#autoplay").prop("checked")) {
            setTimeout(function () {
                $('#' + mdId).find("audio")[0].play()
            }, 1000);
        }
        var scale = 'scale(' + $(this).data('scale') + ')';
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var mdTop = $(this).css("top").replace("px", "");
        var mdLeft = $(this).css("left").replace("px", "");
        var shiftTop = $(this).data("shift-y");
        var shiftLeft = $(this).data("shift-x");
        var paintingWidth = 7595;
        var paintingHeight = 4325;
        var k = 4325 / $(window).height();
        var actualWidth = paintingWidth / k;
        var err = $(window).width() - actualWidth;
        err /= 2;

        console.log('shift y ' + shiftLeft / actualWidth);
        console.log('shift x ' + shiftTop / windowHeight);

        var width = (windowHeight / image.height) * image.width;

        console.log((shiftLeft / 100 * (actualWidth / 2)) / 5);

        var shiftX = shiftLeft / 100 * (actualWidth / 2);
        var shiftY = shiftTop / 100 * (windowHeight / 2);
        var errorShiftX = windowWidth / 2 / $(this).data('scale');
        var errorShiftY = windowHeight / 2 / $(this).data('scale');


        if (shiftLeft > 0)
            shiftX -= errorShiftX;
        else
            shiftX += errorShiftX;
        if (shiftY > 0)
            shiftY -= errorShiftY;
        else
            shiftY += errorShiftY;

        scale += ' translate(' + shiftX + 'px, ' + shiftY + 'px)';

        var styles = {
            'transform': scale,
            '-moz-transform': scale,
            '-webkit-transform': scale,
            '-o-transform': scale,
            '-ms-transform': scale
        };

        $('#bg-flex').css(styles);
    });

    var image_url = 'url(' + $('#high_quality_img').prop('src') + ')',
        image;

    // Remove url() or in case of Chrome url("")
    image_url = image_url.match(/^url\("?(.+?)"?\)$/);

    if (image_url[1]) {
        image_url = image_url[1];
        image = new Image();

        /* just in case it is not already loaded
         $(image).load(function () {
         alert(image.width + 'x' + image.height);
         });*/

        image.src = image_url;
    }

    console.log(image.width + 'x' + image.height);
    $(window).resize(function () {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        var paintingWidth = 7595;
        var paintingHeight = 4325;
        var k = 4325 / $(window).height();
        var actualWidth = paintingWidth / k;
        var err = $(window).width() - actualWidth;
        err /= 2;

        $('.md-trigger').each(function () {
            var coefTop = $(this).data('client-y');
            var coefLeft = $(this).data('client-x');
            var styles = {
                'top': coefTop / 100 * windowHeight + 'px',
                'left': err + actualWidth * (coefLeft / 100) + 'px',
            };
            console.log();
            $(this).css(styles);
        });

        if ($('.md-modal:visible').length < 1) return;

        var curMd = $('.md-trigger[data-modal=' + $('.md-modal:visible').prop('id') + ']');
        var coefTop = curMd.data('shift-x');
        var coefLeft = curMd.data('shift-y');
        var styles = {};

        styles.top = coefTop + 'px';
        styles.left = coefLeft + 'px';

        $('#bg-flex').css(styles);

        console.log(styles);
    });

    function printMousePos(event) {
        var x = event.clientX;
        var y = event.clientY;
        console.log("clientX: " + x +
            " - clientY: " + y);
        var paintingWidth = 7595;
        var paintingHeight = 4325;
        var k = 4325 / $(window).height();
        var actualWidth = paintingWidth / k;
        var err = $(window).width() - actualWidth;
        err /= 2;
        console.log("dot left " + ((x - err) / actualWidth));
        console.log("dot top " + (y / $(window).height()));
        if (x > $(window).width() / 2)
            console.log('left percent -' + ((x - $(window).width() / 2) / (actualWidth / 2)));
        else
            console.log('left percent ' + (actualWidth / 2 - x + err) / actualWidth * 2);
        if (y > $(window).height() / 2)
            console.log('top percent -' + ((y - $(window).height() / 2) / ($(window).height() / 2)));
        else
            console.log('top percent ' + ($(window).height() / 2 - y) / $(window).height() * 2);
    }

    document.addEventListener("click", printMousePos);

    $(window).trigger("resize");
});
