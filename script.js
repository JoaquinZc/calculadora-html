let screenElement = null;

function getScreen() {
  if(!screenElement) {
    screenElement = document.querySelector("#screen p");
  }
  return screenElement;
}

function addNumber(number) {
  const screen = getScreen();

  console.log(number);

  if(number === "." && screen.innerHTML.includes(".") !== -1) {
    return ;
  }

  screen.innerHTML =
    screen.innerHTML === "0" && number !== "." ? number :
    `${screen.innerHTML}${number}`;
}

function onClickButton() {
  const key = this.innerText ?? "none";
  
  if(!isNaN(parseInt(key)) || key === ".") {
    return addNumber(key);
  }
}

function initCore() {
  const buttons = document.querySelectorAll(".container button");
  
  buttons.forEach(button => {
    button.addEventListener("click", onClickButton)
  });
}

window.addEventListener("DOMContentLoaded", initCore);