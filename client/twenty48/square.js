import {
  limeGreen,
  pink,
  yellow,
  orange,
  cyan,
  red,
  purple,
  black,
  white,
  warmOrange,
  teal,
  blue,
  violet,
  fuscia,
  lightBlue
} from "constants/colors";
import { blockSize, numBlocks, sizeOfPop } from "./constants";
import { screenCenter, fontName } from "utilities/DisplayUtilities";

class Square {
  constructor(col, row, type) {
    this.col = col;
    this.row = row;
    this.type = type;

    this.desiredCol = col;
    this.desiredRow = row;
    this.desiredType = type;

    this.markedForDeletion = false;

    this.isPopping = false;
    this.popStage = 0;
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
    this.desiredType += 1;
    return this.desiredType;
  }

  pop() {
    this.isPopping = true;
  }

  setDesiredAttributes() {
    this.col = this.desiredCol;
    this.row = this.desiredRow;
    // if we're about to get upgraded, then pop!
    if (this.type !== this.desiredType) {
      this.pop();
    }
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

    const { fillColor, textColor } = colors(this.type);

    window.context.fillStyle = fillColor;

    // Adjust for pop
    let offset = 0;
    if (this.isPopping) {
      this.popStage++;
      if (this.popStage > 2 * sizeOfPop) {
        this.popStage = 0;
        this.isPopping = false;
      }

      offset = sizeOfPop - Math.abs(sizeOfPop - this.popStage);
    }

    const buffer = 1;
    window.context.fillRect(
      adjustedX - blockSize / 2 + buffer - offset,
      adjustedY - blockSize / 2 + buffer - offset,
      blockSize - 2 * buffer + 2 * offset,
      blockSize - 2 * buffer + 2 * offset
    );

    window.context.fillStyle = textColor;
    context.textAlign = "center";
    window.context.font = `20px "${fontName}"`;
    window.context.fillText(
      String(Math.pow(2, this.type + 1)),
      adjustedX,
      adjustedY + 10
    );
  }
}

const colors = type => {
  switch (type) {
    case 0: // 2
      if (window.retro) {
        return { fillColor: red, textColor: white };
      } else {
        return { fillColor: "rgb(238,228,219)", textColor: black };
      }
    case 1: // 4
      if (window.retro) {
        return { fillColor: orange, textColor: white };
      } else {
        return { fillColor: "rgb(237, 224, 201)", textColor: black };
      }
    case 2: // 8
      if (window.retro) {
        return { fillColor: warmOrange, textColor: white };
      } else {
        return { fillColor: "rgb(241, 177, 125)", textColor: white };
      }
    case 3: // 16
      if (window.retro) {
        return { fillColor: yellow, textColor: black };
      } else {
        return { fillColor: "rgb(243,149,104)", textColor: white };
      }
    case 4: // 32
      if (window.retro) {
        return { fillColor: limeGreen, textColor: black };
      } else {
        return { fillColor: "rgb(244,124,99)", textColor: white };
      }
    case 5: // 64
      if (window.retro) {
        return { fillColor: teal, textColor: black };
      } else {
        return { fillColor: "rgb(244,95,66)", textColor: white };
      }
    case 6: // 128
      if (window.retro) {
        return { fillColor: cyan, textColor: black };
      } else {
        return { fillColor: "rgb(236,206,120)", textColor: white };
      }
    case 7: // 256
      if (window.retro) {
        return { fillColor: blue, textColor: white };
      } else {
        return { fillColor: "rgb(119,110,101)", textColor: white };
      }
    case 8: // 512
      if (window.retro) {
        return { fillColor: pink, textColor: black };
      } else {
        return {
          fillColor: "#edc850",
          textColor: white
        };
      }
    case 9: // 1024
      if (window.retro) {
        return { fillColor: violet, textColor: white };
      } else {
        return {
          fillColor: "#edc53f",
          textColor: white
        };
      }
    case 10: // 2048
      if (window.retro) {
        return { fillColor: purple, textColor: white };
      } else {
        return {
          fillColor: "#edc22e",
          textColor: white
        };
      }
    case 11: // 4096
      if (window.retro) {
        return { fillColor: fuscia, textColor: white };
      } else {
        return {
          fillColor: "#4DF2BE",
          textColor: white
        };
      }
    case 12: // 8192
      if (window.retro) {
        return { fillColor: lightBlue, textColor: white };
      } else {
        return {
          fillColor: "#4DF2BE",
          textColor: white
        };
      }
    default:
  }
};

export default Square;
