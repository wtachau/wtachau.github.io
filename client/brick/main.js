import { monitorKeysPressed } from 'utilities/InteractionUtilities'

import Ball         from './ball'

import Player       from './player'
import gameOver     from './gameOver'
import resetBricks  from './resetBricks'

import {
  originalScore,
} from './constants'

export default (animate, defaultRender, isPaused, togglePause) => {
  // keep score
  let yourScore = originalScore

  const player = new Player()
  const ball = new Ball(window.innerWidth / 4, window.innerHeight / 2)
  let bricks = resetBricks()

  const render = () => {
    document.getElementById('yourScore').innerHTML = yourScore

    player.render()
    ball.render()
    bricks.forEach((brick) => {
      brick.render()
    })
  }

  const resetGame = () => {
    yourScore = originalScore
    ball.restart()
    bricks = resetBricks()
    togglePause()
  }

  const endGame = (didWin) => {
    gameOver(didWin, resetGame, togglePause)
  }

  const keysDown = {}
  const update = () => {
    player.update(keysDown)
    bricks.forEach((brick) => {
      const brickHit = () => {
        bricks.splice(bricks.indexOf(brick), 1)
        if (bricks.length === 0) {
          endGame(true)
        }
      }
      brick.update(ball, brickHit)
    })

    ball.update(player.paddle, () => {
      yourScore -= 1
      if (yourScore === 0) {
        endGame(false)
      }
      ball.restart()
    })
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

  monitorKeysPressed(keysDown)
}
