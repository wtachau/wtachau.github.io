const blockSize = 25
const widthInBlocks = 13
const trueCenter = (window.innerWidth - blockSize) / 2
const centerScreen =  Math.floor(trueCenter / blockSize) * blockSize
const leftLimit = centerScreen - ((widthInBlocks - 1) / 2) * blockSize
const rightLimit = centerScreen + ((widthInBlocks - 1) / 2) * blockSize

module.exports = {
  blockSize,
  widthInBlocks,
  trueCenter,
  centerScreen,
  leftLimit,
  rightLimit,
}
