import { monitorKeysPressed } from 'utilities/InteractionUtilities'
import { updateYourScore, updateComputerScore } from 'utilities/DisplayUtilities'

import Ball     from './ball'
import Computer from './computer'
import Player   from './player'

export default (animate, defaultRender, isPaused) => {
  let compScore = 0
  let yourScore = 0

  const player = new Player()
  const computer = new Computer()
  const ball = new Ball(window.innerWidth / 4, window.innerHeight / 2)

  const keysDown = {}
  monitorKeysPressed(keysDown)

  const render = () => {
    updateYourScore(yourScore)
    updateComputerScore(compScore)

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
}
