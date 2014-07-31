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
        alert('Congratulations, you win!');
    } else {
        alert('Sorry, you have some mistakes.');
        _board.ui.showErrors();
    }
}

Board.prototype.ui = function(){

    var _board = this,
        highlightedCell = null;

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

        $('.cell').removeClass('error');
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

    function hightlightCell(idx, isMouseEvent){
        if(highlightedCell === null) {
            highlightedCell = isMouseEvent ? idx : 0;
        } else if (isMouseEvent) {
            highlightedCell = idx;
        } else {
            highlightedCell += idx;
            if(highlightedCell > 80 || highlightedCell < 0) {
                highlightedCell -= idx;
            }
        }

        $('.cell.selected').removeClass('selected');
        $('#' + highlightedCell).addClass('selected');
    }

    $('#board').html(build());

    return {
        update : update,
        showErrors : showErrors,
        hightlightCell : function(idx, isMouseEvent){
            hightlightCell(idx, isMouseEvent)
        },
        selectCell : function() {
            if(highlightedCell !== null) {
                $('#' + highlightedCell).click();
            }
        },
        selectDigit : function(digit){
            if(highlightedCell !== null) {
                $('#' + highlightedCell).click().find('.digitBtn' + digit).click();
            }
        }
    }
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

    function onKeyDown(e){
        var event = window.event ? window.event : e,
            key = event.keyCode,
            moveAmt;

        if(key > 36 && key < 41) {
            switch(key) {
                case 37:
                    moveAmt = -1
                    break;
                case 38:
                    moveAmt = -9
                    break;
                case 39:
                    moveAmt = 1
                    break;
                case 40:
                    moveAmt = 9
                    break;
                default:
                    moveAmt = 0;
            }
            _board.ui.hightlightCell(moveAmt);
        } else if (key === 13) {
            _board.ui.selectCell();
        } else if (key == 49 || key == 97){
            _board.ui.selectDigit(1);
        } else if (key == 50 || key == 98){
            _board.ui.selectDigit(2);
        } else if (key == 51 || key == 99){
            _board.ui.selectDigit(3);
        } else if (key == 52 || key == 100){
            _board.ui.selectDigit(4);
        } else if (key == 53 || key == 101){
            _board.ui.selectDigit(5);
        } else if (key == 54 || key == 102){
            _board.ui.selectDigit(6);
        } else if (key == 55 || key == 103){
            _board.ui.selectDigit(7);
        } else if (key == 56 || key == 104){
            _board.ui.selectDigit(8);
        } else if (key == 57 || key == 105){
            _board.ui.selectDigit(9);
        }
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
            _board.ui.hightlightCell(parseFloat($t.attr('id')), true);
        }
    }

    function onNumberSelect(e){
        var $t = $(e.currentTarget),
            $cell = $t.parents('.cell');

        if(!$cell.hasClass('initialValue')) {
            var cellIdx = parseFloat($cell.attr('data-idx'));
            _board.userValues[cellIdx] = $t.data('value');
            $(window).trigger('valuesUpdated', {cells:[cellIdx]});
        }
    }

    $('.cell').on(activeEvent, onTileClick);
    $('.digitBtn').on(activeEvent, onNumberSelect);
    $('#btnSolve').on(activeEvent, function(){_board.solve()});
    $('#btnNewGame').on(activeEvent, newGame);
    $(window).on('resize', onResize)
        .on('valuesUpdated', _board.ui.update)
        .on('keydown', onKeyDown);

};




