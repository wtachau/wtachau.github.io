import {
  hideElement,
  showElement,
  showElementById,
  hideElementById
} from 'utilities/DisplayUtilities'

import {
  flashTimes,
  pauseTime,
} from './constants'

export default (didWin, resetGame, togglePause) => {
  hideElementById('name')
  hideElementById('subtext')
  hideElementById('yourScore')

  let count = 0

  const flashMessage = (message) => {
    togglePause()
    const brickTextElement = document.getElementById('brick_text')
    brickTextElement.innerHTML = message

    let hideMessage
    const showMessage = () => {
      showElement(brickTextElement)
      setTimeout(hideMessage, pauseTime)
    }
    hideMessage = () => {
      hideElement(brickTextElement)
      if (count === flashTimes) {
        showElementById('name')
        showElementById('subtext')
        showElementById('yourScore')
        resetGame()
      } else {
        count += 1
        setTimeout(showMessage, pauseTime)
      }
    }
    showMessage()
    brickTextElement.style.top = window.innerHeight / 2 - 60 + 'px'
    brickTextElement.style.left = (window.innerWidth - brickTextElement.clientWidth) / 2 + 'px'
  }

  flashMessage(didWin ? 'you won!!!' : 'whoops! you lost :(')
}
