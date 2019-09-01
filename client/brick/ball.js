import { limeGreen } from 'constants/colors'
import { normalSpeed } from './constants'

class Ball {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.x_speed = normalSpeed
    this.y_speed = normalSpeed
  }

  render() {
    window.context.beginPath()
    window.context.arc(this.x, this.y, 5, 2 * Math.PI, false)
    window.context.fillStyle = limeGreen
    window.context.fill()
  }

  restart() {
    this.y_speed = -normalSpeed
    this.x_speed = Math.floor(Math.random() * 5 - 2) // -2 through 2, inclusive
    this.x = window.innerWidth / 2
    this.y = window.innerHeight - 70
  }

  update(paddle, pointLost) {
    this.x += this.x_speed
    this.y += this.y_speed
    const topX = this.x - paddle.height
    const topY = this.y - paddle.height
    const bottomX = this.x + paddle.height
    const bottomY = this.y + paddle.height

    // bounce off the top or bottom
    if (this.y - 5 < 0) {
      this.y = 5
      this.y_speed = -this.y_speed
    } else if (this.y + 5 > window.innerHeight) {
      pointLost()
    }

    // goes off the left or right
    if (this.x < 0 || this.x > window.innerWidth) {
      this.x_speed = -this.x_speed
      if (this.x < 0) {
        this.x = 5
      } else {
        this.x = window.innerWidth - 5
      }
    }

    // hits paddle
    if (topY < (paddle.y + paddle.width) && bottomY > paddle.y && topX < (paddle.x + paddle.width) && bottomX > paddle.x) {
      const speed = (this.x - paddle.x - paddle.width / 2) / 8
      this.y_speed = -normalSpeed
      this.x_speed += speed
      this.y += this.y_speed
    }
  }
}

export default Ball
