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
  generateInitialBlocks
} from './blockHelpers'

export default (animate, defaultRender) => {
  hideElementById('pause-container')

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

    fixedBlocks.forEach((block) => {
      block.render()
    })

    if (movingBlock) { movingBlock.render() }
    pendingBlock.render()
    nextBlockInQueue.render()


    if (blockMovingToPending) { blockMovingToPending.render() }
  }

  const update = () => {
    yourDegree = findCannonDegree(cannon, mouseListener)

    cannon.update(yourDegree)

    if (movingBlock) {
      movingBlock.update()
    }

    pendingBlock.update()
    nextBlockInQueue.update()

    if (blockMovingToPending) {
      blockMovingToPending.update()

      if (blockMovingToPending.x <= cannonCenter.x) {
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

      movingBlock = pendingBlock
      movingBlock.startMoving(yourDegree)

      blockMovingToPending = nextBlockInQueue
      blockMovingToPending.startMoving(-90)

      nextBlockInQueue = newQueuedBlock()
    }
  })

  animate(step)
}
