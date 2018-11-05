import { limeGreen } from 'constants/colors'

import { snakeWidth } from './constants'

class SnakeBlock {
  constructor(x, y, dur) {
    this.x = x
    this.y = y
    this.size = snakeWidth
    this.duration = dur
  }

  render() {
    window.context.fillStyle = limeGreen
    window.context.fillRect(this.x, this.y, this.size, this.size)
  }
}

export default SnakeBlock
