export const distanceBetweenPoints = (point1, point2) => {
  const width = point1.x - point2.x;
  const height = point1.y - point2.y;

  return Math.sqrt(width * width + height * height);
};

export const degreesToRadians = degrees => {
  return (degrees * Math.PI) / 180;
};

export const radiansToDegrees = radians => {
  return (radians * 180) / Math.PI;
};

export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
