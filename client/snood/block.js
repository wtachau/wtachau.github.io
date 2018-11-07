import { black, white } from 'constants/colors'
import { degreesToRadians, getRandomNumber } from 'utilities/MathUtilities'
import { arrayFrom1ToN } from 'utilities/ArrayUtilities'

import { locationForRowAndColumn } from './blockHelpers'
import {
  blockSpeed, blockSize, flashingSpeed, numberOfFlashes,
  fallingAcceleration, initialUpwardsMomentum, horizontalSpeedMax
} from './constants'

class Block {
  constructor(x, y, color, row, column, fixedToBase = false) {
    this.x = x
    this.y = y
    this.row = row
    this.column = column
    this.color = color

    this.isMoving = false
    this.movementDegree = 0

    this.isFlashing = false
    this.flashingCount = 0

    this.isFalling = false
    this.fallingSpeed = 0
    this.sideSpeed = 0

    this.fixedToBase = fixedToBase
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

    if (this.isFlashing) {
      const shouldBeWhite = this.flashingCount > 0 && parseInt(this.flashingCount / flashingSpeed) % 2 !== 0
      c.fillStyle = shouldBeWhite ? white : black
    } else {
      c.fillStyle = this.color
    }
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
    if (this.isFlashing) {
      this.flashingCount -= 1
    }
    if (this.isFalling) {
      this.x += this.sideSpeed
      this.y += this.fallingSpeed
      this.fallingSpeed += fallingAcceleration
    }
  }

  enterIntoSlot(slot) {
    const { row, column } = slot
    const { x, y } = locationForRowAndColumn(row, column)
    this.x = x
    this.y = y
    this.row = row
    this.column = column
    this.stopMoving()
    this.markAsFixed(true)
  }

  moveToPending() {
    this.startMoving(-90)
  }

  startMoving(degree) {
    this.isMoving = true
    this.movementDegree = degree
  }

  stopMoving() {
    this.isMoving = false
  }

  startFlashing() {
    this.isFlashing = true
    this.markAsFixed(false)
    this.flashingCount = numberOfFlashes * 2 * flashingSpeed
  }

  startFalling() {
    this.isFalling = true
    this.markAsFixed(false)
    this.fallingSpeed = -initialUpwardsMomentum
    this.sideSpeed = getRandomNumber(-horizontalSpeedMax, horizontalSpeedMax)
  }

  markAsFixed(fixed) {
    this.fixedToBase = fixed
  }

  isOffEdge() {
    // todo: handle when floor moves up
    return this.y < blockSize / 2
  }
}

export default Block
