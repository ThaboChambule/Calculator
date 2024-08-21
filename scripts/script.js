let value1 = '';
let opp = '';
let value2 = '';

document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", (event) => {
    const number = parseInt(event.target.getAttribute("data-value"));
    const display = document.querySelector(".js-display");
    



  });
});

function add(value1, value2) {
  return value1 + value2;
}
function substract(value1, value2) {
  return value1 - value2;
}

function multiply(value1, value2) {
  return value1 * value2;
}

function divide(value1, value2) {
  return value1 / value2;
}
