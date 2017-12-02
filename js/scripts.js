jQuery(document).ready(function ($) {
    $('.ref').each(function () {
        $(this).attr('title', $($(this).parents('.text-container').attr('class').replace(/( |^)/g, '.') + ' a[href="#' + $(this).attr('id') + '"]').parent().text().replace(/\[\d+]/g, ''));
        $(this).attr('data-toggle', 'tooltip');
        $(this).attr('data-placement', 'top');

        $(this).attr('id', $(this).attr('id') + '_' + $(this).parents('.text-container').attr('id'));
        $(this).attr('name', $(this).attr('name') + '_' + $(this).parents('.text-container').attr('id'));
        $(this).attr('href', $(this).attr('href') + '_' + $(this).parents('.text-container').attr('id'));
    });

    $('.refs a').each(function () {
        $(this).attr('id', $(this).attr('id') + '_' + $(this).parents('.text-container').attr('id'));
        $(this).attr('href', $(this).attr('href') + '_' + $(this).parents('.text-container').attr('id'));
        $(this).attr('name', $(this).attr('name') + '_' + $(this).parents('.text-container').attr('id'));
        $('[data-toggle="tooltip"]').tooltip();
    });

    jQuery(document).ready(function ($) {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $('.toggle-view').click(function () {
        if ($('.toggle-animation').is('.active')) {
            $('.toggle-animation').click();
        }

        toggleView($(this));
    });


    $('.toggle-text').click(function () {
        if ($(this).is('.active')) return;
        $('.toggle-text').toggleClass('active');
        $('.text-container').toggle();
    });

    $('.clear-view').click(function () {
        $('[data-view=editor-view]').click();
    });

    /*function trimInscribed(selector) {
        $(selector + ' .inscribed').each(function (index) {
            var contents = $(this).html();
            if (contents.startsWith('{'))
            //console.log($(this).html(contents.substring(1, contents.length - 1)));
                $(this).html(contents.replace(/([{}])/g, '<span class="editor-hidden brace">$1</span>'));

            if ($(this).has('.inscribed')) trimInscribed('#' + $(this).attr('id'));
        });
    }*/


});

function toggleView(element) {
    var classes = 'editor-view highlight editor-hidden';
    var type = element.data('type');
    var view = element.data('view');

    if (type === 'inscribed' && (view === 'editor-hidden' || view === 'highlight')) {
        if (!$('.text .brace').is('.editor-hidden')) toggleBrackets('.text', 'brace');
    } else if (type === 'inscribed' && view === 'editor-view') {
        if ($('.text .brace').is('.editor-hidden')) toggleBrackets('.text', 'brace');
    }

    if (type === 'crossed' && (view === 'editor-hidden' || view === 'highlight')) {
        if (!$('.text .bracket').is('.editor-hidden')) toggleBrackets('.text', 'bracket');
    } else if (type === 'crossed' && view === 'editor-view') {
        if ($('.text .bracket').is('.editor-hidden')) toggleBrackets('.text', 'bracket');
    }

    $('[data-type=' + type + ']').removeClass("active");
    element.addClass('active');

    $('.' + type).removeClass(classes).addClass(view);

    $('[data-toggle="tooltip"]').tooltip();
}

function toggleBrackets(selector, type) {
    /*var className = '"editor-hidden ' + type + '"';
    var regex;
    var textTypeClass;
    var start;
    switch (type) {
        case "bracket" :
            textTypeClass = '.crossed';
            regex = /([\[\]])/g;
            start = '[';
            break;
        case "brace" :
            textTypeClass = '.inscribed';
            regex = /([{}])/g;
            start = '{';
            break;
    }
    $(selector + ' ' + textTypeClass).each(function (index) {
        var contents = $(this).html();
        if (contents.startsWith(start)) {
            //console.log($(this).html(contents.substring(1, contents.length - 1)));
            $(this).html(contents.replace(regex, '<span class=' + className + '>$1</span>'));
        }
        if ($(this).has(textTypeClass)) trimBraces('#' + $(this).attr('id'));
    });*/

    $(selector + ' .' + type).toggleClass('editor-hidden');
}