import {
  limeGreen,
  pink,
  yellow,
  orange,
  cyan,
  red,
  purple
} from 'constants/colors'
import { blockSize } from './constants'

class TetrisSquare {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.type = type
  }

  render() {
    switch (this.type) {
      case 0:
        window.context.fillStyle = pink; break
      case 1:
        window.context.fillStyle = yellow; break
      case 2:
        window.context.fillStyle = limeGreen; break
      case 3:
        window.context.fillStyle = orange; break
      case 4:
        window.context.fillStyle = cyan; break
      case 5:
        window.context.fillStyle = red; break
      case 6:
        window.context.fillStyle = purple; break
      default:
        break
    }
    window.context.fillRect(
      this.x,
      this.y,
      blockSize - 1,
      blockSize - 1
    )
  }
}

export default TetrisSquare
