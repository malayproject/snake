const gameBoardEl = document.querySelector(".gameBoardArea");
const controlsEl = document.querySelector(".controls");
const DIRECTIONS = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};
let callbackFnInstance;
let intervalId;
function callbackFnCreator(snake) {
  return function callbackFn(e) {
    console.log(e.target);
    let key;
    switch (e.keyCode) {
      case 37:
        key = ".leftArrowContainer";
        break;
      case 38:
        key = ".upArrowContainer";
        break;
      case 39:
        key = ".rightArrowContainer";
        break;
      case 40:
        key = ".downArrowContainer";
        break;
      default:
        return;
    }
    document.querySelector(key).classList.add("scaledUp");
    setTimeout(
      () => document.querySelector(key).classList.remove("scaledUp"),
      100
    );
    if (snake.velocity === e.keyCode - 2 || snake.velocity === e.keyCode + 2)
      return;
    clearInterval(intervalId);
    intervalId = setInterval(() => snake.moveBody(e.keyCode, intervalId), 150);
    console.log(intervalId, 52);
  };
}

function generateFoodCell(snake) {
  let foodCellId;
  do {
    foodCellId = Math.floor(Math.random() * 3600);
  } while (snake.bodyCellsSet.has(foodCellId));
  document.querySelector(`#cell${foodCellId}`).classList.add("foodCell");
}

function init() {
  gameBoardEl.style.backgroundColor = "#2024cd"; //"#5054cd" blue
  gameBoardEl.innerHTML = "";
  const totalCells = 3600;
  for (let i = 0; i < totalCells; i++) {
    const cellEl = document.createElement("div");
    cellEl.id = `cell${i}`;
    cellEl.style.width = "1rem";
    cellEl.style.height = "1rem";
    gameBoardEl.appendChild(cellEl);
  }
  const snake = new SnakeBody();
  generateFoodCell(snake);
  callbackFnInstance = callbackFnCreator(snake);
  window.addEventListener("keydown", callbackFnInstance);
}

class SnakeBody {
  constructor() {
    this.head = 1830;
    this.bodyCellsSet = new Set([this.head]);
    this.length = 1;
    this.velocity = null;
    this.body = [this.head, 1829, 1828, 1827];
    this.body.forEach((cell) => {
      document.querySelector(`#cell${cell}`).classList.add("snakeCell");
    });
  }

  setVelocity(direction) {
    this.velocity = direction;
  }

  isSnakeCell(cellId) {
    return this.bodyCellsSet.has(cellId);
  }
  checkWall(newVelocity) {
    console.log("checkWall called");
    const head = this.body[0];
    switch (newVelocity) {
      case 37:
        if (head % 60 === 0) {
          return true;
        }
        break;
      case 38:
        if (head < 60) {
          return true;
        }
        break;
      case 39:
        if (head % 60 === 59) {
          return true;
        }
        break;
      case 40:
        if (head > 3539) {
          return true;
        }
        break;
      default:
        return false;
    }
  }

  moveBody(newVelocity, intervalId) {
    console.log(intervalId, 105);
    let isHittingWall = this.checkWall(newVelocity, intervalId);
    if (isHittingWall) {
      alert(" GAME OVER");
      clearInterval(intervalId);
      window.removeEventListener("keydown", callbackFnInstance);
      init();
      return;
    }
    let tempCell = null;
    this.body.forEach((bodyCell, index) => {
      document.querySelector(`#cell${bodyCell}`).classList.remove("snakeCell");
      if (bodyCell === this.body[0]) {
        tempCell = bodyCell;
        this.velocity = newVelocity;
        switch (newVelocity) {
          case DIRECTIONS.UP:
            bodyCell -= 60;
            break;
          case DIRECTIONS.LEFT:
            bodyCell -= 1;
            break;
          case DIRECTIONS.RIGHT:
            bodyCell += 1;
            break;
          default:
            bodyCell += 60;
        }
      } else {
        const temp = bodyCell;
        bodyCell = tempCell;
        tempCell = temp;
      }
      this.body[index] = bodyCell;
      document.querySelector(`#cell${bodyCell}`).classList.add("snakeCell");
    });
  }
}

init();
