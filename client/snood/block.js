import { black, white } from 'constants/colors'
import { degreesToRadians, getRandomNumber } from 'utilities/MathUtilities'
import { arrayFrom1ToN } from 'utilities/ArrayUtilities'

import { locationForRowAndColumn } from './blockHelpers'
import {
  screenSidePadding,
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

    this.isSkull = false

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

    if (this.isSkull) {
      c.fillStyle = white
      c.fill()
      window.context.drawImage(
        document.getElementById('skull'),
        this.x - blockSize / 3,
        this.y - blockSize / 3,
        blockSize * 2 / 3,
        blockSize * 2 / 3
      )
    } else {
      if (this.isFlashing) {
        const shouldBeWhite = this.flashingCount > 0 && parseInt(this.flashingCount / flashingSpeed) % 2 !== 0
        c.fillStyle = shouldBeWhite ? white : black
      } else {
        c.fillStyle = this.color
      }
      c.fill()
    }
  }

  setAsSkull() {
    this.isSkull = true
  }

  update() {
    if (this.isMoving) {
      const radians = degreesToRadians(this.movementDegree - 90)
      this.x = blockSpeed * Math.cos(radians) + this.x
      this.y = blockSpeed * Math.sin(radians) + this.y

      // goes off the left or right
      const leftBorder = screenSidePadding + blockSize / 2
      const rightBorder = window.innerWidth - screenSidePadding - blockSize / 2
      if (this.x < leftBorder || this.x > rightBorder) {
        this.movementDegree = -this.movementDegree
        if (this.x < leftBorder) {
          this.x = leftBorder
        } else {
          this.x = rightBorder
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

  enterIntoSlot(slot, stepsDown) {
    const { row, column } = slot
    const { x, y } = locationForRowAndColumn(row, column, stepsDown)
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

  isOffEdge(stepsDown) {
    return this.y < (blockSize / 2 + ((stepsDown + 1) * blockSize))
  }

  stepDown() {
    this.y += blockSize
  }
}

export default Block
