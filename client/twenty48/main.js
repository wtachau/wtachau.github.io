import { hideElementById } from "utilities/DisplayUtilities";
import { getRandomInt } from "utilities/MathUtilities";
import { listenForKeys } from "utilities/InteractionUtilities";
import { arrayFrom1ToN, randomElement } from "utilities/ArrayUtilities";
import { blockSize, numBlocks, movingSpeed } from "./constants";
import { isArrowKey } from "utilities/EventUtilities";
import Board from "./board";
import Square from "./square";
import { moveSquares } from "./move";

const subtextElement = document.getElementById("subtext");
const nameElement = document.getElementById("name");

const moveNameDown = () => {
  nameElement.style.top = window.innerHeight / 2 + 200 + "px";
  subtextElement.style.top = window.innerHeight / 2 + 240 + "px";
};

const openSpaces = squares => {
  const empty = [];
  arrayFrom1ToN(numBlocks).forEach(x => {
    arrayFrom1ToN(numBlocks).forEach(y => {
      if (
        squares.findIndex(s => {
          return (
            (s.col === y && s.row === x) ||
            (s.desiredCol === y && s.desiredRow === x)
          );
        }) < 0
      ) {
        empty.push({ col: y, row: x });
      }
    });
  });
  return empty;
};

const randomSquare = squares => {
  const eligibleSpaces = openSpaces(squares);
  console.log("all open:", openSpaces(squares));
  if (eligibleSpaces.length === 0) {
    console.log("YOU LOSE");
    return undefined;
  }
  const { col, row } = randomElement(eligibleSpaces);

  // console.log("square right now", squares);
  // console.log("adding one in ", col, row, ", looks good to me!");

  return new Square(col, row, 0);
};

export default (animate, defaultRender) => {
  hideElementById("pause-container");
  const boardSquare = new Board();
  const squares = [];
  let movingStepsRemaining = 0;
  let countdownForNewSquares = 0;

  window.squares = squares;

  const startGame = () => {
    squares.push(randomSquare(squares));
  };
  startGame();

  const render = () => {
    moveNameDown();
    boardSquare.render();
    squares.forEach(s => s.render(movingStepsRemaining));
  };

  const update = () => {
    if (movingStepsRemaining > 0) {
      movingStepsRemaining -= movingSpeed;
      if (movingStepsRemaining === 0) {
        // The transition period is over
        squares.forEach(s => s.setDesiredAttributes());
        squares.removeElements(squares.filter(s => s.markedForDeletion));
        countdownForNewSquares = 10;
      }
    }

    if (countdownForNewSquares > 0) {
      countdownForNewSquares -= 1;
      if (countdownForNewSquares === 0) {
        squares.push(randomSquare(squares));
        countdownForNewSquares = 0;
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
    if (movingStepsRemaining === 0 && countdownForNewSquares === 0) {
      if (isArrowKey(event)) {
        moveSquares(squares, event.keyCode);
        movingStepsRemaining = blockSize;
      }
    }
  });

  animate(step);
};
