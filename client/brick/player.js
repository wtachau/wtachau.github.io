import Paddle from './paddle'

const paddleSpeed = 5
const paddleWidth = 100
const paddleHeight = 10

class Player {
  constructor() {
    this.paddle = new Paddle(window.innerWidth / 2, window.innerHeight - 60, paddleWidth, paddleHeight)
  }

  render() {
    this.paddle.render()
  }

  update(keysDown) {
    Object.keys(keysDown).forEach((key) => {
      const value = Number(key)
      if (value === 37) {
        this.paddle.move(-paddleSpeed, 0)
      } else if (value === 39) {
        this.paddle.move(paddleSpeed, 0)
      } else {
        this.paddle.move(0, 0)
      }
    })
  }
}

export default Player
