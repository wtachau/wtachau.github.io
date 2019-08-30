import { blockSize, movingSpeed, numBlocks, newBlockDelay } from "./constants";
import { fontName } from "utilities/DisplayUtilities";
import { limeGreen } from "constants/colors";

export const addColorMenu = () => {
  window.retro = true;
  const setText = () => {
    colorOption.innerHTML = window.retro
      ? "classic colors >"
      : "retro colors >";
  };

  const colorOption = document.createElement("div");
  colorOption.id = "color-option";
  colorOption.style.color = limeGreen;
  colorOption.style.position = "absolute";
  colorOption.style.top =
    (window.innerHeight - blockSize * numBlocks) / 2 - 40 + "px";
  colorOption.style.left =
    (window.innerWidth - blockSize * numBlocks) / 2 + "px";
  colorOption.style.width = blockSize * numBlocks + "px";
  colorOption.style.textAlign = "center";
  colorOption.style.cursor = "pointer";
  colorOption.style.fontFamily = `"${fontName}"`;
  colorOption.style.fontSize = "12px";
  setText();
  colorOption.onclick = () => {
    window.retro = !window.retro;
    setText();
  };
  document.getElementById("page1").appendChild(colorOption);
};
