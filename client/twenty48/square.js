import {
  limeGreen,
  pink,
  yellow,
  orange,
  cyan,
  red,
  purple
} from "constants/colors";
import { blockSize, numBlocks } from "./constants";
import { screenCenter } from "utilities/DisplayUtilities";
import { totalmem } from "os";

class Square {
  constructor(col, row, type) {
    this.col = col;
    this.row = row;
    this.type = type;

    this.desiredCol = col;
    this.desiredRow = row;
    this.desiredType = type;

    this.markedForDeletion = false;
  }

  setDesiredColumn(c) {
    this.desiredCol = c;
  }

  setDesiredRow(r) {
    this.desiredRow = r;
  }

  markForDeletion() {
    this.markedForDeletion = true;
  }

  upgrade() {
    this.desiredType += 1; // todo: make this *= 2
  }

  setDesiredAttributes() {
    this.col = this.desiredCol;
    this.row = this.desiredRow;
    this.type = this.desiredType;
  }

  render(stepsAway) {
    const { centerX, centerY } = screenCenter;
    const leftEdge = centerX - (blockSize * numBlocks) / 2;
    const topEdge = centerY - (blockSize * numBlocks) / 2;

    const xCoord = col => {
      return leftEdge + col * blockSize + blockSize / 2;
    };
    const yCoord = row => {
      return topEdge + row * blockSize + blockSize / 2;
    };

    const x = xCoord(this.col);
    const y = yCoord(this.row);
    const desiredX = xCoord(this.desiredCol);
    const desiredY = yCoord(this.desiredRow);

    // Amount to move is a function of how far we need to move,
    //  and how much time has passed.
    const coefficient = (blockSize - stepsAway) / blockSize;
    const adjustedX = x + (desiredX - x) * coefficient;
    const adjustedY = y + (desiredY - y) * coefficient;

    switch (this.type) {
      case 0:
        window.context.fillStyle = "rgb(238,228,219)"; //pink;
        break;
      case 1:
        window.context.fillStyle = "rgb(237, 224, 201)"; //yellow;
        break;
      case 2:
        window.context.fillStyle = "rgb(241, 177, 125)"; //limeGreen;
        break;
      case 3:
        window.context.fillStyle = "rgb(243,149,104)"; //orange;
        break;
      case 4:
        window.context.fillStyle = "rgb(244,124,99)"; //cyan;
        break;
      case 5:
        window.context.fillStyle = "rgb(244,95,66)"; //red;
        break;
      case 6:
        window.context.fillStyle = "rgb(236,206,120)"; //purple;
        break;
      default:
        break;
    }

    const buffer = 1;
    window.context.fillRect(
      adjustedX - blockSize / 2 + buffer,
      adjustedY - blockSize / 2 + buffer,
      blockSize - 2 * buffer,
      blockSize - 2 * buffer
    );

    window.context.fillStyle = "red";
    window.context.font = "20px Georgia";
    window.context.fillText(
      String(Math.pow(2, this.type + 1)),
      adjustedX,
      adjustedY
    );
  }
}

export default Square;
