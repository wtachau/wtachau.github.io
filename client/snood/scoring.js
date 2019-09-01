export const scoreForTurn = (numberInGroup, numberIslands) => {
  const forGroup = numberInGroup * numberInGroup + 1
  const forIslands = numberIslands * numberIslands * 10

  return forGroup + forIslands
}
