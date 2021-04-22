import { monitorKeysPressedInOrder } from "utilities/InteractionUtilities";
import { updateYourScore } from "utilities/DisplayUtilities";

import FoodBlock from "./foodBlock";
import SnakeBlock from "./snakeBlock";

import { randomX, randomY } from "./randomLocations";
import {
  determineNewDirection,
  moveNewSnakeHead,
  checkForCollisions,
  checkForFood,
  checkForGoneOffEdge,
  removeLastBlockIfNecessary,
} from "./updates";

export default (animate, defaultRender, isPaused) => {
  let yourScore;
  let snake;
  let snakeDirection;
  const snakeLength = 5;
  const food = new FoodBlock(randomX(), randomY());

  const newGame = () => {
    snake = [];
    snakeDirection = 1;
    snake[0] = new SnakeBlock(randomX(), randomY(), snakeLength);
    yourScore = 0;
  };
  newGame();

  // Keep track of which keys have been pressed
  const keysDown = [];
  monitorKeysPressedInOrder(keysDown);

  const render = () => {
    updateYourScore(yourScore);
    snake.forEach((s) => s.render());
    food.render();
  };

  const update = () => {
    const prevSnakeHead = snake[0];
    const newSnakeHead = new SnakeBlock(
      prevSnakeHead.x,
      prevSnakeHead.y,
      snake.length
    );

    snakeDirection = determineNewDirection(keysDown, snakeDirection);
    moveNewSnakeHead(newSnakeHead, snakeDirection);
    snake.unshift(newSnakeHead);

    checkForCollisions(snake, newGame);
    checkForFood(snake, food, () => {
      yourScore += 1;
      snake.forEach((s) => {
        s.duration += 6;
      });
    });
    snake.forEach((s) => {
      s.duration -= 1;
    });
    checkForGoneOffEdge(snake);
    removeLastBlockIfNecessary(snake);
  };

  const step = () => {
    if (!isPaused()) {
      update();
    }
    defaultRender();
    render();
  };

  setInterval(step, 60);
};
