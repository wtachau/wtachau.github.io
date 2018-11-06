import { degreesToRadians } from 'utilities/MathUtilities'
import { black, limeGreen } from 'constants/colors'

const cannonWidth = 15
const cannonHeight = 80
const cannonLoadingRadius = 30
const cannonLoadingWidth = 10

class Cannon {
  constructor(x, y, degree) {
    this.x = x
    this.y = y
    this.degree = degree
  }

  render() {
    const c = window.context
    // The "gun" of the cannon
    c.fillStyle = limeGreen

    c.save()
    c.translate(this.x, this.y)
    c.rotate(degreesToRadians(this.degree))

    c.fillRect(
      -cannonWidth / 2,
      -cannonWidth / 2,
      cannonWidth,
      -cannonHeight
    )
    c.restore()

    // The green ring
    c.beginPath()
    c.arc(this.x, this.y, cannonLoadingRadius, 2 * Math.PI, false)
    c.strokeStyle = limeGreen
    c.lineWidth = cannonLoadingWidth
    c.stroke()

    // An circle on top to hide the inner part of the "gun"
    c.beginPath()
    c.arc(this.x, this.y, cannonLoadingRadius - cannonLoadingWidth / 2, 2 * Math.PI, false)
    c.fillStyle = black
    c.fill()
  }

  update(degree) {
    this.degree = degree
  }
}

export default Cannon
