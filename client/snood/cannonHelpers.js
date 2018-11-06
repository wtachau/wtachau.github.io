import { radiansToDegrees } from 'utilities/DisplayUtilities'

export const findCannonDegree = (cannon, mouseListener) => {
  const rawValue = radiansToDegrees(
    Math.atan2(
      mouseListener.getMouseY() - cannon.y,
      mouseListener.getMouseX() - cannon.x
    )
  ) + 90

  if (rawValue > 180) {
    return -89
  }
  if (rawValue > 89) {
    return 89
  }
  return rawValue
}

export const foo = 'bar'
