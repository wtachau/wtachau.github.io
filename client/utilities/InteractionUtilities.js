const monitorKeysPressed = (keysDown) => {
  window.addEventListener('keydown', (event) => {
    keysDown[event.keyCode] = true
  })

  window.addEventListener('keyup', (event) => {
    delete keysDown[event.keyCode]
  })
}

module.exports = {
  monitorKeysPressed
}
