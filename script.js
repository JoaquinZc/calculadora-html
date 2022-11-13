const touchSound = new Audio("sounds/touch.wav");
/** @type {HTMLElement} */
let screenElement = null;
let lastValue = "0";
/** @type {"none" | "+" | "-" | "/" | "*" | "%"} */
let currentOperation = "none";

const MESSAGE_ERROR = "Math error";

function getScreen() {
  if(!screenElement) {
    screenElement = document.querySelector("#screen p");
  }
  return screenElement;
}

/**
 * 
 * @param {number} result 
 */
function showResult(result, show = true) {
  const screen = getScreen();

  if(isNaN(result)) {
    const button = document.querySelectorAll(".special")[1];
    button?.classList.contains("throb") === false && button.classList.add("throb");
    return screen.innerHTML = MESSAGE_ERROR;
  }

  const value = `${result}`;
  const positionDecimalValue = value.search(/\./g);
  const countDecimalValue = positionDecimalValue === -1 ? 0 : value.slice(positionDecimalValue, value.length).length;
  const realValue = result.toFixed(countDecimalValue > 8 ? 8 : countDecimalValue);
  lastValue = realValue;
  show === true && (screen.innerHTML = realValue);
}

function clearCalc(all, clearValue=true) {
  if(all === true) {
    lastValue = "0";
    currentOperation = "none";

    const button = document.querySelectorAll(".special")[1];
    button?.classList.contains("throb") === true && button.classList.remove("throb");
  
    document.querySelectorAll(".two").forEach(button => (
      button.classList.contains("disabled") && button.classList.remove("disabled")
    ));
  }

  clearValue === true && (getScreen().innerHTML = "0");
}

function resolveOperation() {
  const screen = getScreen();
  const last = lastValue.includes(".") ? parseFloat(lastValue) : parseInt(lastValue);
  const now = screen.innerHTML.includes(".") ? parseFloat(screen.innerHTML) : parseInt(screen.innerHTML);
  const operation = currentOperation;

  console.log({ operation, last });

  if(operation === "none" || isNaN(last)) {
    return ;
  }

  let result =
    operation === "+" ? (last + now) :
    operation === "-" ? (last - now) :
    operation === "/" ? (last / now) :
    operation === "*" ? (last * now) :
    operation === "%" ? (last * (now / 100)) :
    NaN;

  !isNaN(result) && clearCalc(true, false);
  showResult(result);
}

function addOperator(operator) {
  const screen = getScreen();
  const value = screen.innerHTML.includes(".") ? parseFloat(screen.innerHTML) : parseInt(screen.innerHTML);
  //const lvalue = lastValue.includes(".") ? parseFloat(lastValue) : parseInt(lastValue);

  console.log({ operator });

  if(operator === "1/x") {
    return showResult(1/value);
  }

  if(operator === "√") {
    return showResult(Math.sqrt(value));
  }

  if(currentOperation !== "none") {
    return ;
  }

  currentOperation = operator;
  showResult(value);
  screen.innerHTML = "0";
  document.querySelectorAll(".two").forEach(button => !button.classList.contains("disabled") && button.classList.add("disabled"));
}

function addNumber(number) {
  const screen = getScreen();

  console.log(number, screen.innerHTML);

  if(number === "." && screen.innerHTML.includes(".")) {
    return ;
  }

  screen.innerHTML =
    screen.innerHTML === "0" && number !== "." ? number :
    `${screen.innerHTML}${number}`;
}

function removeNumber() {
  const screen = getScreen();
  
  if(screen.innerHTML === "0") {
    return ;
  }

  screen.innerHTML =
    screen.innerHTML.search(/^(\-)?[0-9]$/) !== -1 ? "0" :
    screen.innerHTML.slice(0, screen.innerHTML.length - 1);
}

function changeSign() {
  const screen = getScreen();
  const haveSign = screen.innerHTML.includes("-");

  if(screen.innerHTML === "0") {
    return ;
  }
  
  screen.innerHTML =
    haveSign ? screen.innerHTML.replace("-", "") :
    `-${screen.innerHTML}`
}

function onClickButton() {
  const key = this.innerText ?? "none";
  const screen = getScreen();

  if(screen.innerHTML === MESSAGE_ERROR && key !== "C") {
    return ;
  }

  if(key === "CE" || key == "C") {
    clearCalc(key === "C");
  }
  else if(key.search(/^[0-9\.]$/) !== -1) {
    addNumber(key);
  }
  else if(key.search(/^([\+\-\/\%\*√]|(1\/x))$/) !== -1) {
    addOperator(key);
  }
  else if(key === "=") {
    resolveOperation();
  }
  else if(key === "Retr") {
    removeNumber();
  }
  else if(key === "+/-") {
    changeSign();
  }

  touchSound.play();
}

function initCore() {
  const buttons = document.querySelectorAll(".container button");
  
  buttons.forEach(button => {
    button.addEventListener("click", onClickButton)
  });
}

window.addEventListener("DOMContentLoaded", initCore);