import { white } from "constants/colors";
import { blockSize, numBlocks } from "./constants";
import { screenCenter } from "utilities/DisplayUtilities";

class Board {
  constructor() {
    this.width = blockSize * numBlocks;
    this.height = blockSize * numBlocks;
  }

  render() {
    const lineWidth = 5;
    const { centerX, centerY } = screenCenter;
    window.context.strokeStyle = white;
    window.context.lineWidth = lineWidth;

    const buffer = 1;

    window.context.strokeRect(
      centerX - this.width / 2 - lineWidth / 2 - buffer,
      centerY - this.height / 2 - lineWidth / 2 - buffer,
      this.width + lineWidth + 2 * buffer,
      this.height + lineWidth + 2 * buffer
    );
  }
}

export default Board;
