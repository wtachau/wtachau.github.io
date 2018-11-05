import TetrisSquare from './tetrisSquare'

import {
  blockSize,
  centerScreen,
} from './constants'

import {
  offLeftLimit,
  offRightLimit
} from './helpers'

class TetrisBlock {
  constructor(type) {
    this.centerX = centerScreen
    this.centerY = 50
    this.type = type
    this.orientation = 0
    switch (type) {
      case 0: // "L" shape
        this.coordinates = [[-1, 0], [0, 0], [1, 0], [1, 1]]
        break
      case 1: // Backwards "L"
        this.coordinates = [[-1, 1], [-1, 0], [0, 0], [1, 0]]
        break
      case 2: // Square
        this.coordinates = [[0, 0], [0, 1], [1, 0], [1, 1]]
        break
      case 3: // Line
        this.coordinates = [[-1, 0], [0, 0], [1, 0], [2, 0]]
        break
      case 4: // Squiggle 1
        this.coordinates = [[-1, 1], [0, 1], [0, 0], [1, 0]]
        break
      case 5: // Squiggle 2
        this.coordinates = [[-1, 0], [0, 0], [0, 1], [1, 1]]
        break
      case 6: // Line with the bump in the middle
        this.coordinates = [[-1, 0], [0, 0], [1, 0], [0, 1]]
        break
      default:
        break
    }
  }

  rotate() {
    if (this.type !== 2) { // don't rotate a square. that's stupid.
      const rotate = (coordinates) => {
        const newCoordinates = []
        coordinates.forEach((coordinate) => {
          const [x, y] = coordinate
          newCoordinates.push([-y, x])
        })
        return newCoordinates
      }
      this.coordinates = rotate(this.coordinates)
      this.orientation = (this.orientation + 1) % 4
      if ((this.type >= 3 && this.type <= 5) // if it's a certain shape, alter rotation
        && this.orientation > 1) {
        this.coordinates = rotate(rotate(this.coordinates))
        this.orientation = 0
      }

      this.coordinates.forEach((coordinate) => {
        const x = coordinate[0]
        if (offLeftLimit(x, this)) {
          this.centerX += blockSize
        }
        if (offRightLimit(x, this)) {
          this.centerX -= blockSize
        }
      })
    }
  }

  render() {
    this.coordinates.forEach((coordinate) => {
      if (coordinate) {
        const [x, y] = coordinate
        const square =  new TetrisSquare(
          this.centerX + x * blockSize,
          this.centerY + y * blockSize,
          this.type
        )
        square.render()
      }
    })
  }
}

export default TetrisBlock
