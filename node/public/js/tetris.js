var play_tetris = function() {

  /*
   * Related to Tetris Blocks
   */

  var newTetrisBlock = function() {
    var type = Math.floor((Math.random() * 7)); //between 0-5
    blocks.push(new TetrisBlock(type));
    lastBlock = blocks[blocks.length - 1];
  }

  function TetrisBlock(type) {
    this.centerX = centerScreen;
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
          // var [x,y] = coordinate;
          var x = coordinate[0]
          var y = coordinate[1]
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

      for(var i = 0; i < this.coordinates.length; i++) {
        // var [x,y] = this.coordinates[i]; 
        var x = this.coordinates[i][0]
        var y = this.coordinates[i][1]
        if (offLeftLimit(x)) {
          lastBlock.centerX += blockSize;
        }
        if(offRightLimit(x)) {
          lastBlock.centerX -= blockSize;
        }
      }
      
    }
  }

  TetrisBlock.prototype.render = function() {
    for (var i = 0; i < this.coordinates.length; i ++) {
      if (this.coordinates[i]) {
        // var [x,y] = this.coordinates[i];

        var x = this.coordinates[i][0]
        var y = this.coordinates[i][1]
        var square =  new TetrisSquare(this.centerX + x * blockSize, this.centerY + y * blockSize, this.type);
        square.render();
      }
    }
  }

  /*
   * Related to Tetris Squares (rendering purpose only)
   */

  function TetrisSquare(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  TetrisSquare.prototype.render = function() {
    switch(this.type) {
      case 0:
        context.fillStyle = "#FF0099"; break;
      case 1:
        context.fillStyle = "#F3F315"; break;
      case 2:
        context.fillStyle = "#0DFD55"; break;
      case 3:
        context.fillStyle = "#FF6600"; break;
      case 4:
        context.fillStyle = "#0FFFFF"; break;
      case 5:
        context.fillStyle = "#FF0000"; break;
      case 6:
        context.fillStyle = "#6E0DD0"; break;
    }
    context.fillRect(this.x, this.y, blockSize - 1, blockSize - 1);
  }


  /* 
   * Main functions of game
   */

  var render = function() {
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // set coordinates of elements in canvas
    $("#name").css({'top': $(window).height()/2 - 60 + 'px' });
    $("#name").css({'left': ($(window).width() - $("#name").width())/2 + 'px' });

    $("#subtext").css({'top': $(window).height()/2 - 20 + 'px' });
    $("#subtext").css({'left': ($(window).width() - $("#subtext").width())/2  + 'px' });

    $("#your_score").css({'top': 20 + 'px' });
    $("#your_score").css({'left': $(window).width() - 40 + 'px' });
    $('#your_score').html(your_score);

    context.fillRect(0, 0, $(window).width(), $(window).height());
    context.fillStyle = "#000000";

    blocks.map(function(block) {
      block.render();
    });
  }

  function gameOver() {
    // maybe flash blocks off and on, with "you lose"
    blocks = [];
    your_score = 0;
    newTetrisBlock();
  }

  var update = function() {
    moveDownAndCheckForCollisions();
  }

  var step = function () {
      if (!isPaused) {
          update();
          render();
      }
  };

  setInterval(step, 400);

  window.addEventListener("keydown", function (event) {

    if (!isPaused) {

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
    }
  });


  /*
   * Common functions
  */

  function pointsCollide(x1, y1, x2, y2) {
    return ((x2 < x1 + blockSize && x2 + blockSize > x1) &&
                (y2 < y1 + blockSize && y2 + blockSize > y1))
  }

  function blockHasCollided(block1, block2) {

    for (var i = 0; i < block1.coordinates.length; i++) {
      if (block1.coordinates[i]) {
        // var [x1, y1] = block1.coordinates[i];
        var x1 = block1.coordinates[i][0]
        var y1 = block1.coordinates[i][1]

        x1 = x1 * blockSize + block1.centerX;
        y1 = y1 * blockSize + block1.centerY;

        for (var j = 0; j < block2.coordinates.length; j++) {
          // var [x2, y2] = block2.coordinates[j];
          var x2 = block2.coordinates[j][0]
          var y2 = block2.coordinates[j][1]

          x2 = x2 * blockSize + block2.centerX;
          y2 = y2 * blockSize + block2.centerY;

          if(pointsCollide(x1,y1,x2,y2)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function offLeftLimit(xCoordinate) {
    return xCoordinate * blockSize + lastBlock.centerX < leftLimit;
  }

  function offRightLimit(xCoordinate) {
    return xCoordinate * blockSize + lastBlock.centerX > rightLimit;
  }

  function anyCollisions() {
    // check if it has gone off the bottom, left, or right
    for (var i = 0; i < lastBlock.coordinates.length; i++) {
      // var [xCoordinate, yCoordinate] = lastBlock.coordinates[i];
      var xCoordinate = lastBlock.coordinates[i][0]
      var yCoordinate = lastBlock.coordinates[i][1]

      if(yCoordinate * blockSize + lastBlock.centerY > ($(window).height() - 75) ||
        offLeftLimit(xCoordinate) || offRightLimit(xCoordinate)) {
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
      checkForFullRows();
      newTetrisBlock();
      if (anyCollisions()) {
        gameOver();
      }
    }
  }

  function moveSidewaysAndCheckForCollisions(right) {
    lastBlock.centerX += right ? blockSize : -blockSize;
    if(anyCollisions()) {
      lastBlock.centerX -= right ? blockSize : -blockSize;
    }
  }

  function checkForFullRows() {
    // construct data structure
    var rows = {}
    for(var i = 0; i < blocks.length; i++) { 
      var block = blocks[i];
      for(var j = 0; j < block.coordinates.length; j++) {
        if (block.coordinates[j]) {
          // var [xCoordinate, yCoordinate] = block.coordinates[j];
          var xCoordinate = block.coordinates[j][0]
          var yCoordinate = block.coordinates[j][1]

          var x = block.centerX + xCoordinate * blockSize;
          var y = block.centerY + yCoordinate * blockSize;
          var newEntry = {'x': x, 'coordinatesRef': block.coordinates, 'index': j} 
          if (y in rows) {
            rows[y].push(newEntry)
          } else {
            rows[y] = [newEntry]
          }
        }
      }
    }
    
    // see if any are full
    var rowsDeleted = [];
    Object.keys(rows).map(function(key) {
      if(rows[key].length >= widthInBlocks) {
        rows[key].map(function(dict) {
          var coordinatesRef = dict['coordinatesRef']
          var indexToDelete = dict['index']
          delete coordinatesRef[indexToDelete]
        });
        rowsDeleted.push(key)
      }
    });

    // then visually delete empty rows
    for(var k = 0; k < rowsDeleted.length; k++) {
      rowToDelete = rowsDeleted[k];
      your_score+=10;
      for(var i = 0; i < blocks.length; i++) { 
        var block = blocks[i];
        for(var j = 0; j < block.coordinates.length; j++) {
          if (block.coordinates[j]) {
            // var [xCoordinate, yCoordinate] = block.coordinates[j];
            var xCoordinate = block.coordinates[j][0]
            var yCoordinate = block.coordinates[j][1]

            if(block.centerY + yCoordinate * blockSize < rowToDelete) {
              block.coordinates[j] = [xCoordinate, yCoordinate + 1];
            }
          }
        }
      }
    }
  } 

  /*
   * This is where the magic happens
   */
  var blockSize = 25;
  var widthInBlocks = 13;
  var trueCenter = ($(window).width() - blockSize) / 2;
  var centerScreen =  Math.floor(trueCenter / blockSize) * blockSize;
  var leftLimit = centerScreen - ((widthInBlocks - 1)/2) * blockSize;
  var rightLimit = centerScreen + ((widthInBlocks - 1)/2) * blockSize;
  var your_score = 0;
  var blocks = [];
  var lastBlock;
  newTetrisBlock();
}