function Game(){
  this.board = new Board();
};

Game.prototype.init = function(){
  this.board.generate();
  this.board.userEvents();
  for (var c = 0; c < 9; c++){
    this.board.rows[c] = $(".tile[data-row='" + c +"']");
    this.board.cols[c] = $('.tile[data-col="' + c +'"]');
    this.board.secs[c] = $('.tile[data-sec="' + c +'"]');
  };
};

function Board (){
    this.rows = [];
    this.cols = [];
    this.secs = [];
    this.tileValues = [];
};

Board.prototype.generate = function(){
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
        _board = this;

    function generateBackHtml(){
        var html = '';
        for (var x = 1; x <= 9;x++){
            html += '<span class="digitBtn digitBtn' + x + '" data-value="'+ x + '"><span class="digit">' + x +  '</span></span>';
        }
        return html;
    }

    for(;x < 9;x ++){
        section_string = '<section>';
        current_sec = x;
        for(;y < 9;y++){
            current_row = (Math.floor(x / 3) * 3) + (Math.floor(y / 3));
            current_col = z + (a * 3);
            z = (z < 2) ? z + 1 : 0;
            section_string += '<div data-row="' + current_row + '" data-col="' + current_col + '" data-sec="' + current_sec + '" class="tile" data-idx="' + cell +'"><div class="tile-wrapper"><div class="front"><div class="front-wrapper"></div></div><div class="back">'+ backHTML + '</div></div></div>';
            cell++;
            _board.tileValues.push(null);
        }
        y = 0;
        a = (a < 2) ? a + 1 : 0;
        section_string += '</section>';
        board_string += section_string;
    }

    $('#board').html(board_string);
};

Board.prototype.userEvents = function(){
    var _board = this,
        active_event = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

    function removeFrom(type, idx, val) {
        _board[type][idx].each(function(){
            $(this).find('.digitBtn' + val).addClass('disabled');
        });
    };

    function addTo(type, idx, val){
        _board[type][idx].each(function(){
            $(this).find('.digitBtn' + val).addClass('disabled');
        });
    }

    function onResize() {
        $('#wrapper').css('width', $('img').width());
    };

    function onBoardChange(evt) {
      if(_board.tileValues[evt.idx] == null) {
            removeFrom('rows', evt.cur_row, evt.val);
            removeFrom('cols', evt.cur_col, evt.val);
            removeFrom('secs', evt.cur_sec, evt.val);
            _board.tileValues[evt.idx] = evt.val;
            evt.$tile.find('.front-wrapper').text(evt.val);
      } else {
          addTo('rows', evt.cur_row, evt.val);
          addTo('cols', evt.cur_col, evt.val);
          addTo('secs', evt.cur_sec, evt.val);
      }
    };

    $('.tile').on(active_event, function(){
       var $t = $(this);

        if(!$t.hasClass('active')){
            $('.active').removeClass('active');
            $t.addClass('active');
        } else {
            $('.active').removeClass('active');
        }
    });

    $('.digitBtn').on(active_event, function(){
        var $t = $(this),
            $tile = $t.parents('.tile');

        if(!$t.hasClass('disabled')) {
            data = {
                $el: $t,
                idx: parseFloat($tile.attr('data-idx')),
                val: $t.data('value'),
                $tile: $tile,
                cur_row: parseFloat($tile.data('row')),
                cur_sec: parseFloat($tile.data('sec')),
                cur_col: parseFloat($tile.data('col'))
            };
            onBoardChange(data);
        }
    });

    $(window).on('resize', function(){
       onResize();
    });

};




