/* General */
const initialDegree = -45
const numberRows = 6
const numberSteps = 6
const numberColumns = 18

/* Cannon */
const cannonLoadingWidth = window.innerHeight / 75
const cannonWidth = 1.5 * cannonLoadingWidth
const cannonHeight = 80
const bottomPadding = window.innerHeight / 8
const queuePadding = bottomPadding

/* Screen */
const rowCeiling = window.innerHeight - bottomPadding - cannonHeight - (cannonWidth / 2)
const blockSize = rowCeiling / (numberRows + numberSteps + 1)
const screenWidth = blockSize * (numberColumns + 0.5)
const screenSidePadding = (window.innerWidth - screenWidth) / 2

/* Cannons, continued */
const cannonLoadingRadius =  (blockSize * 2) / 3

/* Blocks */
const blockSpeed = 15
const blockOffset = blockSize
const flashingSpeed = 5
const numberOfFlashes = 2
const fallingAcceleration = 1.2
const initialUpwardsMomentum = 5
const horizontalSpeedMax = 6


// This controls how much two blocks must overlap before they hit eachother
const blockBuffer = -12

/* Meter */
const meterLevels = 8
const meterXPadding = 40
const meterYPadding = 20
const meterHeight = 20
const meterWidth = screenWidth - 2 * meterXPadding
const upAnimationSpeed = 3
const downAnimationSpeed = 10

const cannonCenter = {
  x: window.innerWidth / 2,
  y: window.innerHeight - bottomPadding
}

const queueCenter = {
  x: window.innerWidth - screenSidePadding - queuePadding,
  y: window.innerHeight - bottomPadding
}

module.exports = {
  initialDegree,
  numberSteps,
  numberColumns,
  numberRows,

  screenWidth,
  screenSidePadding,

  cannonWidth,
  cannonHeight,
  cannonLoadingRadius,
  cannonLoadingWidth,

  cannonCenter,
  queueCenter,

  blockSpeed,
  blockSize,
  blockOffset,

  flashingSpeed,
  numberOfFlashes,
  fallingAcceleration,
  initialUpwardsMomentum,
  horizontalSpeedMax,
  blockBuffer,

  meterLevels,
  meterXPadding,
  meterYPadding,
  meterHeight,
  meterWidth,
  upAnimationSpeed,
  downAnimationSpeed
}
