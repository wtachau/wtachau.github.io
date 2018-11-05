const arrayFrom1ToN = (n) => {
  return Array.from(Array(n).keys())
}

const randomElement = (items) => {
  return items[Math.floor(Math.random() * items.length)]
}

const flatten = (array) => {
  return array.reduce((el1, el2) => el1.concat(el2), [])
}

const flatMap = (elements, f) => {
  return flatten(elements.map(f))
}

module.exports = {
  arrayFrom1ToN,
  randomElement,
  flatMap
}
