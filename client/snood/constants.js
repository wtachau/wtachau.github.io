const bottomPadding = 60
const queuePadding = 100

const numberRows = 8
const numberColumns = 18

const blockSpeed = 10
const blockSize = window.innerWidth / (numberColumns + 0.5)

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
  numberRows
}
