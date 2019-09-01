import { snakeWidth } from './constants'
import { nearestBlock, randomX, randomY } from './randomLocations'

export const determineNewDirection = (keysDown, initialDirection) => {
  let direction = initialDirection

  // Depending on last direction pressed, change where new block is added
  const numKeysPressed = keysDown.length
  for (let i = 0; i < numKeysPressed; i += 1) {
    const value = Number(keysDown[i])

    if (value === 40 && direction !== 2) { // up
      direction = 0
    } else if (value === 39 && direction !== 3) { // right
      direction = 1
    } else if (value === 38 && direction !== 0) { // down
      direction = 2
    } else if (value === 37 && direction !== 1) { // left
      direction = 3
    }
    delete keysDown[i]
  }

  return direction
}

export const moveNewSnakeHead = (snakeHead, direction) => {
  switch (direction) {
    case 0: // up
      snakeHead.y += snakeWidth
      break
    case 1: // right
      snakeHead.x += snakeWidth
      break
    case 2: // down
      snakeHead.y -= snakeWidth
      break
    default: // left
      snakeHead.x -= snakeWidth
  }
}

export const checkForCollisions = (snake, startNewGame) => {
  const head = snake[0]
  snake.slice(1).forEach((s) => {
    if (head.x === s.x && head.y === s.y) {
      startNewGame()
    }
  })
}

export const checkForFood = (snake, food, addTail) => {
  if (snake.length > 0
     && snake[0].x === food.x - snakeWidth
     && snake[0].y === food.y - snakeWidth) {
    addTail()
    food.x = randomX()
    food.y = randomY()
  }
}

export const checkForGoneOffEdge = (snake) => {
  // And if something has gone off the edge
  snake.forEach((s) => {
    if (s.y - snakeWidth < 0) {
      s.y = nearestBlock(window.innerHeight + (s.y - snakeWidth))
    } else if (s.y + snakeWidth > window.innerHeight) {
      s.y = nearestBlock(snakeWidth)
    } else if (s.x - snakeWidth < 0) {
      s.x = nearestBlock(window.innerWidth + (s.x - snakeWidth))
    } else if (s.x + snakeWidth > window.innerWidth) {
      s.x = nearestBlock(snakeWidth)
    }
  })
}

export const removeLastBlockIfNecessary = (snake) => {
  const indexLimit = snake.length - 1
  if (snake[indexLimit].duration <= 0) {
    snake.splice(indexLimit, 1)
  }
}
