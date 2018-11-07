const bottomPadding = 60
const queuePadding = 100

const numberRows = 6
const numberColumns = 18

const blockSpeed = 15
const blockSize = window.innerWidth / (numberColumns + 0.5)

const flashingSpeed = 5
const numberOfFlashes = 2
const fallingAcceleration = 1.2
const initialUpwardsMomentum = 5
const horizontalSpeedMax = 6

// This controls how much two blocks must overlap before they hit eachother
const blockBuffer = -12

const cannonCenter = {
  x: window.innerWidth / 2,
  y: window.innerHeight - bottomPadding
}

const queueCenter = {
  x: window.innerWidth - queuePadding,
  y: window.innerHeight - bottomPadding
}

module.exports = {
  cannonCenter,
  queueCenter,
  blockSpeed,
  blockSize,
  numberColumns,
  numberRows,
  flashingSpeed,
  numberOfFlashes,
  fallingAcceleration,
  initialUpwardsMomentum,
  horizontalSpeedMax,
  blockBuffer
}
