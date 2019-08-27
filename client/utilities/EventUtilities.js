const LEFT = 37;
const RIGHT = 39;
const UP = 38;
const DOWN = 40;

const matchesKeyCode = (event, keyCode) => {
  return event.keyCode === keyCode;
};

const isSpace = event => {
  return matchesKeyCode(event, 32);
};

const isLeftArrow = event => {
  return matchesKeyCode(event, LEFT);
};

const isUpArrow = event => {
  return matchesKeyCode(event, UP);
};

const isRightArrow = event => {
  return matchesKeyCode(event, RIGHT);
};

const isDownArrow = event => {
  return matchesKeyCode(event, DOWN);
};

const isArrowKey = event => {
  return (
    isLeftArrow(event) ||
    isUpArrow(event) ||
    isRightArrow(event) ||
    isDownArrow(event)
  );
};

module.exports = {
  isSpace,
  isLeftArrow,
  isUpArrow,
  isRightArrow,
  isDownArrow,
  isArrowKey,
  LEFT,
  RIGHT,
  UP,
  DOWN
};
