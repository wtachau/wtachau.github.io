var canvas = document.createElement("canvas");
canvas.width = $(window).width();
canvas.height = $(window).height();
var context = canvas.getContext('2d');
document.getElementById("page1").appendChild(canvas);
var isPaused;

// Decide which game to play
var numGames = 2
var game = Math.floor((Math.random() * numGames) + 1);

// pause
var pause_game = function pause() {
    isPaused = !isPaused;
    document.getElementById("pause").src= isPaused? "/static/images/play.png" : "/static/images/pause.png";
}

// If pong
if (game == 1) {
    //set animation speed
    var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };

    // how fast the ball goes
    var normal_speed = 4;
    // save values when paused
    var pause_x_speed = 0;
    var pause_y_speed = 0;

    //keep score
    var comp_score = 0
    var your_score = 0

    var computer_speed = 4;
    var player = new Player();
    var computer = new Computer();
    var ball = new Ball($(window).width()/4, $(window).height()/2);

    // To prevent scroll on down key, and set pause for space
    document.body.addEventListener('keydown', function(e) {
      if (e.keyCode === 40) { //down arrow
        e.preventDefault();
      } else if (e.keyCode == 32) { //pause
        e.preventDefault();
        pause_game();
      }
    });

    var keysDown = {};

    var render = function () {
        canvas.width = $(window).width();
        canvas.height = $(window).height();

        // set coordinates of elements in canvas
        document.getElementById("name").style.marginTop= $(window).height()/-2 - 60;
        document.getElementById("name").style.marginLeft= ($(window).width() - $("#name").width())/2 ;

        document.getElementById("subtext").style.marginTop= $(window).height()/-2 - 20;
        document.getElementById("subtext").style.marginLeft= ($(window).width() - $("#subtext").width())/2 ;

        document.getElementById("comp_score").style.marginTop = -$(window).height() + 20;
        document.getElementById("comp_score").style.marginLeft = 30;

        document.getElementById("your_score").style.marginTop = -$(window).height() + 20;
        document.getElementById("your_score").style.marginLeft = $(window).width() - 40;


        //update score
        $('#comp_score').html(comp_score);
        $('#your_score').html(your_score);

        context.fillRect(0, 0, $(window).width(), $(window).height());
        context.fillStyle = "#000000";
        player.render();
        computer.render();
        ball.render();
    };

    var update = function () {
        player.update();
        computer.update(ball);
        ball.update(player.paddle, computer.paddle);
    };

    var step = function () {
        if (!isPaused) {
            update();
            render();
            animate(step);
        }
    };

    function Paddle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x_speed = 0;
        this.y_speed = 0;
    }

    Paddle.prototype.render = function () {
        context.fillStyle = "#0DFD55";
        context.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.move = function (x, y) {
        this.x += x;
        this.y += y;
        this.x_speed = x;
        this.y_speed = y;
        if (this.y < 0) {
            this.y = 0;
            this.y_speed = 0;
        } else if (this.y + this.height > $(window).height()) {
            this.y = $(window).height() - this.height;
            this.y_speed = 0;
        }
    };

    function Computer() {
        this.paddle = new Paddle(10, 175, 10, 50);
    }

    Computer.prototype.render = function () {
        this.paddle.render();
    };

    Computer.prototype.update = function (ball) {
        var y_pos = ball.y;
        var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
        if (diff < -4) {
            diff = -computer_speed;
        } else if (diff > 4) {
            diff = computer_speed;
        }
        this.paddle.move(0, diff);
        if (this.paddle.y < 0) {
            this.paddle.y = 0;
        } else if (this.paddle.y + this.paddle.height > $(window).height()) {
            this.paddle.y = $(window).height() - this.paddle.height;
        }
    };

    function Player() {
        this.paddle = new Paddle($(window).width() - 20, 175, 10, 50);
    }

    Player.prototype.render = function () {
        this.paddle.x = $(window).width() - 20;
        this.paddle.render();
    };

    Player.prototype.update = function (e) {
        for (var key in keysDown) {
            var value = Number(key);
            if (value == 38) {
                this.paddle.move(0, -4);
            } else if (value == 40) {
                this.paddle.move(0, 4);
            } else {
                this.paddle.move(0, 0);
            }
        }
    };

    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = normal_speed;
        this.y_speed = 1;
    }

    Ball.prototype.render = function () {
        context.beginPath();
        context.arc(this.x, this.y, 5, 2 * Math.PI, false);
        context.fillStyle = "#0DFD55";
        context.fill();
    };

    Ball.prototype.update = function (paddle1, paddle2) {
        this.x += this.x_speed;
        this.y += this.y_speed;
        var top_x = this.x - 5;
        var top_y = this.y - 5;
        var bottom_x = this.x + 5;
        var bottom_y = this.y + 5;

        // bounce off the top or bottom
        if (this.y - 5 < 0) {
            this.y = 5;
            this.y_speed = -this.y_speed;
        } else if (this.y + 5 > $(window).height()) {
            this.y = $(window).height() - 5;
            this.y_speed = -this.y_speed;
        }

        // goes off the left or right
        if (this.x < 0 || this.x > $(window).width()) {
            if (this.x < 0) {
                your_score++;
            } else {
                comp_score++;
            }
            this.x_speed = normal_speed;
            this.y_speed = Math.floor(Math.random()*5-2); // -2 through 2, inclusive
            this.x = $(window).width()/4;
            this.y = $(window).height()/2;
        }

        // hits right paddle
        if (top_x > $(window).width()/2) {
            if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
                this.x_speed = -normal_speed;
                this.y_speed += (paddle1.y_speed / 2);
                this.x += this.x_speed;
            }
        // hits left paddle
        } else {
            if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
                this.x_speed = normal_speed;
                this.y_speed += (paddle2.y_speed / 2);
                this.x += this.x_speed;
            }
        }
    };

    animate(step);

    window.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
    });

    window.addEventListener("keyup", function (event) {
        delete keysDown[event.keyCode];
    });

/* SNAKE */    
} else if (game == 2) {

    var snakeWidth = 10;

    var randomX = function () {
        // random number between 1 and window limit
        var rand = Math.floor((Math.random() * $(window).width()) + 1);
        // round to nearest block
        return nearestBlock(rand);
    }

    var randomY = function () {
        // random number between 1 and window limit
        var rand = Math.floor((Math.random() * $(window).height()) + 1);
        // round to nearest block
        return nearestBlock(rand);
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

        //console.log("snake:"+snake[0].x+", "+snake[0].y+" food:"+food.x+", "+food.y)

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
            snake[i].duration += 4;
         }
    }

    var newgame = function() {
        snake = [];
        snakeDirection = 1;
        snake[0] = new SnakeBlock(randomX(), randomY(), snakeLength);
        your_score = 0;
    }

    setInterval(step, 100);

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

    // To prevent scroll on down key, and set pause for space
    document.body.addEventListener('keydown', function(e) {
      if (e.keyCode === 40) { //down arrow
        e.preventDefault();
      } else if (e.keyCode == 32) { //pause
        e.preventDefault();
        pause_game();
      }
    });

}