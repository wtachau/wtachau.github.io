import Paddle from './paddle'

const computerSpeed = 4

class Computer {
  constructor() {
    this.paddle = new Paddle(10, 175, 10, 50)
  }

  render() {
    this.paddle.render()
  }

  update(ball) {
    const yPos = ball.y
    let diff = -((this.paddle.y + (this.paddle.height / 2)) - yPos)

    if (diff < -4) {
      diff = -computerSpeed
    } else if (diff > 4) {
      diff = computerSpeed
    }
    this.paddle.move(0, diff)
    if (this.paddle.y < 0) {
      this.paddle.y = 0
    } else if (this.paddle.y + this.paddle.height > window.innerHeight) {
      this.paddle.y = window.innerHeight - this.paddle.height
    }
  }
}

export default Computer
