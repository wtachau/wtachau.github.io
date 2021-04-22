const pageWidth = document.querySelector("html").clientWidth;

export const defaultAnimation = (callback) => {
  const fps = 60;
  window.setTimeout(callback, 1000 / fps);
};

const animateFunction =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  defaultAnimation;

export const animate = (draw) => {
  var fps = 120;
  return setTimeout(() => {
    animateFunction(draw);
  }, 1000 / fps);
};

export const defaultRender = () => {
  window.canvas.width = pageWidth;
  window.canvas.height = window.innerHeight;

  const nameElement = document.getElementById("name");
  const subtextElement = document.getElementById("subtext");
  const yourScoreElement = document.getElementById("yourScore");
  const compScoreElement = document.getElementById("compScore");

  const scorePadding = 80;

  // set coordinates of elements in canvas
  nameElement.style.top = window.innerHeight / 2 - 60 + "px";
  nameElement.style.left = (pageWidth - nameElement.clientWidth) / 2 + "px";

  subtextElement.style.top = window.innerHeight / 2 - 20 + "px";
  subtextElement.style.left =
    (pageWidth - subtextElement.clientWidth) / 2 + "px";

  yourScoreElement.style.top = 20 + "px";
  yourScoreElement.style.left = pageWidth - scorePadding + "px";

  compScoreElement.style.top = 20 + "px";
  compScoreElement.style.left = scorePadding + "px";
};

export const createCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = pageWidth;
  canvas.height = window.innerHeight;
  return canvas;
};

export const addCanvas = () => {
  window.canvas = createCanvas();
  window.context = window.canvas.getContext("2d");
  document.getElementById("page1").appendChild(window.canvas);
};

export const removeCanvas = () => {
  document.getElementById("page1").removeChild(window.canvas);
};
