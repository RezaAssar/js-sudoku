'use strict';

function Board (){
    this.values = null;
    this.userValues = null;
}

function Game(){
    this.board = new Board();
}

Game.prototype.new = function(){
  var game = new Game();
};

Game.prototype.init = function(){
    var _game = this;
    _game.board.ui = _game.board.ui();
    _game.board.events();

    $.getJSON('/scripts/boards.json').done(function(data){
        var b = data.boards[Math.floor(Math.random() * (data.boards.length - 1))];
        _game.board.loadData(b);
    });
};

Board.prototype.loadData = function(data){
    var _board = this,
        len = data.length;
    _board.values = data;
    _board.userValues = new Array(len);

    var num,
        amt = Math.floor((Math.random() * 10) + 20), //amount of cells to show user
        randomCell = function(){
            return Math.floor(Math.random() * len);
        },
        prevNums = [];

    while (amt > 0) {
        num = randomCell();
        if(prevNums.indexOf(num) < 0) {
            prevNums.push(num);
            _board.userValues[num] = _board.values[num];
            amt--;
        }
    }

    $(window).trigger('valuesUpdated', {
        cells : prevNums,
        initial : true
    });
};

Board.prototype.solve = function(){
    var _board = this;
    
    if(_board.userValues === _board.values) {
        alert('you win');
    } else {
        alert('you lose');
        _board.ui.showErrors();
    }
}

Board.prototype.ui = function(){

    var _board = this;

    function build(){
        var x = 0,
            y = 0,
            cell = 0,
            sectionString = '',
            boardString = '',
            digitPicker = (function(){
                var html = '';
                for (var x = 1; x <= 9;x++){
                    html += '<span class="digitBtn digitBtn' + x + '" data-value="'+ x + '"><span class="digit">' + x +  '</span></span>';
                }
                return html;
            })(),
            currentRow = 0,
            currentCol = 0,
            z = 0,
            a = 0;

        for(;x < 9;x ++){
            sectionString = '<section data-section="'+ x +'">';

            for(;y < 9;y++){
                currentRow = (Math.floor(x / 3) * 3) + (Math.floor(y / 3));
                currentCol = z + (a * 3);
                cell = (currentRow * 9) + currentCol;
                z = (z < 2) ? z + 1 : 0;
                sectionString += '<div id="'+cell+'" data-row="' + currentRow + '" data-col="' + currentCol + '" class="cell" data-idx="' + cell +'"><div class="cell-wrapper"><div class="front"><div class="front-wrapper"></div></div><div class="back">'+ digitPicker+ '</div></div></div>';
            }
            y = 0;
            a = (a < 2) ? a + 1 : 0;
            sectionString += '</section>';
            boardString += sectionString;
        }

        return boardString;

    }

    function showErrors(){
        var x = 0,
            len = _board.userValues.length;
        for(;x < len; x++) {
            if(_board.userValues[x] != _board.values[x]) {
                $('#' + x).addClass('error');
            }
        }
    }

    function update(e, data){
        var x = 0, len = data.cells.length,
            $cell, val;
        for(;x < len;x++) {
            $cell = $('#' + data.cells[x]);
            val = _board.userValues[data.cells[x]];
            $cell.addClass(data.initial ? 'initialValue' : '')
                 .find('.front-wrapper').text(val);
        }
    }

    $('#board').html(build());

    return {
        update : update,
        showErrors : showErrors
    };
};

Board.prototype.events = function(){
    var _board = this,
        img = $('img').get(0),
        activeEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

    function onResize() {
        //hack to make sure the browser repaints inline-block on resize
        img.style.display = 'none';
        img.offsetHeight;
        img.style.display = 'block';
        $('img').css('height', '100%');
    }

    function newGame(){
        location.reload();
    }

    function onTileClick(e){
        var $t = $(e.currentTarget);
        if(!$t.hasClass('initialValue')) {
            if (!$t.hasClass('active')) {
                $('.active').removeClass('active');
                $t.addClass('active');
            } else {
                $('.active').removeClass('active');
            }
        }
    }

    function onNumberSelect(e){
        var $t = $(e.currentTarget),
            $cell = $t.parents('.cell');

        if(!$t.hasClass('disabled')) {
            var cellIdx = parseFloat($cell.attr('data-idx'));
            _board.userValues[cellIdx] = $t.data('value');
            $(window).trigger('valuesUpdated', {cells:[cellIdx]});
        }
    }

    $('.cell').on(activeEvent, onTileClick);
    $('.digitBtn').on(activeEvent, onNumberSelect);
    $('#btnSolve').on(activeEvent, function(){_board.solve()});
    $('#btnNewGame').on(activeEvent, newGame)
    $(window).on('resize', onResize)
        .on('valuesUpdated', _board.ui.update);

};




