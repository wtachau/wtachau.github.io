import { updateYourScore } from 'utilities/DisplayUtilities'

import TetrisBlock from './tetrisBlock'

import {
  blockSize,
  widthInBlocks,
} from './constants'

import {
  anyCollisions
} from './helpers'

export default (animate, defaultRender, isPaused) => {
  let yourScore = 0
  let blocks = []
  let lastBlock

  const newTetrisBlock = () => {
    const type = Math.floor((Math.random() * 7)) // between 0-5
    blocks.push(new TetrisBlock(type))
    lastBlock = blocks[blocks.length - 1]
  }
  newTetrisBlock()

  /*
   * Main functions of game
   */
  function checkForFullRows() {
    // construct data structure
    const rows = {}
    blocks.forEach((block) => {
      block.coordinates.forEach((blockCoordinate, j) => {
        if (blockCoordinate) {
          const [xCoordinate, yCoordinate] = blockCoordinate

          const x = block.centerX + xCoordinate * blockSize
          const y = block.centerY + yCoordinate * blockSize
          const newEntry = {
            x,
            coordinatesRef: block.coordinates,
            index: j
          }
          if (y in rows) {
            rows[y].push(newEntry)
          } else {
            rows[y] = [newEntry]
          }
        }
      })
    })

    // see if any are full
    const rowsDeleted = []
    Object.keys(rows).forEach((key) => {
      if (rows[key].length >= widthInBlocks) {
        rows[key].forEach((dict) => {
          const { coordinatesRef, index } = dict
          delete coordinatesRef[index]
        })
        rowsDeleted.push(key)
      }
    })

    // then visually delete empty rows
    rowsDeleted.forEach((rowToDelete) => {
      yourScore += 10

      blocks.forEach((block) => {
        block.coordinates.forEach((blockCoordinate, index) => {
          if (blockCoordinate) {
            const [xCoordinate, yCoordinate] = blockCoordinate

            if (block.centerY + yCoordinate * blockSize < rowToDelete) {
              block.coordinates[index] = [xCoordinate, yCoordinate + 1]
            }
          }
        })
      })
    })
  }

  const gameOver = () => {
    // maybe flash blocks off and on, with 'you lose'
    blocks = []
    yourScore = 0
    newTetrisBlock()
  }

  const moveDownAndCheckForCollisions = () => {
    lastBlock.centerY += blockSize
    if (anyCollisions(blocks, lastBlock)) {
      lastBlock.centerY -= blockSize
      checkForFullRows()
      newTetrisBlock()
      if (anyCollisions(blocks, lastBlock)) {
        gameOver()
      }
    }
  }

  const moveSidewaysAndCheckForCollisions = (right) => {
    lastBlock.centerX += right ? blockSize : -blockSize
    if (anyCollisions(blocks, lastBlock)) {
      lastBlock.centerX -= right ? blockSize : -blockSize
    }
  }

  const render = () => {
    updateYourScore(yourScore)
    blocks.map(b => b.render())
  }


  const update = () => {
    moveDownAndCheckForCollisions()
  }

  const step = () => {
    if (!isPaused()) {
      update()
    }
    defaultRender()
    render()
  }

  setInterval(step, 400)


  window.addEventListener('keydown', (event) => {
    if (!isPaused()) {
      lastBlock = blocks[blocks.length - 1]
      const value = Number(event.keyCode)
      if (value === 40) { // down
        moveDownAndCheckForCollisions()
      } else if (value === 39) { // right
        moveSidewaysAndCheckForCollisions(true)
      } else if (value === 38) { // up
        lastBlock.rotate()
      } else if (value === 37) { // left
        moveSidewaysAndCheckForCollisions(false)
      }
      defaultRender()
      render()
    }
  })
}
