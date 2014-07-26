var sudoku = sudoku || {};

(function(){
    var x = 0,
        y = 0,
        section_string = '',
        board_string = '';

    for(;x < 9;x ++){
        section_string = '<section>';
        for(;y < 9;y++){
            section_string += '<div class="tile"><div class="tile-wrapper"><div class="front"></div><div class="back"></div></div></div>';
        }
        y = 0;
        section_string += '</section>'
        board_string += section_string;
    }
    $('#board').html(board_string);
})();