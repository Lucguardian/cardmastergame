angular.module('cmg', []).controller('GameController', ['$scope', function($scope) {
	
	//Draw the board game
    $scope.size = 4;
    $scope.widths = [];

    //Draw board
    for(var i = 0; i < $scope.size; i++) { 
        $scope.widths.push(i);
    }


}]);


$(document).ready(function() {   
    var themes = [
        {
            name: 'CLASSIC',
            boardBorderColor: '#666',
            lightBoxColor: 'transparent',
            darkBoxColor: 'transparent',
            optionColor: '#000',
            optionHoverColor: '#999'
        },
        {   
            name: 'WOOD',
            boardBorderColor: '##803E04',
            lightBoxColor: 'transparent',
            darkBoxColor: 'transparent',
            optionColor: '#803E04',
            optionHoverColor: '#311B0B'
        },
        {
            name: 'OCEAN',
            boardBorderColor: '#023850',
            lightBoxColor: '#fff',
            darkBoxColor: '#0A85AE',
            optionColor: '#023850',
            optionHoverColor: '#3385ff'
        },
        {
            name: 'FOREST',
            boardBorderColor: '#005900',
            lightBoxColor: '#CAC782',
            darkBoxColor: '#008C00',
            optionColor: '#005900',
            optionHoverColor: '#0c0'
        },
        {
            name: 'BLOOD',
            boardBorderColor: '#f3f3f3',
            lightBoxColor: '#f3f3f3',
            darkBoxColor: '#f00',
            optionColor: '#f00',
            optionHoverColor: '#f99'
        }
    ];
    
    var colors = [
        {
            name: 'BLACK',
            color: '#000'
        }, 
        {
            name: 'GREEN',
            color: '#030'
        }, 
        {
            name: 'BLUE',
            color: '#036'
        }, 
        {
            name: 'PINK',
            color: '#606'
        }, 
        {
            name: 'BROWN',
            color: '#630'
        }
    ];
    
    var colorOption = 0;
    var themeOption = 1;
    
    //Change theme
    $('#theme-option').on('click', function() {
        themeOption === themes.length - 1 ? themeOption = 0 : themeOption++;
        
        setTheme();
    });
    
    //Set up theme
    var setTheme = function() {
        var theme = themes[themeOption];
        
        $('#theme-option').html(theme.name);
        
        $('#board').css('border-color', theme.boardBorderColor);
        $('.light-box').css('background', theme.lightBoxColor);
        $('.dark-box').css('background', theme.darkBoxColor);
        
        $('.option-nav').css('color', theme.optionColor);
        
        //Option button effect
        $('#option').css('color', theme.optionColor);
        $('#option').hover(
            function() {
                $(this).css('color', theme.optionHoverColor);
            }, function() {
                $(this).css('color', theme.optionColor);
            }
        );
        
        //Undo button effect
        $('#undo-btn').css('color', theme.optionColor);
        $('#undo-btn').hover(
            function() {
                $(this).css('color', theme.optionHoverColor);
            }, function() {
                $(this).css('color', theme.optionColor);
            }
        );
        
        //Option Menu effect
        $('#option-menu').css('color', theme.optionColor);
        $('.button').css('color', theme.optionColor);
        $('.button').hover(
            function() {
                $(this).css('color', theme.optionHoverColor);
            }, function() {
                $(this).css('color', theme.optionColor);
            }
        );
    }
    
    //Change color
    $('#color-option').on('click', function() {
       colorOption === colors.length - 1 ? colorOption = 0 : colorOption++;
        
        setColor();
    });
    
    //Set up color for chess cartas
    var setColor = function() {
        var color = colors[colorOption];
        
        $('#color-option').html(color.name);
        
        $('.box').css('color', color['color']);
        
        $('#pawn-promotion-option').css('color', color['color']);
        
        $('#player').css('color', color['color']);
    }
	 
	 //=====GLOBAL VARIABLES=========//

	//Cartas
	var cartasCM = {
		 'blue': {
			  'king': '2',
			  'queen': '&#9813;',
			  'rook': '&#9814;',
			  'bishop': '&#9815;',
			  'knight': '&#9816;',
			  'pawn': '&#9817;'
		 },
		 'red': {
			  'king': '1',
			  'queen': '&#9819;',
			  'rook': '&#9820;',
			  'bishop': '&#9821;',
			  'knight': '&#9822;',
			  'pawn': '&#9823;'
		 }
	};

	var player = 'red'; //First player

	//Selected card to move
	var select = {
		 canMove: false, //Ready to move of not
		 carta: '',      //Color, type of the carta
		 box: ''         //Position of the carta
	}

	//Game's history (cards + positions)
	var historyMoves = [];

	//Position and color of pawn promotion
	var promotion = {};

	//Set up board game
	$(function() {		 
		$('#player').html(cartasCM.red.king);


	    //Set up color for boxes, cards
		 for (var y = 0; y < 1; y++) {
		     for (var x = 0; x < 8; x++) {
		         var box = $('#box-R01-' + x + '-' + y);
                 box.addClass('ng-scope');
		         r = 1;
		         setNewBoard(box, x, y, r); //Set up all cards
		     }
		 }
		 for (var y = 0; y < 1; y++) {
		     for (var x = 0; x < 8; x++) {
                 var box = $('#box-R02-' + x + '-' + y);
                 box.addClass('ng-scope');
		         r = 2;
                 setNewBoard(box, x, y, r); //Set up all cards
		     }
		 }
		 setColor();
		 setTheme();
	});

	//==============CLICK EVENTS==================//

		$(function() {
			 //Option menu
			 $('#option').on('click', function() {
				  if($('#option-menu').hasClass('hide')) {
						$('#game').css('opacity', '0.3');
						$('#option-menu').removeClass('hide');
				  } else {
						$('#game').css('opacity', '1');
						$('#option-menu').addClass('hide');
				  }
			 });

			 //Back button
			 //Return to game
			 $('#back-btn').on('click', function() {
				  $('#option-menu').addClass('hide');
				  $('#game').css('opacity', '1');
			 });
			
		 //Undo button 
		 $('#undo-btn').on('click', function() {
			  if(historyMoves.length === 0) {
					return;
			  }

			  var move = historyMoves.pop();

			  var previous = move.previous;        
			  setCard($('#' + previous.box), previous.carta.split('-')[0], previous.carta.split('-')[1]);

			  var current = move.current;
			  if(current.carta === '') {
					var currentBox = $('#' + current.box);
					currentBox.html('');
					currentBox.attr('carta', '');
					currentBox.removeClass('placed');
			  } else {
					setCard($('#' + current.box), current.carta.split('-')[0], current.carta.split('-')[1]);
			  }

			  //Reset all changes
			  $('.box').removeClass('selected');
			  $('.box').removeClass('suggest');

			  switchPlayer();

			  select = { canMove: false, carta: '', box: '' };
		 });

		 //Reset game
		 $('#restart-btn').on('click', function() {
			  resetGame(); 
		 });

		 //Restart when game over
		 $('#result').on('click', function() {
			  resetGame();
		 });

		 //Box click event
		 $('.box').on('click', function() {
			  if($(this).hasClass('selected')) { //Undo to select new box
					$(this).removeClass('selected');

					$('.box').removeClass('suggest');
					select = { canMove: false, carta: '', box: '' };
					return;
			  }

			  //Select new box
			  if(!select.canMove) {
					//Check the right color to play
					if($(this).attr('carta').indexOf(player) >= 0) {
						 //Select a carta to move
						 selectCard($(this));
					}
			  }

			  //Set up new destination for selected box
			  else if(select.canMove) { 
					var selectedCardInfo = select.carta.split('-');
					var color = selectedCardInfo[0];
					var type = selectedCardInfo[1];

					//Select new carta to move if 2 colors are the same
					if($(this).attr('carta').indexOf(color) >= 0) {
						 $('#' + select.box).removeClass('selected');
						 $('.box').removeClass('suggest');
						 //Select a carta to move
						 selectCard($(this));
						 return;
					}

					//Can move if it is valid
					if($(this).hasClass('suggest')) { 

						 //Save move in history
						 var move = {
							  previous: {},
							  current: {}
						 }

						 move.previous.carta = select.carta;
						 move.previous.box = select.box;

						 move.current.carta = $(this).attr('carta');
						 move.current.box = $(this).attr('id');

						 historyMoves.push( move ); //max 16

						 //Move selected carta successfully
						 setCard($(this), color, type);

						 //Delete moved box
						 deleteBox($('#' + select.box));

						 $('.box').removeClass('suggest');

						 select = { canMove: false, carta: '', box: '' };

						 //Switch player
						 switchPlayer();
					}
			  }
		 });
	});

	//Get card and position of the selected card
	var selectCard = function(box) {
		 box.addClass('selected');
		 select.box = box.attr('id');
		 select.carta = box.attr('carta');
		 select.canMove = true;

		 suggestNextMoves(getNextMoves());
	}

	//CALCULATE VALID MOVES=======//

	//Returns possible moves of the selected card
	var getNextMoves = function() {
        var nextMoves = [];

        //all boxes on board
        var moves = [
            [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3],
            [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3]
        ];
        nextMoves = getCardMoves(0, 0, moves); //search for possible places

        return nextMoves; //return possible places
    }

    //return possible moves
    var getCardMoves = function (i, j, moves) {
        var nextMoves = [];
        for (var index = 0; index < moves.length; index++) {
            var tI = i + moves[index][0];
            var tJ = j + moves[index][1];
            if (!outOfBounds(tI, tJ)) {
                var box = $('#box-' + tI + '-' + tJ);
                if (box.attr('carta') == '') {
                    nextMoves.push([tI, tJ]);
                }
            }
            else {
                console.log(tI + '-' + tJ);
            }
        }
        return nextMoves;
    }

	//Check if position i, j is in the board game
	var outOfBounds = function(i, j) {
		 return ( i < 0 || i >= 4 || j < 0 || j >= 4 );
	}

	//Show possible moves by add suggestion to boxes
	var suggestNextMoves = function(nextMoves) {
		 for(var move of nextMoves) {
              var box = $('#box-' + move[0] + '-' + move[1]);
			  box.addClass('suggest');
		 }
	}

	//=============================================//

	//Set up card for clicked box
	var setCard = function(box, color, type) {
        //Verify if game is over (16 moves)
        if (historyMoves.length == 16) {
            countRed = 0;
            countBlue = 0;
            //scan board for color count
            for (var y = 0; y < 4; y++) {
                for (var x = 0; x < 4; x++) {
                    if ($('#box-' + x + '-' + y).attr('carta').split('-')[0] == 'red') {
                        countRed += 1;
                    } else if ($('#box-' + x + '-' + y).attr('carta').split('-')[0] == 'blue') {
                        countBlue += 1;
                    }
                }
            }

            if (countRed > countBlue) {
                showWinner('red');
            } else if (countBlue > contred) {
                showWinner('blue');
            } else {
                showWinner('DRAW');
            }

            box.html(cards[color][type]);
            box.addClass('placed');
            box.attr('carta', color + '-' + type);

            return;
        }

        //Define background-image
        if (type === 'pawn' && color === 'red') {
            box.attr('style', 'background-image: url(\'cards/card-anao-guerreiro-red.jpg\'); background-size: cover;');
        } else if (type === 'pawn' && color === 'blue') {
            box.attr('style', 'background-image: url(\'cards/card-anao-guerreiro-cian.jpg\'); background-size: cover;');
        } else if (type === 'knight' && color === 'red') {
            box.attr('style', 'background-image: url(\'cards/card-elfo-paladino-red.jpg\'); background-size: cover;');
        } else if (type === 'knight' && color === 'blue') {
            box.attr('style', 'background-image: url(\'cards/card-elfo-paladino-cian.jpg\'); background-size: cover;');
        }

        box.html(cartasCM[color][type]);
        box.addClass('placed');
        box.attr('carta', color + '-' + type);

    }

	//Delete selected element
    var deleteBox = function (box) {
		box.removeClass('placed');
		box.removeClass('selected');
		box.removeClass('suggest');
		box.html('');
        box.attr('carta', '');
        box.attr('style', ''); //remove image from empty box
	}

    //Random initial cards
    var setNewBoard = function (box, i, j, r) {
        if (r === 2) {
            if (i === 0) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            } else if (i === 1) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            } else if (i === 2) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            } else if (i === 3) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            } else if (i === 4) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            } else if (i === 5) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            } else if (i === 6) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            } else if (i === 7) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'blue', cardName);
            }
        } else if (r === 1) {
            if (i === 0) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            } else if (i === 1) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            } else if (i === 2) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            } else if (i === 3) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            } else if (i === 4) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            } else if (i === 5) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            } else if (i === 6) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            } else if (i === 7) {
                cardNum = Math.floor((Math.random() * 6) + 1);
                if (cardNum === 1) {
                    cardName = 'pawn';
                } else if (cardNum === 2) {
                    cardName = 'rook';
                } else if (cardNum === 3) {
                    cardName = 'bishop';
                } else if (cardNum === 4) {
                    cardName = 'knight';
                } else if (cardNum === 5) {
                    cardName = 'queen';
                } else if (cardNum === 6) {
                    cardName = 'king';
                }
                setCard(box, 'red', cardName);
            }
        }
    }

	//Switch player
	var switchPlayer = function() {
		 if(player === 'red') {
			  $('#player').html(cartasCM.blue.king);
			  player = 'blue';
		 } else {
			  $('#player').html(cartasCM.red.king);
			  player = 'red';
		 }
	}

	//Restart game
	var resetGame = function() {
		 deleteBox($('.box'));
		 $('#player').html(cartasCM.red.king);
		 $('#result').addClass('hide');
		 $('#option-menu').addClass('hide');
		 $('#game').css('opacity', '1');

         //Set up color for boxes, cards
         for (var y = 0; y < 1; y++) {
             for (var x = 0; x < 8; x++) {
                 var box = $('#box-R01-' + x + '-' + y);
                 box.addClass('ng-scope');
                 r = 1;
                 setNewBoard(box, x, y, r); //Set up player 1 cards
             }
         }
         for (var y = 0; y < 1; y++) {
             for (var x = 0; x < 8; x++) {
                 var box = $('#box-R02-' + x + '-' + y);
                 box.addClass('ng-scope');
                 r = 2;
                 setNewBoard(box, x, y, r); //Set up all player 2 cards
             }
         }


		 //Set global variables to default
		 player = 'red';
		 select = {
			  canMove: false,
			  carta: '',
			  box: ''
		 };

		 historyMoves = [];
	}

	//Announce the winner
	var showWinner = function(winner) {

		 historyMoves = [];

		 setTimeout(function() {
			  if(winner === 'DRAW') { //Game is draw
					$('#result').css('color', '#000');
					$('#result').html('EMPATE');
			  } else { //There is a winner
					$('#result').css('color', winner + '');
                    $('#result').html(cartasCM[winner].king + ' ganhou!');
			  }
			  $('#result').removeClass('hide');
			  $('#game').css('opacity', '0.5');
		 }, 1000);
	}
    
});