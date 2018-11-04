import printMe from './print.js'
import pong from './pong.js'

window.canvas = document.createElement('canvas')
window.canvas.width = $(window).width()
window.canvas.height = $(window).height()
window.context = window.canvas.getContext('2d')
document.getElementById('page1').appendChild(window.canvas)

window.isPaused = false

// todo: don't hardcode path
const playImage = 'https://s3-us-west-2.amazonaws.com/tachauwebsite/images/play.png'
const pauseImage = 'https://s3-us-west-2.amazonaws.com/tachauwebsite/images/pause.png'

// pause
const pauseGame = () => {
  window.isPaused = true
  document.getElementById('pause').src = pauseImage
}

const togglePause = () => {
  window.isPaused = !window.isPaused
  document.getElementById('pause').src = window.isPaused ? playImage : pauseImage
}

const defaultAnimation = (callback) => {
  window.setTimeout(callback, 1000 / 60)
}

const animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || defaultAnimation

const defaultRender = () => {
  window.canvas.width = $(window).width()
  window.canvas.height = $(window).height()

  // set coordinates of elements in canvas
  $('#name').css({ top: $(window).height() / 2 - 60 + 'px' })
  $('#name').css({ left: ($(window).width() - $('#name').width()) / 2 + 'px' })

  $('#subtext').css({ top: $(window).height() / 2 - 20 + 'px' })
  $('#subtext').css({ left: ($(window).width() - $('#subtext').width()) /2 + 'px' })

  $('#yourScore').css({ top: 20 + 'px' })
  $('#yourScore').css({ left: $(window).width() - 40 + 'px' })

  $('#compScore').css({ top: -$(window).height() + 20 })
  $('#compScore').css({ left: 30 })

  window.context.fillRect(0, 0, $(window).width(), $(window).height())
  window.context.fillStyle = '#000000'
}

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

function component() {
  const element = document.createElement('div')
  const btn = document.createElement('button')
  btn.innerHTML = 'Click me and check the console!'
  btn.onclick = printMe
  element.appendChild(btn)
  return element
}

let element = component()
document.body.appendChild(element)

if (module.hot) {
  module.hot.accept('./print.js', () => {
    document.body.removeChild(element)
    element = component()
    document.body.appendChild(element)
  })
}
