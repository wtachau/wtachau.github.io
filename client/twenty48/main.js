import { hideElementById, updateYourScore } from "utilities/DisplayUtilities";
import { getRandomInt } from "utilities/MathUtilities";
import { listenForKeys } from "utilities/InteractionUtilities";
import { randomElement } from "utilities/ArrayUtilities";
import { blockSize, movingSpeed, newBlockDelay } from "./constants";
import { isArrowKey } from "utilities/EventUtilities";
import { gameOverDisplay } from "utilities/GameOverUtilities";
import Board from "./board";
import Square from "./square";
import { moveSquares, finishTransition, openSpaces } from "./move";
import { anyMovesLeft } from "./gameOver";

import { addColorMenu } from "./colors";

const subtextElement = document.getElementById("subtext");
const nameElement = document.getElementById("name");

const moveNameDown = () => {
  nameElement.style.top = window.innerHeight / 2 + 200 + "px";
  subtextElement.style.top = window.innerHeight / 2 + 240 + "px";
};

const randomSquare = squares => {
  const eligibleSpaces = openSpaces(squares);
  if (eligibleSpaces.length === 0) {
    return undefined;
  }
  const { col, row } = randomElement(eligibleSpaces);

  return new Square(col, row, getRandomInt(0, 1));
};

export default (animate, defaultRender) => {
  hideElementById("pause-container");

  addColorMenu();

  const boardSquare = new Board();
  let squares = [];
  let movingStepsRemaining = 0;
  let countdownForNewSquares = 0;
  let yourScore;

  const startGame = () => {
    yourScore = 0;
    squares = [];
    squares.push(randomSquare(squares));
    squares.push(randomSquare(squares));
  };
  startGame();

  const render = () => {
    moveNameDown();
    updateYourScore(yourScore);
    boardSquare.render();
    squares.forEach(s => s.render(movingStepsRemaining));
  };

  const update = () => {
    // Check whether we are in a period of transition
    if (movingStepsRemaining > 0) {
      movingStepsRemaining -= movingSpeed;
      if (movingStepsRemaining === 0) {
        finishTransition(squares);
        countdownForNewSquares = newBlockDelay;
      }
    }

    // Check whether we are waiting for a new square
    if (countdownForNewSquares > 0) {
      countdownForNewSquares -= 1;

      // We have finished the delay for a new square; add one!
      if (countdownForNewSquares === 0) {
        const newSquare = randomSquare(squares);

        if (newSquare) {
          newSquare.pop();
          squares.push(newSquare);
          countdownForNewSquares = 0;

          // If there are no open squares, AND no available moves, the game is over :(
          if (openSpaces(squares).length === 0) {
            if (!anyMovesLeft(squares)) {
              gameOverDisplay(false, yourScore, startGame);
            }
          }
        }
      }
    }
  };

  const step = () => {
    update();
    defaultRender();
    render();
    animate(step);
  };

  listenForKeys(event => {
    // Ignore key presses if 1) the tiles are moving or
    //  2) we are waiting to place a new square
    if (movingStepsRemaining === 0 && countdownForNewSquares === 0) {
      if (isArrowKey(event)) {
        moveSquares(squares, event.keyCode, type => {
          yourScore += Math.pow(2, type + 1);
        });

        // Only place a new square if anything was moved
        const anySquareMoved = squares.some(s => {
          return s.desiredCol !== s.col || s.desiredRow !== s.row;
        });

        if (anySquareMoved) {
          movingStepsRemaining = blockSize;
        }
      }
    }
  });

  animate(step);
};
