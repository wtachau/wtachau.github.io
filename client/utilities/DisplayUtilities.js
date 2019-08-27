const elementFromID = id => {
  return document.getElementById(id);
};

const hideElement = element => {
  element.style.display = "none";
};

const showElement = element => {
  element.style.display = "block";
};

const hideElementById = id => {
  hideElement(elementFromID(id));
};

const showElementById = id => {
  showElement(elementFromID(id));
};

const updateInnerHTML = (elementID, html) => {
  elementFromID(elementID).innerHTML = html;
};

const updateYourScore = score => {
  updateInnerHTML("yourScore", score);
};

const updateComputerScore = score => {
  updateInnerHTML("compScore", score);
};

const screenCenter = {
  centerX: Math.floor(window.innerWidth / 2),
  centerY: Math.floor(window.innerHeight / 2)
};

module.exports = {
  hideElement,
  showElement,
  hideElementById,
  showElementById,
  updateYourScore,
  updateComputerScore,
  screenCenter
};
