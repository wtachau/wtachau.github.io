import { yellow, red } from 'constants/colors'
import {
  screenSidePadding, meterWidth, upAnimationSpeed, downAnimationSpeed,
  meterLevels, meterXPadding, meterYPadding, meterHeight
} from './constants'

class Meter {
  constructor() {
    this.level = 0
    this.displayWidth = 0
  }

  incrementLevel() {
    this.level += 1
  }

  decrementLevel(amount) {
    if (amount < this.level) {
      this.level -= amount
    } else {
      this.level = 0
    }
  }

  shouldMoveBoardDown() {
    return this.level > meterLevels
  }

  reset() {
    this.level = 0
  }

  desiredDisplayWidth() {
    return this.level * (meterWidth / meterLevels)
  }

  update() {
    const tooLow = this.displayWidth < this.desiredDisplayWidth() - upAnimationSpeed
    const tooHigh = this.displayWidth > this.desiredDisplayWidth() + downAnimationSpeed
    if (tooLow) {
      this.displayWidth += upAnimationSpeed
    } else if (tooHigh) {
      this.displayWidth -= downAnimationSpeed
    } else {
      this.displayWidth = this.desiredDisplayWidth()
    }
  }

  render() {
    const meterX = meterXPadding + screenSidePadding
    const meterY = window.innerHeight - meterYPadding - meterHeight

    window.context.fillStyle = red
    window.context.fillRect(
      meterX,
      meterY,
      meterWidth,
      meterHeight
    )

    window.context.fillStyle = yellow
    window.context.fillRect(
      meterX,
      meterY,
      this.displayWidth,
      meterHeight
    )
  }
}

export default Meter
