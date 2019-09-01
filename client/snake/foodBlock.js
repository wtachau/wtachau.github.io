import { limeGreen } from 'constants/colors'

import { snakeWidth } from './constants'

class FoodBlock {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  render() {
    window.context.beginPath()
    window.context.arc(
      this.x - snakeWidth / 2,
      this.y - snakeWidth / 2,
      snakeWidth / 2,
      2 * Math.PI, false
    )
    window.context.fillStyle = limeGreen
    window.context.fill()
  }
}

export default FoodBlock
