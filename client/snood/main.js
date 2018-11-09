import { hideElementById, updateYourScore } from 'utilities/DisplayUtilities'
import { isSpace }    from 'utilities/EventUtilities'

import Cannon from './cannon'
import Block from './block'
import MouseListener from './mouseListener'
import Meter from './meter'

import {
  cannonCenter, initialDegree, numberRows, numberSteps
} from './constants'
import { findCannonDegree } from './cannonHelpers'
import { gameOverDisplay } from './gameOver'
import { scoreForTurn } from './scoring'

import {
  randomBlockColor, newQueuedBlock, generateInitialBlocks, closestEmptySlot,
  findCollidingBlock, checkForGroup, checkForIslands, findRemainingColors,
} from './blockHelpers'

export default (animate, defaultRender) => {
  hideElementById('pause-container')
  window.canvas.style.cursor = 'none'

  const mouseListener = new MouseListener()
  const cannon = new Cannon(cannonCenter.x, cannonCenter.y, initialDegree)
  const meter = new Meter()

  let fixedBlocks
  let yourDegree
  let yourScore
  let gameOver
  let movingBlock
  let pendingBlock
  let blockMovingToPending
  let nextBlockInQueue
  let flashingBlocks
  let fallingBlocks
  let stepsDown

  const startGame = () => {
    meter.reset()
    fixedBlocks = generateInitialBlocks()
    yourDegree = initialDegree
    yourScore = 0
    gameOver = false
    movingBlock = null
    pendingBlock = new Block(cannonCenter.x, cannonCenter.y, randomBlockColor())
    blockMovingToPending = null
    nextBlockInQueue = newQueuedBlock()
    flashingBlocks = []
    fallingBlocks = []
    stepsDown = 0
  }
  startGame()

  const render = () => {
    cannon.render()
    meter.render()

    fixedBlocks.concat(flashingBlocks).concat(fallingBlocks).concat(
      movingBlock, pendingBlock, nextBlockInQueue, blockMovingToPending
    ).forEach(b => b?.render())
  }

  const update = () => {
    updateYourScore(yourScore)
    yourDegree = findCannonDegree(cannon, mouseListener)
    cannon.update(yourDegree)
    meter.update()

    flashingBlocks.concat(fallingBlocks).forEach(b => b.update())
    // Important: Delete "flashing" blocks once they are done flashing,
    //  so they don't get in the way
    flashingBlocks.removeIfTrue(b => b.flashingCount < 0)

    if (movingBlock) {
      // TODO: Can we move this somewhere else?
      movingBlock.update(fixedBlocks)
      const collidingBlock = findCollidingBlock(fixedBlocks, movingBlock)

      if (collidingBlock || movingBlock.isOffEdge(stepsDown)) {
        const slotToEnter = closestEmptySlot(fixedBlocks, collidingBlock, movingBlock, stepsDown)
        movingBlock.enterIntoSlot(slotToEnter, stepsDown)
        fixedBlocks.push(movingBlock)


        const group = checkForGroup(fixedBlocks, movingBlock)
        let amountToDecrement = 0

        // Hit!!
        if (group.length > 2) {
          flashingBlocks = group
          flashingBlocks.forEach(b => b.startFlashing())
          fixedBlocks.removeElements(flashingBlocks)

          fallingBlocks = checkForIslands(fixedBlocks)
          fallingBlocks.forEach(b => b.startFalling())
          fixedBlocks.removeElements(fallingBlocks)
          if (fallingBlocks.length > 0) {
            amountToDecrement = fallingBlocks.length
          }

          yourScore += scoreForTurn(group.length, fallingBlocks.length)
        }
        if (amountToDecrement > 0) {
          meter.decrementLevel(amountToDecrement)
        } else {
          meter.incrementLevel()
        }

        movingBlock = null
      }
    }


    const deathBlocks = fixedBlocks.filter(b => (b.row + stepsDown) >= (numberRows + numberSteps))
    if (!gameOver && deathBlocks.length > 0) {
      gameOver = true
      deathBlocks.forEach(b => b.setAsSkull())
      gameOverDisplay(false, yourScore, startGame)
    }

    if (meter.shouldMoveBoardDown()) {
      meter.reset()
      stepsDown += 1
      fixedBlocks.concat(flashingBlocks).forEach(b => b.stepDown())
    }

    if (!gameOver && fixedBlocks.length === 0) {
      gameOver = true
      gameOverDisplay(true, yourScore, startGame)
    }

    [pendingBlock, nextBlockInQueue].forEach(b => b?.update())

    if (blockMovingToPending) {
      blockMovingToPending.update()

      if (blockMovingToPending.x <= cannonCenter.x) {
        blockMovingToPending.x = cannonCenter.x
        blockMovingToPending.stopMoving()
        pendingBlock = blockMovingToPending
        blockMovingToPending = null
      }
    }
  }

  const step = () => {
    update()
    defaultRender()
    render()
    animate(step)
  }

  const shoot = () => {
    if (!movingBlock) {
      movingBlock = pendingBlock
      movingBlock.startMoving(yourDegree)

      blockMovingToPending = nextBlockInQueue
      blockMovingToPending.moveToPending()

      pendingBlock = null

      const colorsRemaining = findRemainingColors(fixedBlocks)
      nextBlockInQueue = newQueuedBlock(colorsRemaining)
    }
  }

  document.body.addEventListener('keydown', (event) => {
    if (isSpace(event)) {
      event.preventDefault()
      shoot()
    }
  })
  document.body.addEventListener('click', (event) => {
    event.preventDefault()
    shoot()
  })

  animate(step)
}
