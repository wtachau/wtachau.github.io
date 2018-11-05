import { limeGreen } from 'constants/colors'

const normalSpeed = 4

class Ball {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.x_speed = normalSpeed
    this.y_speed = 1
  }

  render() {
    window.context.beginPath()
    window.context.arc(this.x, this.y, 5, 2 * Math.PI, false)
    window.context.fillStyle = limeGreen
    window.context.fill()
  }

  update(paddle1, paddle2, userScored, compScored) {
    this.x += this.x_speed
    this.y += this.y_speed
    const topX = this.x - 5
    const topY = this.y - 5
    const bottomX = this.x + 5
    const bottomY = this.y + 5

    // bounce off the top or bottom
    if (this.y - 5 < 0) {
      this.y = 5
      this.y_speed = -this.y_speed
    } else if (this.y + 5 > window.innerHeight) {
      this.y = window.innerHeight - 5
      this.y_speed = -this.y_speed
    }

    // goes off the left or right
    if (this.x < 0 || this.x > window.innerWidth) {
      if (this.x < 0) {
        userScored()
      } else {
        compScored()
      }
      this.x_speed = normalSpeed
      this.y_speed = Math.floor(Math.random() * 5 - 2) // -2 through 2, inclusive
      this.x = window.innerWidth / 4
      this.y = window.innerHeight / 2
    }

    // hits right paddle
    if (topX > window.innerWidth / 2) {
      if (topX < (paddle1.x + paddle1.width) && bottomX > paddle1.x && topY < (paddle1.y + paddle1.height) && bottomY > paddle1.y) {
        this.x_speed = -normalSpeed
        this.y_speed += (paddle1.y_speed / 2)
        this.x += this.x_speed
      }
    // hits left paddle
    } else if (topX < (paddle2.x + paddle2.width) && bottomX > paddle2.x && topY < (paddle2.y + paddle2.height) && bottomY > paddle2.y) {
      this.x_speed = normalSpeed
      this.y_speed += (paddle2.y_speed / 2)
      this.x += this.x_speed
    }
  }
}

export default Ball
