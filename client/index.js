import {
  animate, defaultRender, addCanvas, removeCanvas
} from 'utilities/AnimationUtilities'

import pong from './pong/main.js'

let paused = false

// pause
// const pauseGame = () => {
//   paused = true
//   document.getElementById('pause').src = pauseImage
// }

const togglePause = () => {
  const pauseElement = document.getElementById('pause')
  const playElement = document.getElementById('play')

  if (paused) {
    pauseElement.style.display = 'none'
    playElement.style.display = 'block'
  } else {
    pauseElement.style.display = 'block'
    playElement.style.display = 'none'
  }
  paused = !paused
}

const isPaused = () => {
  return paused
}

addCanvas()
pong(animate, defaultRender, isPaused)

// Decide which game to play
// const games = [play_pong, play_snake, play_brick, play_tetris]
// const gameChoice = Math.floor((Math.random() * games.length))
// games[gameChoice]()

// To prevent scroll on down key, and set pause for space
document.body.addEventListener('keydown', (e) => {
  if (e.keyCode === 40) { // down arrow
    e.preventDefault()
  } else if (e.keyCode === 32) { // space
    e.preventDefault()
    togglePause()
  }
})

if (module.hot) {
  const reset = () => {
    removeCanvas()
    addCanvas()

    pong(animate, defaultRender, isPaused)
  }
  module.hot.accept('pong/main', reset)
  module.hot.accept('utilities/AnimationUtilities', reset)
}
