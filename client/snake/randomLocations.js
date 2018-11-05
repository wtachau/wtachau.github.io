import { snakeWidth } from './constants'

export const nearestBlock = (num) => {
  return Math.round(num / snakeWidth) * snakeWidth
}

export const randomX = () => {
  // random number between 1 and window limit
  let rand = Math.floor((Math.random() * window.innerWidth) + 1)
  // round to nearest block
  let x = nearestBlock(rand)

  while (x <= 10) {
    rand = Math.floor((Math.random() * window.innerHeight) + 1)
    x = nearestBlock(rand)
  }
  return x
}

export const randomY = () => {
  // random number between 1 and window limit
  let rand = Math.floor((Math.random() * window.innerHeight) + 1)
  // round to nearest block
  let y = nearestBlock(rand)
  while (y <= 10) {
    rand = Math.floor((Math.random() * window.innerHeight) + 1)
    y = nearestBlock(rand)
  }
  return y
}
