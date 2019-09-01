import {
  blockSize,
  leftLimit,
  rightLimit,
} from './constants'


export const offLeftLimit = (xCoordinate, block) => {
  return xCoordinate * blockSize + block.centerX < leftLimit
}

export const offRightLimit = (xCoordinate, block) => {
  return xCoordinate * blockSize + block.centerX > rightLimit
}

export const pointsCollide = (x1, y1, x2, y2) => {
  return ((x2 < x1 + blockSize && x2 + blockSize > x1)
    && (y2 < y1 + blockSize && y2 + blockSize > y1))
}

export const blockHasCollided = (block1, block2) => {
  for (let i = 0; i < block1.coordinates.length; i += 1) {
    const block1Coordinate = block1.coordinates[i]

    if (block1Coordinate) {
      let [x1, y1] = block1Coordinate
      x1 = x1 * blockSize + block1.centerX
      y1 = y1 * blockSize + block1.centerY

      for (let j = 0; j < block2.coordinates.length; j += 1) {
        const block2Coordinate = block2.coordinates[j]
        let [x2, y2] = block2Coordinate
        x2 = x2 * blockSize + block2.centerX
        y2 = y2 * blockSize + block2.centerY

        if (pointsCollide(x1, y1, x2, y2)) {
          return true
        }
      }
    }
  }
  return false
}

export const anyCollisions = (blocks, lastBlock) => {
  // check if it has gone off the bottom, left, or right
  for (let i = 0; i < lastBlock.coordinates.length; i += 1) {
    const coordinate = lastBlock.coordinates[i]
    const [xCoordinate, yCoordinate] = coordinate

    if (yCoordinate * blockSize + lastBlock.centerY > (window.innerHeight - 75)
      || offLeftLimit(xCoordinate, lastBlock) || offRightLimit(xCoordinate, lastBlock)) {
      return true
    }
  }

  // check if it has hit other block
  for (let i = 0; i < blocks.length - 1; i += 1) {
    if (blockHasCollided(blocks[i], lastBlock)) {
      return true
    }
  }
  return false
}
