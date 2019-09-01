const monitorKeysPressed = (keysDown) => {
  window.addEventListener('keydown', (event) => {
    keysDown[event.keyCode] = true
  })

  window.addEventListener('keyup', (event) => {
    delete keysDown[event.keyCode]
  })
}

const monitorKeysPressedInOrder = (keysDown) => {
  window.addEventListener('keydown', (event) => {
    keysDown.push(event.keyCode)
  })
}

module.exports = {
  monitorKeysPressed,
  monitorKeysPressedInOrder
}
