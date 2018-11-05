import {
  pink, yellow, orange, cyan, red, purple, limeGreen
} from 'constants/colors'

import { randomElement, arrayFrom1ToN } from 'utilities/ArrayUtilities'

import Block from './block'
import {
  queueCenter, numberColumns, numberRows, blockSize
} from './constants'

export const randomBlockColor = () => {
  return randomElement([
    pink, yellow, orange, cyan, red, purple, limeGreen
  ])
}

export const newQueuedBlock = () => {
  return new Block(queueCenter.x, queueCenter.y, randomBlockColor())
}

export const generateInitialBlocks = () => {
  return arrayFrom1ToN(numberRows).flatMap((rowNum) => {
    return arrayFrom1ToN(numberColumns).map((colNum) => {
      const xOffset = rowNum % 2 === 0 ? blockSize / 2 : blockSize

      return new Block(
        colNum * blockSize + xOffset,
        rowNum * blockSize + blockSize / 2,
        randomBlockColor()
      )
    })
  })
}
