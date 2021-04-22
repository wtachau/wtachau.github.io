const movingSpeed = 14;
const blockSize = movingSpeed * 6;
const numBlocks = 4;
const maxBlocks = 13; // 2 ^ 13 = 8,192
const newBlockDelay = 5;
const sizeOfPop = 5;

module.exports = {
  blockSize,
  numBlocks,
  movingSpeed,
  newBlockDelay,
  sizeOfPop,
};
