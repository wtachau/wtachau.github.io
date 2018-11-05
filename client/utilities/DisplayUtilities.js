const hideElement = (element) => {
  element.style.display = 'none'
}

const showElement = (element) => {
  element.style.display = 'block'
}

const hideElementById = (id) => {
  hideElement(document.getElementById(id))
}

const showElementById = (id) => {
  showElement(document.getElementById(id))
}

module.exports = {
  hideElement,
  showElement,
  hideElementById,
  showElementById
}
