import Paddle from './paddle'

class Player {
  constructor() {
    this.paddle = new Paddle(window.innerWidth - 20, 175, 10, 50)
  }

  render() {
    this.paddle.x = window.innerWidth - 20
    this.paddle.render()
  }

  update(keysDown) {
    Object.keys(keysDown).forEach((key) => {
      const value = Number(key)
      if (value === 38) {
        this.paddle.move(0, -4)
      } else if (value === 40) {
        this.paddle.move(0, 4)
      } else {
        this.paddle.move(0, 0)
      }
    })
  }
}

export default Player
