// helllo
var play_snake = function() {
	var snakeWidth = 10;

    var randomX = function () {
        // random number between 1 and window limit
        var rand = Math.floor((Math.random() * window.innerWidth) + 1);
        // round to nearest block
        var x = nearestBlock(rand);
        while (x <= 10) {
            rand = Math.floor((Math.random() * window.innerHeight) + 1);
            x = nearestBlock(rand);
        }
        return x;
    }

    var randomY = function () {
        // random number between 1 and window limit
        var rand = Math.floor((Math.random() * window.innerHeight) + 1);
        // round to nearest block
        var y = nearestBlock(rand);
        while (y <= 10) {
            rand = Math.floor((Math.random() * window.innerHeight) + 1);
            y = nearestBlock(rand);
        }
        return y;
    }

    var nearestBlock = function(num) {
        return Math.round(num / snakeWidth) * snakeWidth;
    }

    //initial things
    var snake = [];
    snakeDirection = 1;
    snakeLength = 5;
    snake[0] = new SnakeBlock(randomX(), randomY(), snakeLength);

    var food = new FoodBlock(randomX(),randomY());

    // Your score
    var your_score = 0;

    // Keep track of which keys have been pressed
    var keysDown = [];
    window.addEventListener("keydown", function (event) {
        keysDown.push(event.keyCode);
    });

    var render = function () {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // set coordinates of elements in canvas
        $("#name").css({'top': window.innerHeight/2 - 60 + 'px' });
        $("#name").css({'left': (window.innerWidth - $("#name").width())/2 + 'px' });

        $("#subtext").css({'top': window.innerHeight/2 - 20 + 'px' });
        $("#subtext").css({'left': (window.innerWidth - $("#subtext").width())/2  + 'px' });

        $("#your_score").css({'top': 20 + 'px' });
        $("#your_score").css({'left': window.innerWidth - 40 + 'px' });


        //update score
        $('#your_score').html(your_score);

        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = "#000000";

        // show all existing snake parts
        for (var i = 0; i <= snake.length-1; i++) {
            snake[i].render();
        }

        // show food
        food.render();
    };

    var update = function () {

        prevSnakeHead = snake[0];
        newSnakeHead = new SnakeBlock(prevSnakeHead.x, prevSnakeHead.y, snake.length);

        // Depending on last direction pressed, change where new block is added
        var numKeysPressed = keysDown.length;
        for (var i = 0; i < numKeysPressed; i++) {
            var value = Number(keysDown[i]);

            if (value == 40 && snakeDirection != 2) { // up
                snakeDirection = 0;
            } else if (value == 39 && snakeDirection != 3) { // right
                snakeDirection = 1;
            } else if (value == 38 && snakeDirection != 0) { //down
                snakeDirection = 2;
            } else if (value == 37 && snakeDirection != 1) { // left
                snakeDirection = 3;
            }
            delete keysDown[i];
        }

        // Now add another snake block in the current direction
        switch(snakeDirection) {
            case 0: //up
                newSnakeHead.y += snakeWidth;
                break;
            case 1: //right
                newSnakeHead.x += snakeWidth;
                break;
            case 2: //down
                newSnakeHead.y -= snakeWidth;
                break;
            default: //left
                newSnakeHead.x -= snakeWidth;
        }
        snake.unshift(newSnakeHead);



        // Has it hit itself?
        for (var i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                newgame();
            }
        }

        // Has it hit a food block?
        if (snake.length > 0
         && snake[0].x == food.x - snakeWidth
         && snake[0].y == food.y - snakeWidth) {
            addTail();
            food.x = randomX();
            food.y = randomY();
        }

        // Get rid of blocks that have expired
        var indexLimit = snake.length-1;
        for (var i = 0; i <= indexLimit; i++) {
            snake[i].duration--;
        }

        // And if something has gone off the edge
        for (var i = 0; i <= indexLimit; i++) {
            if (snake[i].y - snakeWidth < 0) {
                snake[i].y = nearestBlock(window.innerHeight + (snake[i].y - snakeWidth));
            } else if (snake[i].y + snakeWidth > window.innerHeight) {
                snake[i].y = nearestBlock(snakeWidth);
            } else if (snake[i].x - snakeWidth < 0) {
                snake[i].x = nearestBlock(window.innerWidth + (snake[i].x - snakeWidth));
            } else if (snake[i].x + snakeWidth > window.innerWidth) {
                snake[i].x = nearestBlock(snakeWidth);
            }
        }

        // Then get rid of old snake blocks
        if (snake[indexLimit].duration <=0) {
            snake.splice(indexLimit,1);
        }
    };

    /* Create food */
    function FoodBlock(x, y) {
        this.x = x;
        this.y = y;
    }

    FoodBlock.prototype.render = function() {
        context.beginPath();
        context.arc(this.x - snakeWidth/2, this.y - snakeWidth/2, snakeWidth/2, 2 * Math.PI, false);
        context.fillStyle = "#0DFD55";
        context.fill();
    }

    var step = function () {
        if (!isPaused) {
            update();
            render();
        }
    };

    var addTail = function () {
        your_score++;
         for (var i = 0; i < snake.length - 1; i++) {
            snake[i].duration += 6;
         }
    }

    var newgame = function() {
        snake = [];
        snakeDirection = 1;
        snake[0] = new SnakeBlock(randomX(), randomY(), snakeLength);
        your_score = 0;
    }

    setInterval(step, 60);

    /* Create the snake, control render and updates */
    function SnakeBlock(x, y, dur) {
        this.x = x;
        this.y = y;
        this.size = snakeWidth;
        this.duration = dur;
    }

    SnakeBlock.prototype.render = function() {
        context.fillStyle = "#0DFD55";
        context.fillRect(this.x, this.y, this.size, this.size);
    }
}
