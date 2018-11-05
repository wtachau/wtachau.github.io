import Player from './player'
import Computer from './computer'
import Ball from './ball'

export default (animate, defaultRender, isPaused) => {
  // keep score
  let compScore = 0
  let yourScore = 0

  const player = new Player()
  const computer = new Computer()
  const ball = new Ball(window.innerWidth / 4, window.innerHeight / 2)

  const keysDown = {}

  const render = () => {
    // update score
    document.getElementById('compScore').innerHTML = compScore
    document.getElementById('yourScore').innerHTML = yourScore

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
    if (!isPaused()) {
      update()
    }
    defaultRender()
    render()
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
