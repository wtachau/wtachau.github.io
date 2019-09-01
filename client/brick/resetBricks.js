import Brick from './brick'

import {
  numBricks,
  numColumns,
  padding,
  brickWidth,
  brickHeight,
  topPadding,
} from './constants'

export default () => {
  const bricks = []
  for (let i = 0; i < numBricks; i += 1) {
    bricks.push(
      new Brick(
        (i % numColumns) * brickWidth + padding / 2,
        Math.floor(i / numColumns) * brickHeight + topPadding,
        brickWidth - padding,
        brickHeight - padding
      )
    )
  }

  return bricks
}
