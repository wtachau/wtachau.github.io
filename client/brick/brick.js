import { limeGreen } from 'constants/colors'

import {
  brickWidth,
  brickHeight,
  normalSpeed
} from './constants'

class Brick {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.x_speed = 0
    this.y_speed = 0
  }

  render() {
    window.context.fillStyle = limeGreen
    window.context.fillRect(this.x, this.y, this.width, this.height)
  }

  update(ball, brickHit) {
    // helper values for brick
    const leftX = this.x
    const topY = this.y
    const rightX = this.x + brickWidth
    const bottomY = this.y + brickHeight

    // helper values for ball
    const ballLeftX = ball.x - 5
    const ballTopY = ball.y - 5
    const ballRightX = ball.x + 5
    const ballBottomY = ball.y + 5

    if (ballTopY - normalSpeed < bottomY
      && ballRightX > leftX
      && ballLeftX < rightX
      && ballBottomY + normalSpeed > topY) {
      ball.y = ballTopY + normalSpeed
      ball.y_speed = -ball.y_speed

      brickHit()
    }
  }
}


export default Brick
