// how fast the ball goes
const normalSpeed = 4
const computerSpeed = 4

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
    window.context.fillStyle = '#0DFD55'
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
    } else if (this.y + this.height > $(window).height()) {
      this.y = $(window).height() - this.height
      this.y_speed = 0
    }
  }
}

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
    } else if (this.paddle.y + this.paddle.height > $(window).height()) {
      this.paddle.y = $(window).height() - this.paddle.height
    }
  }
}


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
    window.context.fillStyle = '#0DFD55'
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
    } else if (this.y + 5 > $(window).height()) {
      this.y = $(window).height() - 5
      this.y_speed = -this.y_speed
    }

    // goes off the left or right
    if (this.x < 0 || this.x > $(window).width()) {
      if (this.x < 0) {
        userScored()
      } else {
        compScored()
      }
      this.x_speed = normalSpeed
      this.y_speed = Math.floor(Math.random() * 5 - 2) // -2 through 2, inclusive
      this.x = $(window).width() / 4
      this.y = $(window).height() / 2
    }

    // hits right paddle
    if (topX > $(window).width() / 2) {
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

class Player {
  constructor() {
    this.paddle = new Paddle($(window).width() - 20, 175, 10, 50)
  }

  render() {
    this.paddle.x = $(window).width() - 20
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

export default (animate, defaultRender, isPaused) => {
  // keep score
  let compScore = 0
  let yourScore = 0

  const player = new Player()
  const computer = new Computer()
  const ball = new Ball($(window).width() / 4, $(window).height() / 2)

  const keysDown = {}

  const render = () => {
    defaultRender()

    // update score
    $('#compScore').html(compScore)
    $('#yourScore').html(yourScore)

    player.render()
    computer.render()
    ball.render()
  }

  const update = () => {
    player.update(keysDown)
    computer.update(ball)
    const userScored = () => { yourScore += 1 }
    const compScored = () => { compScore += 1 }
    ball.update(player.paddle, computer.paddle, userScored, compScored)
  }

  const step = () => {
    if (!isPaused) {
      update()
      render()
    }
    animate(step)
  }

  animate(step)

  window.addEventListener('keydown', (event) => {
    keysDown[event.keyCode] = true
  })

  window.addEventListener('keyup', (event) => {
    delete keysDown[event.keyCode]
  })
}
