var canvas = document.createElement("canvas");
canvas.width = $(window).width();
canvas.height = $(window).height();
var context = canvas.getContext('2d');
// if(! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  document.getElementById("page1").appendChild(canvas);
// }
var isPaused;

// todo: don't hardcode path
var play_image = "https://s3-us-west-2.amazonaws.com/tachauwebsite/images/play.png"
var pause_image = "https://s3-us-west-2.amazonaws.com/tachauwebsite/images/pause.png"

// pause
var pause_game = function pause() {
    isPaused = true;
    document.getElementById("pause").src= pause_image;
}

var toggle_pause = function toggle_pause() {
  isPaused = !isPaused;
    document.getElementById("pause").src= isPaused? play_image : pause_image;
}

// Decide which game to play
games = [play_pong, play_snake, play_brick, play_tetris];
var game_choice = Math.floor((Math.random() * games.length));
games[game_choice]();

// To prevent scroll on down key, and set pause for space
document.body.addEventListener('keydown', function(e) {
  if (e.keyCode === 40) { //down arrow
    e.preventDefault();
  } else if (e.keyCode == 32) { //pause
    e.preventDefault();
    toggle_pause();
  }
});
