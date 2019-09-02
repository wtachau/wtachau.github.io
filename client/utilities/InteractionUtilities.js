const monitorKeysPressed = keysDown => {
  window.addEventListener("keydown", event => {
    keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", event => {
    delete keysDown[event.keyCode];
  });
};

const listenForKeys = callback => {
  window.addEventListener("keydown", callback);
};

const monitorKeysPressedInOrder = keysDown => {
  window.addEventListener("keydown", event => {
    keysDown.push(event.keyCode);
  });
};

module.exports = {
  monitorKeysPressed,
  monitorKeysPressedInOrder,
  listenForKeys
};
