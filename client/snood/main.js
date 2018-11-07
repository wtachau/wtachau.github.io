import { hideElementById } from 'utilities/DisplayUtilities'
import { isSpace }    from 'utilities/EventUtilities'
// import { removeIfTrue } from 'utilities/ArrayUtilities'

import Cannon from './cannon'
import Block from './block'
import MouseListener from './mouseListener'

import {
  cannonCenter, blockSize
} from './constants'

import {
  findCannonDegree
} from './cannonHelpers'

import {
  randomBlockColor,
  newQueuedBlock,
  generateInitialBlocks,
  closestEmptySlot,
  findCollidingBlock,
  checkForGroup,
  checkForIslands
} from './blockHelpers'

export default (animate, defaultRender) => {
  hideElementById('pause-container')
  // window.canvas.style.cursor = 'none'

  const initialDegree = -45

  let yourDegree = initialDegree

  const fixedBlocks = generateInitialBlocks()

  let movingBlock = null
  let pendingBlock = new Block(cannonCenter.x, cannonCenter.y, randomBlockColor())
  let blockMovingToPending = null
  let nextBlockInQueue = newQueuedBlock()
  let flashingBlocks = []
  let fallingBlocks = []

  const mouseListener = new MouseListener()
  const cannon = new Cannon(cannonCenter.x, cannonCenter.y, initialDegree)

  const render = () => {
    cannon.render()

    fixedBlocks.concat(flashingBlocks).concat(fallingBlocks).concat(
      movingBlock, pendingBlock, nextBlockInQueue, blockMovingToPending
    ).forEach(b => b?.render())
  }

  const update = () => {
    yourDegree = findCannonDegree(cannon, mouseListener)
    cannon.update(yourDegree)

    flashingBlocks.concat(fallingBlocks).map(b => b.update())
    // Important: Delete "flashing" blocks once they are done flashing,
    //  so they don't get in the way
    flashingBlocks.removeIfTrue(b => b.flashingCount < 0)

    if (movingBlock) {
      // TODO: Can we move this somewhere else?
      movingBlock.update(fixedBlocks)
      const collidingBlock = findCollidingBlock(fixedBlocks, movingBlock)

      if (collidingBlock || movingBlock.isOffEdge()) {
        const slotToEnter = closestEmptySlot(fixedBlocks, collidingBlock, movingBlock)
        movingBlock.enterIntoSlot(slotToEnter)
        fixedBlocks.push(movingBlock)

        const group = checkForGroup(fixedBlocks, movingBlock)

        if (group.length > 2) {
          flashingBlocks = group
          flashingBlocks.forEach(b => b.startFlashing())
          fixedBlocks.removeElements(flashingBlocks)

          fallingBlocks = checkForIslands(fixedBlocks)
          fallingBlocks.forEach(b => b.startFalling())
          fixedBlocks.removeElements(fallingBlocks)
        }

        movingBlock = null
      }
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
      nextBlockInQueue = newQueuedBlock()
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
