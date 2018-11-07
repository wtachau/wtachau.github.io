import {
  pink, yellow, orange, cyan, red, purple, limeGreen
} from 'constants/colors'

import { distanceBetweenPoints } from 'utilities/MathUtilities'
import { randomElement, arrayFrom1ToN, mininumElement, nonNullValues } from 'utilities/ArrayUtilities'

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
  const blockBuffer = -10
  return fixedBlocks.find((fixedBlock) => {
    return distanceBetweenPoints(fixedBlock, block) <= blockSize + blockBuffer
  })
}

export const matchingBlock = (block1, block2) => {
  return block1.row === block2.row && block1.column === block2.column
}

export const closestEmptySlot = (fixedBlocks, block, movingBlock) => {
  const { row, column } = block

  const potentialSlots = getNeighboringSlots(row, column)

  const emptySlots = potentialSlots.filter((slot) => {
    return !fixedBlocks.find(fixedBlock => matchingBlock(fixedBlock, slot))
  })

  const closestSlot = mininumElement(emptySlots, (slot) => {
    return distanceBetweenPoints(
      locationForRowAndColumn(slot.row, slot.column),
      movingBlock
    )
  })

  return closestSlot
}


const addNeighborsToGroup = (group, fixedBlocks, slots, color) => {
  slots.forEach((slot) => {
    const existingBlock = fixedBlocks.find((fixedBlock) => {
      return fixedBlock.row === slot.row && fixedBlock.column === slot.column
    })

    if (existingBlock?.color === color) {
      if (!group.find(groupBlock => matchingBlock(groupBlock, existingBlock))) {
        group.push(existingBlock)
        const { row, column } = existingBlock

        const newNeighbors = getNeighboringSlots(row, column).filter((neighbor) => {
          return !group.find(blockInGroup => matchingBlock(blockInGroup, neighbor))
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

const blockInSet = (block, set) => {
  return set.find(b => matchingBlock(block, b))
}

const markNeighborsAsFixed = (alreadyMarked, fixedBlocks, block) => {
  const { row, column } = block
  const neighbors = nonNullValues(
    getNeighboringSlots(row, column).map((neighbor) => {
      const existingBlock = blockInSet(neighbor, fixedBlocks)
      if (existingBlock && !blockInSet(existingBlock, alreadyMarked)) {
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
