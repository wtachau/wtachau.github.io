import { hideElementById } from 'utilities/DisplayUtilities'
import { isSpace }    from 'utilities/EventUtilities'

import Cannon from './cannon'
import Block from './block'
import MouseListener from './mouseListener'

import { cannonCenter } from './constants'


import {
  findCannonDegree
} from './cannonHelpers'

import {
  randomBlockColor,
  newQueuedBlock,
  generateInitialBlocks,
  closestEmptySlot,
  findCollidingBlock
} from './blockHelpers'

export default (animate, defaultRender) => {
  hideElementById('pause-container')
  window.canvas.style.cursor = 'none'

  const initialDegree = -45

  let yourDegree = initialDegree

  let movingBlock = null
  let pendingBlock = new Block(cannonCenter.x, cannonCenter.y, randomBlockColor())
  let blockMovingToPending = null
  let nextBlockInQueue = newQueuedBlock()
  const fixedBlocks = generateInitialBlocks()

  const mouseListener = new MouseListener()
  const cannon = new Cannon(cannonCenter.x, cannonCenter.y, initialDegree)

  const render = () => {
    cannon.render()

    fixedBlocks.concat(
      movingBlock, pendingBlock, nextBlockInQueue, blockMovingToPending
    ).forEach(b => b?.render())
  }

  const update = () => {
    yourDegree = findCannonDegree(cannon, mouseListener)

    cannon.update(yourDegree)
    movingBlock?.update(fixedBlocks)

    if (movingBlock) {
      const collidingBlock = findCollidingBlock(fixedBlocks, movingBlock)

      if (collidingBlock) {
        const slotToEnter = closestEmptySlot(fixedBlocks, collidingBlock, movingBlock)
        movingBlock.enterIntoSlot(slotToEnter)
        fixedBlocks.push(movingBlock)
        movingBlock = null
      }
    }

    const blocksToUpdate = [pendingBlock, nextBlockInQueue]
    blocksToUpdate.forEach(b => b?.update())

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

  document.body.addEventListener('keydown', (event) => {
    if (isSpace(event)) {
      event.preventDefault()

      if (!movingBlock) {
        movingBlock = pendingBlock
        movingBlock.startMoving(yourDegree)

        pendingBlock = null

        blockMovingToPending = nextBlockInQueue
        blockMovingToPending.startMoving(-90)

        nextBlockInQueue = newQueuedBlock()
      }
    }
  })

  animate(step)
}
