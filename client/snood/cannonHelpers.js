import { radiansToDegrees } from 'utilities/DisplayUtilities'

export const findCannonDegree = (cannon, mouseListener) => {
  return radiansToDegrees(
    Math.atan2(
      mouseListener.getMouseY() - cannon.y,
      mouseListener.getMouseX() - cannon.x
    )
  ) + 90
}

export const foo = 'bar'
