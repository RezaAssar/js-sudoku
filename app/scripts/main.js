var sudoku = sudoku || {};

(function(){
    var x = 0,
        y = 0,
        cell = 0,
        section_string = '',
        board_string = '',
        backHTML = generateBackHtml(),
        current_row = 0,
        current_col = 0,
        current_sec = 0,
        z = 0,
        a = 0,
        rows = [],
        cols = [],
        secs = [];

    for(;x < 9;x ++){
        section_string = '<section>';
        current_sec = x;
        for(;y < 9;y++){
            current_row = (Math.floor(x / 3) * 3) + (Math.floor(y / 3));
            current_col = z + (a * 3);
            z = (z < 2) ? z + 1 : 0;
            section_string += '<div data-row="' + current_row + '" data-col="' + current_col + '" data-sec="' + current_sec + '" class="tile" id="cell' + cell +'"><div class="tile-wrapper"><div class="front"></div><div class="back">'+ backHTML + '</div></div></div>';
            cell++;
        }
        y = 0;
        a = (a < 2) ? a + 1 : 0;
        section_string += '</section>';
        board_string += section_string;
    }

    $('#board').html(board_string);
    $('#wrapper').css('width', $('img').width());

    for (var c = 0; c < 9; c++){
        rows[c] = $(".tile[data-row='" + c +"']");
        cols[c] = $('.tile[data-col="' + c +'"]');
        secs[c] = $('.tile[data-sec="' + c +'"]');
    };

    $('.digitBtn').click(function(){
       var $t = $(this);
       if(!$t.hasClass('disabled')) {
           var val = $t.data('value'),
               tile = $t.parents('.tile'),
               cur_row = parseFloat(tile.data('row')),
               cur_sec = parseFloat(tile.data('sec')),
               cur_col = parseFloat(tile.data('col'));

           rows[cur_row].each(function(){
               $(this).find('.digitBtn' + val).addClass('disabled');
           });

           cols[cur_col].each(function(){
               $(this).find('.digitBtn' + val).addClass('disabled');
           });

           secs[cur_sec].each(function(){
               $(this).find('.digitBtn' + val).addClass('disabled');
           });
           tile.find('.front').text(val);
       }
    });

})();



function generateBackHtml(){
    var html = '';
    for (var x = 1; x <= 9;x++){
        html += '<span class="digitBtn digitBtn' + x + '" data-value="'+ x + '"><span class="digit">' + x +  '</span></span>';
    }
    return html;
}
