var canvas = document.createElement("canvas");
canvas.width = $(window).width();
canvas.height = $(window).height();
var context = canvas.getContext('2d');
document.getElementById("page1").appendChild(canvas);
var isPaused;

// pause
var pause_game = function pause() {
    isPaused = !isPaused;
    document.getElementById("pause").src= isPaused? "/static/images/play.png" : "/static/images/pause.png";
}

// Decide which game to play
games = [play_pong, play_snake, play_brick];
var game_choice = Math.floor((Math.random() * games.length));
games[game_choice]();


// To prevent scroll on down key, and set pause for space
document.body.addEventListener('keydown', function(e) {
  if (e.keyCode === 40) { //down arrow
    e.preventDefault();
  } else if (e.keyCode == 32) { //pause
    e.preventDefault();
    pause_game();
  }
});