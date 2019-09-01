const originalScore = 3
const numBricks = 50
const numRows = 5
const numColumns = numBricks / numRows
const padding = 5
const brickWidth = window.innerWidth / numColumns
const brickHeight = 30
const topPadding = 50
const flashTimes = 2
const pauseTime = 1000
const normalSpeed = 5

module.exports = {
  originalScore,
  numBricks,
  numRows,
  numColumns,
  padding,
  brickWidth,
  brickHeight,
  topPadding,
  flashTimes,
  pauseTime,
  normalSpeed
}
