(function() {
  'use strict';

  var movesPattern = [];
  var teachingTime, currentPatternIndex, currentLevel;
  var strictMode = false;

  var userTime = 5000;
  var padIds = ['redPad', 'greenPad', 'bluePad', 'yellowPad'];
  var userEnabled = true;
  var userTimeout;

  // Sounds
  var audio1 = new Audio('sounds/simonSound1.mp3');
  var audio2 = new Audio('sounds/simonSound2.mp3');
  var audio3 = new Audio('sounds/simonSound3.mp3');
  var audio4 = new Audio('sounds/simonSound4.mp3');

  var board = document.getElementById('board');


  board.addEventListener('mousedown', onButtonPressed);
  board.addEventListener('mouseup', onButtonPressed);

function initVars() {
    console.log("initVars");
    movesPattern = [];
    teachingTime = 2500;
    currentPatternIndex = 0;
    currentLevel = 1;
}

  function onButtonPressed(e) {
    console.log("onButtonPressed");
    if(!userEnabled) {
      return;
    }
    var SVGPath = e.target;
    if (SVGPath.id === 'start') {
      initVars();
      startGame();
    } else if (SVGPath.id === 'strict') {
      if (e.type === "mouseup") {
        return;
      }
      var strictLed = document.getElementById('strictLed');
      if(strictMode === false) {
        strictMode = true;
        strictLed.setAttribute('fill', 'red');
      } else {
        strictMode = false;
        strictLed.setAttribute('fill', '#42000a');
      }
    } else { // Pad pressed
      var SVGElemClasses = SVGPath.classList;
      if(SVGElemClasses.contains('clickable'))
      changePadColor(SVGPath);

      if(e.type === "mousedown") {
        if(movesPattern[currentPatternIndex] === padIds.indexOf(SVGPath.id)) {
          // OK right move - Restart the timeout
          clearTimeout(userTimeout);
          userTimeout = setTimeout(function(){
            showAndHandleError();
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
          showAndHandleError();

          // Clear timeout
          clearTimeout(userTimeout);

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
        audio1.play();
      break;
      case 'greenPad':
        newColor = (isOn === 'true') ? 'green' : '#00F700';
        audio2.play();
      break;
      case 'bluePad':
        newColor = (isOn === 'true') ? '#000080' : 'blue';
        audio3.play();
      break;
      case 'yellowPad':
        newColor = (isOn === 'true') ? '#CCCC00' : 'yellow';
        audio4.play();
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
    initVars();

    var levelIndic = document.getElementById('streak');
    levelIndic.innerHTML = '01';
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
    // Disable user moves until the show is on.
    userEnabled = false;

    // Show the moves pattern to the user
    showPattern();

    // Wait for user moves
    //waitForUserMoves();

  }
  function waitForUserMoves() {
    console.log("waitForUserMoves");
    userTimeout = setTimeout(function(){
      showAndHandleError();
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

  function highlightForTeaching(SVGElem) {
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

  function showAndHandleError() {
    userEnabled = false;

    var highLightFrequency = 1000;
    var highLowPeriod = 400;
    var numOfFlashes = 3;
    // Flash all the 4 colours at the same time. Three times.
    var pads = document.getElementsByClassName('pad');
    for(var j = 0; j < numOfFlashes; ++j) {
    setTimeout(highlightAll, (j + 1) * highLightFrequency);
    setTimeout(lowlightAll, (j + 1) * highLightFrequency + highLowPeriod);
    }

    var restartTimeout = numOfFlashes * highLightFrequency + 2 * highLowPeriod;

    if(strictMode === false) {
      setTimeout(function() {
        currentPatternIndex = 0;
        loopGame(null);
      }, restartTimeout);
    } else {
      setTimeout(startGame, restartTimeout);
    }

    function highlightAll() {
      for (var i = 0; i < pads.length; ++i) {
        // Set the isOn attribute to false so that the first flash is to highlight all the pads.
        pads[i].setAttribute('ison', 'false');

        // Change pad colours
        changePadColor(pads[i]);
      }
    }

    function lowlightAll() {
      for (var i = 0; i < pads.length; ++i) {
        // Set the isOn attribute to true so that the first flash is to lowlight all the pads.
        pads[i].setAttribute('ison', 'true');

        // Change pad colours
        changePadColor(pads[i]);
      }
    }
  }
  // TO DO - Sound
})();
