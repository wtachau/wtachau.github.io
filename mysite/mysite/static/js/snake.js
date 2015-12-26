var play_snake = function() {
	var snakeWidth = 10;

    var randomX = function () {
        // random number between 1 and window limit
        var rand = Math.floor((Math.random() * $(window).width()) + 1);
        // round to nearest block
        var x = nearestBlock(rand);
        while (x <= 10) {
            rand = Math.floor((Math.random() * $(window).height()) + 1);
            x = nearestBlock(rand);
        }
        return x;
    }

    var randomY = function () {
        // random number between 1 and window limit
        var rand = Math.floor((Math.random() * $(window).height()) + 1);
        // round to nearest block
        var y = nearestBlock(rand);
        while (y <= 10) {
            rand = Math.floor((Math.random() * $(window).height()) + 1);
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

        canvas.width = $(window).width();
        canvas.height = $(window).height();

        // set coordinates of elements in canvas
        document.getElementById("name").style.marginTop= $(window).height()/-2 - 60;
        document.getElementById("name").style.marginLeft= ($(window).width() - $("#name").width())/2 ;

        document.getElementById("subtext").style.marginTop= $(window).height()/-2 - 20;
        document.getElementById("subtext").style.marginLeft= ($(window).width() - $("#subtext").width())/2 ;

        document.getElementById("your_score").style.marginTop = -$(window).height() + 20;
        document.getElementById("your_score").style.marginLeft = $(window).width() - 40;


        //update score
        $('#your_score').html(your_score);

        context.fillRect(0, 0, $(window).width(), $(window).height());
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
                snake[i].y = nearestBlock($(window).height() + (snake[i].y - snakeWidth));
            } else if (snake[i].y + snakeWidth > $(window).height()) {
                snake[i].y = nearestBlock(snakeWidth);
            } else if (snake[i].x - snakeWidth < 0) {
                snake[i].x = nearestBlock($(window).width() + (snake[i].x - snakeWidth));
            } else if (snake[i].x + snakeWidth > $(window).width()) {
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
