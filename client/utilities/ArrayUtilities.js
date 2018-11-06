const arrayFrom1ToN = (n) => {
  return Array.from(Array(n).keys())
}

const randomElement = (items) => {
  return items[Math.floor(Math.random() * items.length)]
}

const mininumElement = (array, func) => {
  let minimum = array[0]
  array.forEach((el) => {
    if (func(el) < func(minimum)) {
      minimum = el
    }
  })
  return minimum
}


module.exports = {
  arrayFrom1ToN,
  randomElement,
  mininumElement
}
