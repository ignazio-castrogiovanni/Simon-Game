(function() {
  'use strict';
  var board = document.getElementById('board');

  board.addEventListener('click', testClick);

  function testClick(e) {
    var SVGPath = e.target;
    var SVGElemClasses = SVGPath.classList;
    if(SVGElemClasses.contains('clickable'))
    changePadColor(SVGPath);
  }

  function changePadColor(SVGPath) {
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
      isOn = 'false'
    } else {
      isOn = 'true';
    }
    SVGPath.setAttribute('ison', isOn);
  }
})();
