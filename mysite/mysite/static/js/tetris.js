var play_tetris = function() {

  var blockSize = 25;

  var newTetrisBlock = function() {
    var type = Math.floor((Math.random() * 7)); //between 0-5
    blocks.push(new TetrisBlock(type));
    lastBlock = blocks[blocks.length - 1];
  }

  var blocks = [];
  var lastBlock;
  newTetrisBlock();

  function TetrisSquare(x, y) {
    this.x = x
    this.y = y
  }

  TetrisSquare.prototype.render = function() {
    context.fillStyle = "#0DFD55";
    context.fillRect(this.x, this.y, blockSize - 1, blockSize - 1);
  }

  function TetrisBlock(type) {
    this.centerX = ($(window).width() - blockSize) / 2;
    this.centerY = 50;
    this.type = type;
    this.orientation = 0;
    switch(type) {
      case 0: // "L" shape
        this.coordinates = [[-1,0], [0,0], [1,0], [1,1]];
        break;
      case 1: // Backwards "L"
        this.coordinates = [[-1,1], [-1,0], [0,0], [1,0]];
        break;
      case 2: // Square 
        this.coordinates = [[0,0], [0,1], [1,0], [1,1]];
        break;
      case 3: // Line
        this.coordinates = [[-1,0], [0,0], [1,0], [2,0]];
        break;
      case 4: // Squiggle 1
        this.coordinates = [[-1, 1], [0,1], [0,0], [1,0]];
        break;
      case 5: // Squiggle 2
        this.coordinates = [[-1, 0], [0,0], [0,1], [1,1]];
        break;
      case 6: // Line with the bump in the middle
        this.coordinates = [[-1,0], [0,0], [1,0], [0,1]];
    }
  }

  TetrisBlock.prototype.rotate = function() {
    if (this.type != 2) { // don't rotate a square. that's stupid.

      var rotate = function(coordinates) {
        var newCoordinates = [];
        coordinates.map( function(coordinate) {
          var [x,y] = coordinate;
          newCoordinates.push([-y, x]);
        });
        return newCoordinates;
      }
      this.coordinates = rotate(this.coordinates);
      this.orientation = (this.orientation + 1) % 4;
      if ((this.type >= 3 && this.type <= 5) // if it's a certain shape, alter rotation
        && this.orientation > 1) {
        this.coordinates = rotate(rotate(this.coordinates));
        this.orientation = 0;
      }
    }
  }

  TetrisBlock.prototype.render = function() {
    for (var i = 0; i < this.coordinates.length; i ++) {
      var [x,y] = this.coordinates[i];
      var square =  new TetrisSquare(this.centerX + x * blockSize, this.centerY + y * blockSize);
      square.render();
    }
  }

  var render = function() {
    canvas.width = $(window).width();
    canvas.height = $(window).height();

     // set coordinates of elements in canvas
        $("#name").css({'top': $(window).height()/2 - 60 + 'px' });
        $("#name").css({'left': ($(window).width() - $("#name").width())/2 + 'px' });

        $("#subtext").css({'top': $(window).height()/2 - 20 + 'px' });
        $("#subtext").css({'left': ($(window).width() - $("#subtext").width())/2  + 'px' });

        context.fillRect(0, 0, $(window).width(), $(window).height());
        context.fillStyle = "#000000";

        blocks.map(function(block) {
          block.render();
        });
  }

  // Keep track of which keys have been pressed
  var keysDown = [];
  window.addEventListener("keydown", function (event) {

    lastBlock = blocks[blocks.length - 1]
      var value = Number(event.keyCode);
      if (value == 40) { // down
        moveDownAndCheckForCollisions();
      } else if (value == 39) { // right
        moveSidewaysAndCheckForCollisions(true);
      } else if (value == 38) { // up
        lastBlock.rotate();
      } else if (value == 37) { // left
        moveSidewaysAndCheckForCollisions(false);
      }
      render();
  });

  function pointsCollide(x1, y1, x2, y2) {
    return ((x2 < x1 + blockSize && x2 + blockSize > x1) &&
                (y2 < y1 + blockSize && y2 + blockSize > y1))
  }

  function blockHasCollided(block1, block2) {

    for (var i = 0; i < block1.coordinates.length; i++) {
      var [x1, y1] = block1.coordinates[i];
      x1 = x1 * blockSize + block1.centerX;
      y1 = y1 * blockSize + block1.centerY;

      for (var j = 0; j < block2.coordinates.length; j++) {
        var [x2, y2] = block2.coordinates[j];
        x2 = x2 * blockSize + block2.centerX;
        y2 = y2 * blockSize + block2.centerY;

        if(pointsCollide(x1,y1,x2,y2)) {
          return true;
        }
      }
    }
    return false;
  }

  function anyCollisions() {
    // check if it has hit bottom
    for (var i = 0; i < lastBlock.coordinates.length; i++) {
      var [xCoordinate, yCoordinate] = lastBlock.coordinates[i];
      if(yCoordinate * blockSize + lastBlock.centerY > ($(window).height() - 100)) {
        return true;
      }
    }

    // check if it has hit other block
    for (var i = 0; i < blocks.length - 1; i++) {
      if(blockHasCollided(blocks[i], lastBlock)) {
        return true;
      }
    }
    return false;
  }

  function moveDownAndCheckForCollisions() {
    lastBlock.centerY += blockSize;
    if(anyCollisions()) {
      lastBlock.centerY -= blockSize;
      newTetrisBlock();
    }
  }

  function moveSidewaysAndCheckForCollisions(right) {
    lastBlock.centerX += right ? blockSize : -blockSize;
    if(anyCollisions()) {
      lastBlock.centerX -= right ? blockSize : -blockSize;
    }
  }

  var update = function() {
    moveDownAndCheckForCollisions();
  }

  // common elements (refactor)
  var step = function () {
      if (!isPaused) {
          update();
          render();
      }
  };

  setInterval(step, 500);
}