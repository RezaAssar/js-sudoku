
function Game(){
  this.board = new Board();
};

Game.prototype.init = function(){
  var _game = this;
  _game.board.ui = _game.board.ui();
  _game.board.events();

  $.getJSON('/scripts/boards.json').done(function(data){
      b = data.boards[Math.floor(Math.random() * (data.boards.length - 1))];
    _game.board.loadData(b);
  });
};

function Board (){
    this.values = [];
    this.userValues = [];
};

Board.prototype.loadData = function(data){
  var _board = this;
  _board.values = data;
  $(window).trigger('valuesUpdated', {
      cells : [5, 10, 16],
      initial : true
    });
};

Board.prototype.ui = function(){
    var x = 0,
        y = 0,
        cell = 0,
        $cells,
        section_string = '',
        board_string = '',
        digitPicker = function(){
            var html = '';
            for (var x = 1; x <= 9;x++){
                html += '<span class="digitBtn digitBtn' + x + '" data-value="'+ x + '"><span class="digit">' + x +  '</span></span>';
            }
            return html;
        },
        current_row = 0,
        current_col = 0,
        current_sec = 0,
        z = 0,
        a = 0,
        _board = this;

    function update(e, data){
        var x = 0, len = data.cells.length;
        console.log(data.cells)
        console.log(data.initial)
        for(;x < len;x++) {
            console.log(data.cells[x]);
            $cells.eq(data.cells[x])
                /*.addClass(initial ? 'intialValue' : '')*/
                .find('.front-wrapper').text(_board.userValues[data.cells[x]]);
        }
    }

    for(;x < 9;x ++){
        section_string = '<section>';
        current_sec = x;
        for(;y < 9;y++){
            current_row = (Math.floor(x / 3) * 3) + (Math.floor(y / 3));
            current_col = z + (a * 3);
            z = (z < 2) ? z + 1 : 0;
            section_string += '<div id="'+cell+'" class="tile" data-idx="' + cell +'"><div class="tile-wrapper"><div class="front"><div class="front-wrapper"></div></div><div class="back">'+ digitPicker() + '</div></div></div>';
            cell++;
        }
        y = 0;
        a = (a < 2) ? a + 1 : 0;
        section_string += '</section>';
        board_string += section_string;
    }

    $('#board').html(board_string);
    $cells = $('.tile');
    return {
        update : update
    }
};

Board.prototype.events = function(){
    var _board = this,
        active_event = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

    function onResize() {
        $('#wrapper').css('width', $('img').width());
    };

    function onTileClick(e){
        var $t = $(e.currentTarget);
        if(!$t.hasClass('active')){
            $('.active').removeClass('active');
            $t.addClass('active');
        } else {
            $('.active').removeClass('active');
        }
    }

    function onNumberSelect(e){
        var $t = $(e.currentTarget),
            $tile = $t.parents('.tile');

        if(!$t.hasClass('disabled')) {
            var cellIdx = parseFloat($tile.attr('data-idx'));
            _board.userValues[cellIdx] = $t.data('value');
            $(window).trigger('valuesUpdated', [cellIdx]);
        }
    };

    $('.tile').on(active_event, onTileClick);
    $('.digitBtn').on(active_event, onNumberSelect);
    $(window).on('resize', onResize)
             .on('valuesUpdated', _board.ui.update);

};




