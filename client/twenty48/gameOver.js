import Square from "./square";
import { moveSquares, finishTransition, openSpaces } from "./move";
import { LEFT, RIGHT, UP, DOWN } from "utilities/EventUtilities";

const squareClone = square => {
  const clone = new Square(square.col, square.row, square.type);
  clone.desiredCol = square.desiredCol;
  clone.desiredRow = square.desiredRow;
  clone.desiredType = square.desiredType;
  clone.markedForDeletion = square.markedForDeletion;
  clone.isPopping = square.isPopping;
  clone.popStage = square.popStage;
  return clone;
};

// To determine if there are any moves left, simulate going in each direction
//  and see if any of those leads to an open space
export const anyMovesLeft = squares => {
  const squaresCopy = squares.map(s => squareClone(s));

  moveSquares(squaresCopy, LEFT);
  finishTransition(squaresCopy);

  if (openSpaces(squaresCopy).length > 0) {
    return true;
  }
  moveSquares(squaresCopy, RIGHT);
  finishTransition(squaresCopy);
  if (openSpaces(squaresCopy).length > 0) {
    return true;
  }
  moveSquares(squaresCopy, UP);
  finishTransition(squaresCopy);
  if (openSpaces(squaresCopy).length > 0) {
    return true;
  }
  moveSquares(squaresCopy, DOWN);
  finishTransition(squaresCopy);
  if (openSpaces(squaresCopy).length > 0) {
    return true;
  }
  return false;
};
