jQuery(document).ready(function ($) {

    $('.text').each(function () {
        var text = $(this).html().replace(/\[([0-9]+)\]/g, '&#91;$1&#93;');
        var result = analyzeText(text);
        var newText = result[0];
        var structure = result[1];

        $(this).html(newText);
        //console.log(newText);
        //console.log(structure);
    });

    //--------------------------------------------------------------------
    //------------- "Сложные" фрагменты ----------------------------------

    var complexFragmentLevel = 3;	// минимальный уровень вложенности "сложных" фрагментов, подлежащих разбору и анимированному показу
    var activeComplexFragmentHTML = '';	// в этой переменной будем запоминать исходный HTML "сложного" фрагмента, из которого при показе временно удалим редакторскую маркировку

    //----- Анализ "сложных" фрагментов и формирование массивов команд для будущей навигации

    var complexFragmentActions = [];

    // рекурсия по родительскому фрагменту:
    function complexFragment(id, N) {
        var fr = "$(this).parents('.text').find('#" + id + "')";	//NB! Теперь команды сформированы с учётом родителя класса .text (10.11.2017)

        var crossedNoTrail = false;
        $('#' + id).children('.crossed').each(function () {
            if (!$(this).hasClass('trail')) crossedNoTrail = true;
        });

        if (crossedNoTrail)
            complexFragmentActions[N].push(fr + ".children('.crossed').each(function(i,el){if(!$(el).hasClass('trail')) $(this).addClass('crossed-view')})");

        if ($('#' + id).children('.inscribed').length > 0)
        //complexFragmentActions[N].push(fr + ".children('.inscribed').addClass('inscribed-view')");
            complexFragmentActions[N].push(fr + ".children('.inscribed').fadeIn('slow');");

        $('#' + id).children('.trail').each(function (i, el) {
            complexFragment($(el).attr('id'), N)
        });

        if ($('#' + id).hasClass('crossed'))
            complexFragmentActions[N].push(fr + ".addClass('crossed-view')");
    }

    //----- END Анализ "сложных" фрагментов и формирование массивов команд для будущей навигации

    //----- Нашли "сложные" фрагменты и добавили маркеры
    $('.level1').each(function (i) {
        if ($(this).find('.level' + complexFragmentLevel).length == 0)
            return;

        $(this).addClass('complex');
        $(this).before('<span class="complexFragmentMarker">&#9658;</span>&nbsp;<span class="complexFragmentNav""></span>');
    });

    //----- Показ/скрытие маркеров "сложных" фрагментов
    $('.toggle-animation').click(function () {
        restoreEditorMarkers();
        $('.complexFragmentMarker').toggle();
        $('.complexFragmentNav').hide();
        $('.complex').toggleClass('complex-higlight');
        $('*').removeClass('pale');
        $('*').removeClass('bright');
        $('*').removeClass('go-active');
        //$('*').removeClass('inscribed-view-init');
        //$('.inscribed-view').hide();
        $('.inscribed').show();
        //$('*').removeClass('inscribed-view');
        //$('*').removeClass('crossed-view-init');
        $('*').removeClass('crossed-view');
    });

    //----- Нашли в "сложных" фрагментах потомков, имеющих внутреннюю структуру
    $('.complex .fragment .fragment').each(function () {
        $(this).parent('.fragment').addClass('trail')	// добавили класс trail
    });

    //----- Сформировали команды для навигации по "сложным" фрагментам
    //	При этом используется ранее объявленные массив команд complexFragmentActions и функция complexFragment()
    $('.complex').each(function (i) {
        complexFragmentActions.push([]);
        complexFragment($(this).attr('id'), i);
    });

    // К этому моменту в массиве complexFragmentActions находятся все нужные для дальнейшего использования команды, обеспечивающие навигацию при просмотре "сложных" фрагментов
    console.log(complexFragmentActions);

    //----- Добавили навигацию по "сложным" фрагментам
    $('.complex').each(function (N) {
        for (var i = 0; i < complexFragmentActions[N].length; i++)
            $(this).prev('.complexFragmentNav').append('<span class="go" rel="' + N + '">' + i + '</span> ')
    });

    //----- Функция, возвращающая редакторскую маркировку (вычеркнуто/вписано) предыдущему просмотренному "сложному" фрагменту и демаркирующая его как "активный"
    //	вызывается при выборе иного "сложного" фрагмента, при переключении показа "сложных" фрагментов, ...
    function restoreEditorMarkers() {
        $('.activeFragment').html(activeComplexFragmentHTML);
        $('*').removeClass('activeFragment');
    }

    //----- Click по маркеру "сложного" фрагмента
    $('.complexFragmentMarker').click(function () {
        $('.complexFragmentNav').hide();
        $(this).next('.complexFragmentNav').show();

        $(this).parents('.text').addClass('pale');
        $('*').removeClass('bright');

        restoreEditorMarkers();
        var activeFragment = $(this).next('.complexFragmentNav').next('.complex');

        // пометили текущий "сложный" фрагмент как "активный", запомнили и временно убрали его редакторскую маркировку (вычеркнуто/вписано):
        activeFragment.addClass('bright');
        activeFragment.addClass('activeFragment');
        activeComplexFragmentHTML = activeFragment.html();
        //console.log(activeComplexFragmentHTML)
        activeFragment.html(activeComplexFragmentHTML.replace(/\[([0-9]+)\]/g, '&#91;$1&#93;').replace(/[\[\]\{\}]/g, ''));

        $('*').removeClass('inscribed-view-init');
        $('*').removeClass('inscribed-view');
        $('.inscribed').show();

        /*$('*').removeClass('crossed-view-init');*/
        $('*').removeClass('crossed-view');

        $('.go').removeClass('go-active');
        $(this).next('.complexFragmentNav').children('.go').first().addClass('go-active');

        activeFragment.find('.inscribed').hide();
        //activeFragment.find('.crossed').addClass('crossed-view-init');
    });

    //----- Click по элементам навигации для "сложных" фрагментов
    $('.complexFragmentNav').each(function (i) {
        $(this).children('.go').each(function (j, go) {
            $(go).click(function () {
                if ($(this).hasClass('go-active')) {
                    eval(complexFragmentActions[i][j]);
                    $(this).removeClass('go-active');
                    $(this).next('.go').addClass('go-active');
                }
            })
        })
    });

    //----------------- END  "Сложные" фрагменты  ------------------------------
    //--------------------------------------------------------------------------
});

//-----------------------------------------------------------------------------------
//---------------- Анализ текста и добавление элементов DOM в соответствии с редакторскй маркировкой ---------------

function analyzeText(text) {
    var newText = text;
    var structure = {};
    var opened = [];
    var openingRegexp = /({|\[|&lt;)/g;
    var closingRegexp = /(}|\]|&gt;)/g;
    var opening;
    var closing;
    var id = 1;
    var shift = 0;
    opening = openingRegexp.exec(text);
    closing = closingRegexp.exec(text);

    while (opening !== null || closing !== null) {
        if (opening === null || opening.index > closing.index) {
            var j = opened.pop();
            structure[j]['end'] = closing.index + closing[0].length + shift;
            structure[j]['closing'] = closing[0];
            var sub = '</span>';
            newText = newText.splice(closing.index + shift + closing[0].length, 0, sub);
            shift += sub.length;
            closing = closingRegexp.exec(text);
        }
        else {
            if (opened.length) structure[opened[opened.length - 1]]["children"].push(id);
            opened.push(id);

            var spanClass;

            switch (opening[0]) {
                case "{" :
                    spanClass = "fragment inscribed level" + opened.length;
                    break;
                case "[" :
                    spanClass = "fragment crossed level" + opened.length;
                    break;
                case "&lt;" :
                    spanClass = "editor";
                    break;
            }

            var sub = '<span id="' + id + '" class="' + spanClass + '" data-lvl="' + opened.length + '">';

            newText = newText.splice(opening.index + shift, 0, sub);
            shift += sub.length;

            structure[id] = {
                start: opening.index + shift,
                end: null,
                children: [],
                opening: opening[0],
                closing: null,
                id: id++
            };

            opening = openingRegexp.exec(text);
        }
    }

    return [newText, structure];
}

//---------------- END Анализ текста и добавление узлов DOM в соответствии с редакторскй маркировкой -----------
//-----------------------------------------------------------------------------------

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function (start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}