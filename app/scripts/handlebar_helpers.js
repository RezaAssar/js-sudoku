//Handelbars.registerHelper('for', function(from, to, incr, block) {
//
//    var x = 0,
//        y = 0,
//        z = 0,
//        a = 0;
//        cell = 0,
//        section_string = '',
//        board_string = '',
//        digitPicker = (function(){
//            var html = '';
//            for (var x = 1; x <= 9;x++){
//                html += '<span class="digitBtn digitBtn' + x + '" data-value="'+ x + '"><span class="digit">' + x +  '</span></span>';
//            }
//            return html;
//        })(),
//        current_row = 0,
//        current_col = 0,
//        current_sec = 0;
//
//
//    for(;x < 9;x ++){
//        section_string = '<section>';
//        current_sec = x;
//        for(;y < 9;y++){
//            current_row = (Math.floor(x / 3) * 3) + (Math.floor(y / 3));
//            current_col = z + (a * 3);
//            z = (z < 2) ? z + 1 : 0;
//            section_string += '<div id="'+cell+'" class="tile" data-idx="' + cell +'"><div class="tile-wrapper"><div class="front"><div class="front-wrapper"></div></div><div class="back">'+ digitPicker() + '</div></div></div>';
//            cell++;
//        }
//        y = 0;
//        a = (a < 2) ? a + 1 : 0;
//        section_string += '</section>';
//        board_string += section_string;
//    }
//
//    return board_string;
//});