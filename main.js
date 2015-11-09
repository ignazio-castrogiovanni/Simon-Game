(function() {
  'use strict';

  var movesPattern = [];
  var teachingTime, currentPatternIndex, currentLevel;
  initVars();

  var userTime = 10000;
  var padIds = ['redPad', 'greenPad', 'bluePad', 'yellowPad'];
  var userEnabled = true;
  var userTimeout;


  var board = document.getElementById('board');


  board.addEventListener('mousedown', onButtonPressed);
  board.addEventListener('mouseup', onButtonPressed);

function initVars() {
    console.log("initVars");
    movesPattern = [];
    teachingTime = 2500;
    currentPatternIndex = 0;
    currentLevel = 0;
}

  function onButtonPressed(e) {
    console.log("onButtonPressed");
    if(!userEnabled) {
      return;
    }
    var SVGPath = e.target;
    if (SVGPath.id === 'start') {
      startGame();
    } else { // Pad pressed
      var SVGElemClasses = SVGPath.classList;
      if(SVGElemClasses.contains('clickable'))
      changePadColor(SVGPath);

      if(e.type === "mousedown") {
        if(movesPattern[currentPatternIndex] === padIds.indexOf(SVGPath.id)) {
          // OK right move - Restart the timeout
          clearTimeout(userTimeout);
          userTimeout = setTimeout(function(){
            alert('fail');
            loopGame(null);
          }, userTime);

          if (currentPatternIndex === movesPattern.length - 1) {
            increaseAndCheckLevel();

            setTimeout(function () {
              //      Choose a new move and loop game with the new move.
              var nextMove = Math.floor(Math.random() * 4);
              loopGame(nextMove);
            }, teachingTime);
          }
          // Increase currentPatternIndex
          currentPatternIndex = currentPatternIndex + 1;

        } else {
          // Wrong move
          //alert('Wrong move');
          showError();

          // Clear timeout
          clearTimeout(userTimeout);

          // Reinitiliase variables
          initVars();

          // Restart loop
          loopGame(null);
        }
      }
    }
     }

  function changePadColor(SVGPath) {
    console.log("changePadColor");
    var newColor;
    var pathId = SVGPath.getAttribute('id');
    var isOn = SVGPath.getAttribute('ison');
    switch (pathId) {
      case 'redPad':
        newColor = (isOn === 'true') ? '#7D1F00' : 'red';
      break;
      case 'greenPad':
        newColor = (isOn === 'true') ? 'green' : '#00F700';
      break;
      case 'bluePad':
        newColor = (isOn === 'true') ? '#000080' : 'blue';
      break;
      case 'yellowPad':
        newColor = (isOn === 'true') ? '#CCCC00' : 'yellow';
      break;
      default:
    }
    SVGPath.setAttribute('fill', newColor);
    if (isOn === 'true') {
      isOn = 'false';
    } else {
      isOn = 'true';
    }
    SVGPath.setAttribute('ison', isOn);
  }

  function startGame() {
    console.log("startGame");
    // Clear moves pattern
    movesPattern = [];
    var levelIndic = document.getElementById('streak');
    levelIndic.innerHTML = '00';
    // Choose the fisrt move to the moves pattern
    var firstMove = Math.floor(Math.random() * 4);
    // Loop game with first move
    loopGame(firstMove);
  }

  function loopGame(move) {
    console.log("loopGame");
    // If we have a new move
    if (move !== null) {
      // Add move to the moves pattern
      movesPattern.push(move);
    }
    // Show the moves pattern to the user
    showPattern();

    // Disable user moves until the show is on.
    userEnabled = false;

    // Wait for user moves
    //waitForUserMoves();

  }
  function waitForUserMoves() {
    console.log("waitForUserMoves");
    userTimeout = setTimeout(function(){
      alert('fail');
      loopGame(null);
    }, userTime);
  }

  function showPattern() {
    console.log("showPattern");
    // Clear timeout
    clearTimeout(userTimeout);

    currentPatternIndex = 0;
    movesPattern.forEach(function (item, index) {
      var SVGElem = document.getElementById(padIds[item]);
      setTimeout( function() {
        highlightForTeaching(SVGElem, index);
      }, teachingTime * (index + 1) + 200);
      setTimeout( function() {
        lowLightForTeaching(SVGElem, index);
      }, teachingTime * (index + 1) + 500);
  });
}

  function highlightForTeaching(SVGElem, index) {
    console.log("highlightForTeaching");
    console.log(SVGElem + " highlighted");
    changePadColor(SVGElem);
  }

  function lowLightForTeaching(SVGElem, index) {
    console.log("lowLightForTeaching");
    console.log(SVGElem + " lowlighted");
    changePadColor(SVGElem);
    if(index === movesPattern.length - 1) {
      userEnabled = true;
      waitForUserMoves();
    }
  }

  function increaseAndCheckLevel() {
    // All sequence right. INcrease level
    currentLevel = currentLevel + 1;

    // Update number of moves on the board
    var levelIndic = document.getElementById('streak');
    levelIndic.innerHTML = (currentLevel < 10) ? '0' + currentLevel : currentLevel;

    // If the level was 20. User won.  Alert and celebrate! End of the game.
    if(currentLevel > 20) {
      alert("you won!");
    } else { // Else if level is 5, 9, 13
      if ((currentLevel === 5 ) || (currentLevel === 9) || (currentLevel === 13)) {
        // Increase teaching speed.
        teachingTime = teachingTime - 500;
      }
    }
  }

  function showError() {
    // Flash all the 4 colours at the same time. Twice.
    var pads = document.getElementsByClassName('pad');
    for(var j = 0; j < 2; ++j) {
    setTimeout('highAndLowLightAll', (j + 1) * 500);
    }

    function highAndLowLightAll() {
      for (var i = 0; i < pads.length; ++i) {
        pads[i].setAttribute('ison', 'false');
        changePadColor(pads[i]);
        setTimeout(function() {
          LowLightSingle(pads[i]);
        }, 500);
      }
    }

    function LowLightSingle(pad) {
      changePadColor(pad);
    }
  }
  // TO DO - Sound
})();
