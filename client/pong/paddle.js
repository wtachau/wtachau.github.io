import { limeGreen } from 'constants/colors'

class Paddle {
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

  move(x, y) {
    this.x += x
    this.y += y
    this.x_speed = x
    this.y_speed = y
    if (this.y < 0) {
      this.y = 0
      this.y_speed = 0
    } else if (this.y + this.height > window.innerHeight) {
      this.y = window.innerHeight - this.height
      this.y_speed = 0
    }
  }
}

export default Paddle
