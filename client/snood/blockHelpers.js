import {
  pink, yellow, orange, cyan, red, purple, limeGreen
} from 'constants/colors'

import { distanceBetweenPoints } from 'utilities/MathUtilities'
import { randomElement, arrayFrom1ToN, mininumElement } from 'utilities/ArrayUtilities'

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

export const locationForRowAndColumn = (row, column) => {
  return {
    x: (column * blockSize) / 2 + blockSize / 2,
    y: row * blockSize + blockSize / 2
  }
}

export const generateInitialBlocks = () => {
  return arrayFrom1ToN(numberRows).flatMap((row) => {
    return arrayFrom1ToN(numberColumns).map((columnRaw) => {
      const column = row % 2 === 0 ? (columnRaw * 2) : (columnRaw * 2 + 1)
      const { x, y } = locationForRowAndColumn(row, column)

      return new Block(x, y, randomBlockColor(), row, column)
    })
  })
}

const getPotentialSlots = (row, column) => {
  const slots = []

  // to the left
  if (column > 1) {
    slots.push({
      row, column: column - 2
    })
  }

  if (column > 0) {
    slots.push({
      row: row + 1, column: column - 1
    })
    if (row > 0) {
      slots.push({
        row: row - 1, column: column - 1
      })
    }
  }

  // to the right
  if (column < 2 * numberColumns - 2) {
    slots.push({
      row, column: column + 2
    })
  }
  if (column < 2 * numberColumns - 1) {
    slots.push({
      row: row + 1, column: column + 1
    })
    if (row > 0) {
      slots.push({
        row: row - 1, column: column + 1
      })
    }
  }
  return slots
}

export const findCollidingBlock = (fixedBlocks, block) => {
  const blockBuffer = -10
  return fixedBlocks.find((fixedBlock) => {
    return distanceBetweenPoints(fixedBlock, block) <= blockSize + blockBuffer
  })
}

export const closestEmptySlot = (fixedBlocks, block, movingBlock) => {
  const { row, column } = block

  const potentialSlots = getPotentialSlots(row, column)

  const emptySlots = potentialSlots.filter((slot) => {
    return !fixedBlocks.find((fixedBlock) => {
      return fixedBlock.row === slot.row && fixedBlock.column === slot.column
    })
  })

  const closestSlot = mininumElement(emptySlots, (slot) => {
    return distanceBetweenPoints(
      locationForRowAndColumn(slot.row, slot.column),
      movingBlock
    )
  })

  return closestSlot
}
