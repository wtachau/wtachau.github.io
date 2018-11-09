import {
  pink, yellow, orange, cyan, red, purple, limeGreen
} from 'constants/colors'

import { distanceBetweenPoints } from 'utilities/MathUtilities'
import {
  randomElement, arrayFrom1ToN, mininumElement, nonNullValues, uniqueValues
} from 'utilities/ArrayUtilities'

import Block from './block'
import {
  queueCenter, numberColumns, numberRows, blockSize, blockBuffer,
  blockOffset, screenSidePadding
} from './constants'

export const randomBlockColor = (colors) => {
  const colorsToChooseFrom = colors || [
    pink, yellow, orange, cyan, red, purple, limeGreen
  ]

  return randomElement(colorsToChooseFrom)
}

export const newQueuedBlock = (colors) => {
  return new Block(queueCenter.x, queueCenter.y, randomBlockColor(colors))
}

export const locationForRowAndColumn = (row, column, steps) => {
  return {
    x: (column * blockSize) / 2 + blockSize / 2 + screenSidePadding,
    y: (row * blockSize + blockSize / 2) + blockOffset * (steps + 1)
  }
}

export const generateInitialBlocks = () => {
  return arrayFrom1ToN(numberRows).flatMap((row) => {
    return arrayFrom1ToN(numberColumns).map((columnRaw) => {
      const column = row % 2 === 0 ? (columnRaw * 2) : (columnRaw * 2 + 1)
      const { x, y } = locationForRowAndColumn(row, column, 0)

      return new Block(x, y, randomBlockColor(), row, column, true)
    })
  })
}

const getNeighboringSlots = (row, column) => {
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
  return fixedBlocks.find((fixedBlock) => {
    return distanceBetweenPoints(fixedBlock, block) <= blockSize + blockBuffer
  })
}

export const matchingBlock = (block1, block2) => {
  return block1.row === block2.row && block1.column === block2.column
}

const blockInGroup = (block, group) => {
  return group.find(b => matchingBlock(block, b))
}

export const closestEmptySlot = (fixedBlocks, block, movingBlock, stepsDown) => {
  let potentialSlots

  if (block) {
    const { row, column } = block

    // if it collided with a block, look at all those neighbors
    potentialSlots = getNeighboringSlots(row, column)
  } else {
    // otherwise look at all first row slots
    potentialSlots = arrayFrom1ToN(numberColumns).map((columnRaw) => {
      const column = columnRaw * 2
      return { row: 0, column }
    })
  }

  const emptySlots = potentialSlots.filter((slot) => {
    return !blockInGroup(slot, fixedBlocks)
  })

  return mininumElement(emptySlots, (slot) => {
    return distanceBetweenPoints(
      locationForRowAndColumn(slot.row, slot.column, stepsDown),
      movingBlock
    )
  })
}

const addNeighborsToGroup = (group, fixedBlocks, slots, color) => {
  slots.forEach((slot) => {
    const existingBlock = fixedBlocks.find((fixedBlock) => {
      return fixedBlock.row === slot.row && fixedBlock.column === slot.column
    })

    if (existingBlock?.color === color) {
      if (!blockInGroup(existingBlock, group)) {
        group.push(existingBlock)
        const { row, column } = existingBlock

        const newNeighbors = getNeighboringSlots(row, column).filter((neighbor) => {
          return !blockInGroup(neighbor, group)
        })

        addNeighborsToGroup(group, fixedBlocks, newNeighbors, color)
      }
    }
  })
}

export const checkForGroup = (fixedBlocks, newBlock) => {
  const group = [newBlock]
  const { row, column, color } = newBlock
  addNeighborsToGroup(group, fixedBlocks, getNeighboringSlots(row, column), color)

  return group
}


const markNeighborsAsFixed = (alreadyMarked, fixedBlocks, block) => {
  const { row, column } = block
  const neighbors = nonNullValues(
    getNeighboringSlots(row, column).map((neighbor) => {
      const existingBlock = blockInGroup(neighbor, fixedBlocks)
      if (existingBlock && !blockInGroup(existingBlock, alreadyMarked)) {
        return existingBlock
      }
      return null
    })
  )

  neighbors.forEach((neighbor) => {
    neighbor.markAsFixed(true)
    alreadyMarked.push(neighbor)
    markNeighborsAsFixed(alreadyMarked, fixedBlocks, neighbor)
  })
}

export const checkForIslands = (fixedBlocks) => {
  // First mark all as not fixed
  fixedBlocks.forEach(b => b.markAsFixed(false))

  const topRow = fixedBlocks.filter(block => block.row === 0)
  const alreadyMarked = []

  topRow.forEach((topRowBlock) => {
    topRowBlock.markAsFixed(true)
    alreadyMarked.push(topRowBlock)
    markNeighborsAsFixed(alreadyMarked, fixedBlocks, topRowBlock)
  })

  return fixedBlocks.filter(b => !b.fixedToBase)
}

export const fixedBlocksWithoutGroup = (fixedBlocks, withoutGroup) => {
  return fixedBlocks.filter((b1) => {
    return !withoutGroup.find(b2 => matchingBlock(b1, b2))
  })
}

export const findRemainingColors = (fixedBlocks) => {
  return uniqueValues(fixedBlocks.map(b => b.color))
}
