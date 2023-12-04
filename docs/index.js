const gameBoardEl = document.querySelector(".gameBoardArea");
const controlsEl = document.querySelector(".controls");
const resetControllerEl = document.querySelector(".restController");
const scoreEl = document.querySelector(".scoreCount");

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
    intervalId = setInterval(
      () => snake.moveBody(e.keyCode, intervalId),
      Math.max(80, 180 - snake.length * 3)
    );
  };
}

function generateFoodCell(snake) {
  let foodCellId;
  do {
    foodCellId = Math.floor(Math.random() * 1600);
  } while (snake.bodyCellsSet.has(foodCellId));
  console.log(`count: ${snake.length - 1}`);
  document.querySelector(`#cell${foodCellId}`).classList.add("foodCell");
}

function reset() {
  scoreEl.innerText = 0;
  clearInterval(intervalId);
  window.removeEventListener("keydown", callbackFnInstance);
  window.removeEventListener("click", init);
}

function init(e) {
  if (e?.target.innerText === "Reset") {
    reset();
  }

  gameBoardEl.style.backgroundColor = "#005b41"; //"#5054cd" blue
  gameBoardEl.innerHTML = "";
  const totalCells = 1600;
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
  window.addEventListener("click", init);
}

class SnakeBody {
  constructor() {
    this.head = 820;
    this.body = [this.head];
    this.bodyCellsSet = new Set(this.body);
    this.length = 1;
    this.velocity = null;
    this.speed = 180;
    console.log(this.bodyCellsSet);
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
  checkWallOrSelf(newVelocity) {
    console.log("checkWall called");
    const head = this.body[0];
    switch (newVelocity) {
      case 37:
        if (head % 40 === 0 || this.bodyCellsSet.has(head - 1)) {
          return true;
        }
        break;
      case 38:
        if (head < 40 || this.bodyCellsSet.has(head - 40)) {
          return true;
        }
        break;
      case 39:
        if (head % 40 === 39 || this.bodyCellsSet.has(head + 1)) {
          return true;
        }
        break;
      case 40:
        if (head > 1599 || this.bodyCellsSet.has(head + 40)) {
          return true;
        }
        break;
      default:
        return false;
    }
  }

  moveBody(newVelocity, intervalId) {
    const isHittingWallOrSelf = this.checkWallOrSelf(newVelocity);
    if (isHittingWallOrSelf) {
      alert("GAME OVER, TRY AGAIN!!!");
      clearInterval(intervalId);
      window.removeEventListener("keydown", callbackFnInstance);
      init();
      return;
    }

    const foodCellEls = Array.from(document.querySelectorAll(".foodCell"));
    const activeFoodCellEl = foodCellEls.filter((foodCellEl) => {
      return !this.bodyCellsSet.has(Number(foodCellEl.id.slice(4)));
    })[0];
    const foodCellId = Number(activeFoodCellEl.id.slice(4));
    switch (newVelocity) {
      case DIRECTIONS.LEFT:
        if (foodCellId === this.body[0] - 1) {
          this.length = this.body.unshift(foodCellId);
          scoreEl.innerText = this.length - 1;
          document
            .querySelector(`#cell${foodCellId}`)
            .classList.add("snakeCell");
          // foodCellEl.classList.remove("foodCell");
          generateFoodCell(this);
        }
        break;
      case DIRECTIONS.UP:
        if (foodCellId === this.body[0] - 40) {
          this.length = this.body.unshift(foodCellId);
          document.querySelector(".scoreCount").innerText = this.length - 1;
          document
            .querySelector(`#cell${foodCellId}`)
            .classList.add("snakeCell");
          // foodCellEl.classList.remove("foodCell");
          generateFoodCell(this);
        }
        break;
      case DIRECTIONS.RIGHT:
        if (foodCellId === this.body[0] + 1) {
          this.length = this.body.unshift(foodCellId);
          document.querySelector(".scoreCount").innerText = this.length - 1;
          document
            .querySelector(`#cell${foodCellId}`)
            .classList.add("snakeCell");
          // foodCellEl.classList.remove("foodCell");
          generateFoodCell(this);
        }
        break;
      case DIRECTIONS.DOWN:
        if (foodCellId === this.body[0] + 40) {
          this.length = this.body.unshift(foodCellId);
          document.querySelector(".scoreCount").innerText = this.length - 1;
          document
            .querySelector(`#cell${foodCellId}`)
            .classList.add("snakeCell");
          // foodCellEl.classList.remove("foodCell");
          generateFoodCell(this);
        }
        break;
      default:
        console.log("default");
        return;
    }

    let tempCell = null;
    this.body.forEach((bodyCell, index) => {
      document.querySelector(`#cell${bodyCell}`).classList.remove("snakeCell");
      if (bodyCell === this.body[0]) {
        tempCell = bodyCell;
        this.velocity = newVelocity;
        switch (newVelocity) {
          case DIRECTIONS.LEFT:
            bodyCell -= 1;
            break;
          case DIRECTIONS.UP:
            bodyCell -= 40;
            break;
          case DIRECTIONS.RIGHT:
            bodyCell += 1;
            break;
          default:
            bodyCell += 40;
        }
      } else {
        const temp = bodyCell;
        bodyCell = tempCell;
        tempCell = temp;
      }
      this.body[index] = bodyCell;
      document.querySelector(`#cell${bodyCell}`).classList.add("snakeCell");
    });
    const foodSnakeCells = document.querySelectorAll(".snakeCell.foodCell");
    console.log(foodSnakeCells, 1112);
    foodSnakeCells.forEach((foodSnakeCell) => {
      if (foodSnakeCell.id === `cell${this.body.at(-1)}`) {
        document
          .querySelector(`#cell${this.body.at(-1)}`)
          .classList.remove("foodCell");
      }
    });

    // if (
    //   document.querySelector(".snakeCell.foodCell")?.id ===
    //   `cell${this.body.at(-1)}`
    // ) {
    //   document
    //     .querySelector(`#cell${this.body.at(-1)}`)
    //     .classList.remove("foodCell");
    // }

    // foodCellHandler(this, tempCell);
    // console.log(this.body);
    this.bodyCellsSet.clear();
    this.bodyCellsSet = new Set(this.body);
    // console.log("1091", this.body);
    // console.log("1091", this.bodyCellsSet);
  }
}

init();
