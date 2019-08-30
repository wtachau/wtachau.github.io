import {
  hideElementById,
  showElement,
  hideElement,
  showElementById
} from "utilities/DisplayUtilities";

export const gameOverDisplay = (didWin, score, startGame) => {
  const pauseTime = 1000;
  const flashTimes = 3;

  hideElementById("name");
  hideElementById("subtext");
  hideElementById("yourScore");

  let count = 0;

  const flashMessage = message => {
    const gameOverTextElement = document.getElementById("game_over_text");
    gameOverTextElement.innerHTML = message;

    let hideMessage;
    const showMessage = () => {
      showElement(gameOverTextElement);
      setTimeout(hideMessage, pauseTime);
    };
    hideMessage = () => {
      hideElement(gameOverTextElement);
      if (count === flashTimes) {
        showElementById("name");
        showElementById("subtext");
        showElementById("yourScore");
        startGame();
      } else {
        count += 1;
        setTimeout(showMessage, pauseTime);
      }
    };
    showMessage();
    gameOverTextElement.style.top = window.innerHeight / 2 - 60 + "px";
    gameOverTextElement.style.left =
      (window.innerWidth - gameOverTextElement.clientWidth) / 2 + "px";
  };
  flashMessage(
    (didWin ? "you won!!! " : "game over :(") + "<br><br>  your score: " + score
  );
};
