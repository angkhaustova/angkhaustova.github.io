//влево 37, вверх 38, вправо 39, вниз 40
$(document).ready(function () {
    var shiftX = 0;
    var shiftY = 0;

    $(document).keyup(function (e) {
        var transformMatrix = $('#bg-flex').css("transform");
        var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');

        var scale = 'scale(1)';


        if (e.shiftKey)
            switch (e.which) {
                case 37:
                    shiftX += 100;
                    scale = 'scale(4)';
                    break;
                case 38:
                    shiftY += 100;
                    scale = 'scale(4)';
                    break;
                case 39:
                    shiftX -= 100;
                    scale = 'scale(4)';
                    break;
                case 40:
                    shiftY -= 100;
                    scale = 'scale(4)';
                    break;
            }
        else
            switch (e.which) {
                case 37:
                    shiftX += 1;
                    break;
                case 38:
                    shiftY += 1;
                    break;
                case 39:
                    shiftX -= 1;
                    break;
                case 40:
                    shiftY -= 1;
                    break;
            }

        scale += ' translate(' + shiftX + 'px, ' + shiftY + 'px)';

        var styles = {
            'transform': scale,
            '-moz-transform': scale,
            '-webkit-transform': scale,
            '-o-transform': scale,
            '-ms-transform': scale
        };

        $('#bg-flex').css(styles);

        console.log(shiftX + ' ' + shiftY);
    });
});
