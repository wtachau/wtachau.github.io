var play_brick = function() {

	//set animation speed
    var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };

	// keep score
	var original_score = 3;
	var your_score = original_score;

	// how fast the ball goes
    var normal_speed = 5;
    var paddle_speed = 5;

    // save values when paused
    var pause_x_speed = 0;
    var pause_y_speed = 0;

    var paddleWidth = 100;
    var paddleHeight = 10;

    var numBricks = 50;
    var numRows = 5;
    var numColumns = numBricks / numRows;
    var padding = 5;
    var brickWidth = $(window).width() / numColumns;
    var brickHeight = 30;
    var topPadding = 50;

    var player = new Player();
    var ball = new Ball($(window).width()/4, window.innerHeight/2);
    var bricks;
    var reset_bricks = function () {
    	bricks = [];
    	for (var i = 0; i < numBricks; i++) {
			bricks.push(new Brick(  (i % numColumns) * brickWidth + padding / 2,
									Math.floor(i / numColumns) * brickHeight + topPadding,
									brickWidth - padding,
									brickHeight - padding));
	    }
    }
    reset_bricks();

    var keysDown = {};

	var render = function () {
        canvas.width = $(window).width();
        canvas.height = window.innerHeight;

        // set coordinates of elements in canvas
        $("#name").css({'top': window.innerHeight/2 - 60 + 'px' });
        $("#name").css({'left': ($(window).width() - $("#name").width())/2 + 'px' });

        $("#subtext").css({'top': window.innerHeight/2 - 20 + 'px' });
        $("#subtext").css({'left': ($(window).width() - $("#subtext").width())/2  + 'px' });

        $("#your_score").css({'top': 20 + 'px' });
        $("#your_score").css({'left': $(window).width() - 40 + 'px' });

        //update score
        $('#your_score').html(your_score);

        context.fillRect(0, 0, $(window).width(), window.innerHeight);
        context.fillStyle = "#000000";
        player.render();
        ball.render();

        bricks.forEach(function(brick) {
        	brick.render();
        });
    };

    var update = function () {
        player.update();
        bricks.forEach(function(brick) {
        	brick.update(ball);
        });
        ball.update(player.paddle);
    };

    var step = function () {
        if (!isPaused) {
            update();
            render();
        }
        animate(step);
    };

    var game_over = function(did_win) {
    	$("#name").hide();
        $("#subtext").hide();
        $("#your_score").hide();

        var message = did_win ? "you won!!!" : "whoops! you lost :(";
        var count = 0;
        var flash_times = 2;
        var pause_time = 1000;

        var flash_message = function(message) {
        	pauseGame();
			$("#brick_text").html(message);
			$("#brick_text").css({'top': window.innerHeight/2 - 60 + 'px'});
			$("#brick_text").css({'left': ($(window).width() - $("#brick_text").width())/2  + 'px'});

			var show_message, hide_message;
			show_message = function() {
				$("#brick_text").show();
				setTimeout(hide_message, pause_time);
			}
			hide_message = function() {
				$("#brick_text").hide();
				if (count == flash_times) {
					// new game
					$("#name").show();
					$("#subtext").show();
					$("#your_score").show();
					your_score = original_score;
					restart_ball(ball);
					reset_bricks();
					pauseGame();
				} else {
					count++;
					setTimeout(show_message, pause_time);
				}
			}
			show_message();
		};
		flash_message(message);
    }

    /*
     * Brick Stuff
     */

    function Brick(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x_speed = 0;
        this.y_speed = 0;
    }

    Brick.prototype.render = function () {
        context.fillStyle = "#0DFD55";
        context.fillRect(this.x, this.y, this.width, this.height);
    };

    Brick.prototype.update = function(ball) {
    	// helper values for brick
    	var left_x = this.x;
    	var top_y = this.y;
    	var right_x = this.x + brickWidth;
    	var bottom_y = this.y + brickHeight;

    	// helper values for ball
    	var ball_left_x = ball.x - 5;
    	var ball_top_y = ball.y - 5;
    	var ball_right_x = ball.x + 5;
    	var ball_bottom_y = ball.y + 5;

    	if (ball_top_y - normal_speed < bottom_y
    		&& ball_right_x > left_x
    		&& ball_left_x < right_x
    		&& ball_bottom_y + normal_speed > top_y) {
    		ball.y = ball_top_y + normal_speed;
    		ball.y_speed = -ball.y_speed;

			bricks.splice(bricks.indexOf(this),1);
			if (bricks.length == 0) {
				game_over(true);
			}
    	}
    }

    /*
     * Paddle Stuff
     */

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
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > $(window).width()) {
            this.x = $(window).width() - this.width;
        }
    };

     /*
     * Player Stuff
     */

    function Player() {
        this.paddle = new Paddle($(window).width() / 2, window.innerHeight - 60, paddleWidth, paddleHeight);
    }

    Player.prototype.render = function () {
        // this.paddle.x = $(window).width() - 20;
        this.paddle.render();
    };

    Player.prototype.update = function (e) {
        for (var key in keysDown) {
            var value = Number(key);
            if (value == 37) {
                this.paddle.move(-paddle_speed, 0);
            } else if (value == 39) {
                this.paddle.move(paddle_speed, 0);
            } else {
                this.paddle.move(0, 0);
            }
        }
    };

     /*
     * Ball Stuff
     */

    function Ball(x, y) {
        this.x = x;
        this.y = y;
        this.x_speed = normal_speed;
        this.y_speed = normal_speed ;
    }

    Ball.prototype.render = function () {
        context.beginPath();
        context.arc(this.x, this.y, 5, 2 * Math.PI, false);
        context.fillStyle = "#0DFD55";
        context.fill();
    };

    Ball.prototype.update = function (paddle) {
        this.x += this.x_speed;
        this.y += this.y_speed;
        var top_x = this.x - paddle.height;
        var top_y = this.y - paddle.height;
        var bottom_x = this.x + paddle.height;
        var bottom_y = this.y + paddle.height;

        // bounce off the top or bottom
        if (this.y - 5 < 0) {
            this.y = 5;
            this.y_speed = -this.y_speed;
        } else if (this.y + 5 > window.innerHeight) {
        	your_score--;

        	if (your_score == 0) {
        		game_over(false);
        	}

        	restart_ball(this);
        }

        // goes off the left or right
        if (this.x < 0 || this.x > $(window).width()) {
        	this.x_speed = -this.x_speed
            if (this.x < 0) {
                this.x = 5;
            } else {
                this.x = $(window).width() - 5;
            }
        }

        // hits paddle
        if (top_y < (paddle.y + paddle.width) && bottom_y > paddle.y && top_x < (paddle.x + paddle.width) && bottom_x > paddle.x) {
        	var speed = (this.x - paddle.x - paddle.width/2)/8;
            this.y_speed = -normal_speed;
            this.x_speed += speed;
            this.y += this.y_speed;
        }
    };

    var restart_ball = function(ball) {
		ball.y_speed = -normal_speed;
		ball.x_speed = Math.floor(Math.random()*5-2); // -2 through 2, inclusive
		ball.x = $(window).width()/2;
		ball.y = window.innerHeight - 70;
    }

    animate(step);

    window.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
    });

    window.addEventListener("keyup", function (event) {
        delete keysDown[event.keyCode];
    });
}
