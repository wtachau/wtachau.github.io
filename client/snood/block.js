import { degreesToRadians } from 'utilities/DisplayUtilities'
import { arrayFrom1ToN } from 'utilities/ArrayUtilities'
import { blockSpeed, blockSize } from './constants'

class Block {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    this.isMoving = false
    this.movementDegree = 0
  }

  render() {
    const blockRadius = blockSize / 2
    const c = window.context
    c.beginPath()
    c.moveTo(this.x + blockRadius * Math.cos(0), this.y + blockRadius * Math.sin(0))

    const numberOfSides = 6
    arrayFrom1ToN(numberOfSides).forEach((i) => {
      c.lineTo(
        this.x + blockRadius * Math.cos(i * 2 * Math.PI / numberOfSides),
        this.y + blockRadius * Math.sin(i * 2 * Math.PI / numberOfSides)
      )
    })

    c.fillStyle = this.color
    c.fill()
  }

  update() {
    if (this.isMoving) {
      const radians = degreesToRadians(this.movementDegree - 90)
      this.x = blockSpeed * Math.cos(radians) + this.x
      this.y = blockSpeed * Math.sin(radians) + this.y

      // goes off the left or right
      if (this.x < blockSize / 2 || this.x > window.innerWidth - blockSize / 2) {
        this.movementDegree = -this.movementDegree
        if (this.x < blockSize / 2) {
          this.x = blockSize / 2
        } else {
          this.x = window.innerWidth - blockSize / 2
        }
      }
    }
  }

  startMoving(degree) {
    this.isMoving = true
    this.movementDegree = degree
  }

  stopMoving() {
    this.isMoving = false
  }
}

export default Block
