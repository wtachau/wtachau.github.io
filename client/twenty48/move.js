import { groupedArray } from "utilities/ArrayUtilities";
import { numBlocks } from "./constants";
import { LEFT, RIGHT, UP, DOWN } from "utilities/EventUtilities";

const squaresByRow = squares => {
  return groupedArray(squares, "row");
};

const squaresByCol = squares => {
  return groupedArray(squares, "col");
};

const getDesiredEdge = direction => {
  return [LEFT, UP].includes(direction) ? 0 : numBlocks - 1;
};

const setDesiredPlace = (square, direction) => {
  if ([LEFT, RIGHT].includes(direction)) {
    square.setDesiredColumn(getDesiredEdge(direction));
  } else {
    square.setDesiredRow(getDesiredEdge(direction));
  }
};

const shouldReverse = direction => {
  return [RIGHT, DOWN].includes(direction);
};

const offset = direction => {
  return [LEFT, UP].includes(direction) ? 1 : -1;
};

const setSquareDesiredLocation = (square, previousSquare, offset = 0) => {
  if (square.row === previousSquare.row) {
    square.setDesiredColumn(previousSquare.desiredCol + offset);
  } else {
    square.setDesiredRow(previousSquare.desiredRow + offset);
  }
};

const groupSquares = (direction, squares) => {
  let groupedSquares;
  if ([LEFT, RIGHT].includes(direction)) {
    groupedSquares = squaresByRow(squares);
    for (const row in groupedSquares) {
      const squaresArray = groupedSquares[row];
      squaresArray.sort((a, b) => {
        if (direction === LEFT) {
          return a.col - b.col;
        } else {
          return b.col - a.col;
        }
      });
    }
  } else {
    groupedSquares = squaresByCol(squares);
    for (const col in groupedSquares) {
      const squaresArray = groupedSquares[col];
      squaresArray.sort((a, b) => {
        if (direction === UP) {
          return a.row - b.row;
        } else {
          return b.row - a.row;
        }
      });
    }
  }
  return groupedSquares;
};

export const moveSquares = (squares, direction) => {
  const groupedSquares = groupSquares(direction, squares);
  for (const key in groupedSquares) {
    let squaresInGroup = groupedSquares[key];

    squaresInGroup.forEach((square, i) => {
      if (i === 0) {
        setDesiredPlace(square, direction);
      } else {
        const previousSquare = squaresInGroup[i - 1];
        const previousSquareEligible =
          previousSquare.type === previousSquare.desiredType &&
          !previousSquare.markedForDeletion;

        if (previousSquareEligible && previousSquare.type === square.type) {
          setSquareDesiredLocation(square, previousSquare);
          square.markForDeletion();
          previousSquare.upgrade();
        } else {
          setSquareDesiredLocation(square, previousSquare, offset(direction));
        }
      }
    });
  }
};
