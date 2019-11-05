'use strict';

var activeConnectives = [];
var symbols = ['~', '^', 'v', '->'];
var count = 0;

function windowResized() {
  /* make sure canvas stays congruent with the body tag */
  resizeCanvas(document.body.offsetWidth, document.body.offsetHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fill(255);
  textFont('Helvetica');
}

function draw() {
  // draw background
  background('green'); // every 15 loops, make a new connective

  if (count % 20 === 0) {
    count = 0;
    activeConnectives.push(new connective());
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = activeConnectives[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var connect = _step.value;
      connect.update();
      connect.display();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  count += 1;
}

function random_conn() {
  var r = Math.floor(random(0, 4));
  return symbols[r];
}

function connective() {
  var _this = this;
  /* constructs a connective */


  this.x = random(0, document.body.offsetWidth);
  this.y = document.body.offsetHeight * 0.90;
  this.size = random(20, 35);
  this.sym = random_conn();

  this.update = function () {
    _this.y -= pow(_this.size, 0.5) / 2;

    if (_this.y < -100) {
      var index = activeConnectives.indexOf(_this);
      var outBound = activeConnectives.splice(index, 1); //delete outBound;
    }
  };

  this.display = function () {
    textSize(_this.size);
    text(_this.sym, _this.x, _this.y);
  };
}