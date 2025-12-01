let value1 = "";
let opp = "";
let value2 = "";

document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", (event) => {
    const number = parseInt(event.target.getAttribute("data-value"));
    const display = document.querySelector(".js-display");

    if (opp === "") {
      value1 += number;
      display.value = value1;
    } else {
      value2 += number;
      display.value = `${value1} ${opp} ${value2}`
    }
  })
});

document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", (event) => {
     const display = document.querySelector(".js-display");
     opp = event.target.getAttribute("data-value");
     display.value = `${value1} ${opp}`

  });
});

document.querySelector(".equal").addEventListener("click", () => {
  const display = document.querySelector(".js-display");
  let result;
  switch (opp) {
    case "+":
      result = add(parseFloat(value1), parseFloat(value2));
      break;
    case "-":
      result = substract(parseFloat(value1), parseFloat(value2));
      break;
    case "x":
      result = multiply(parseFloat(value1), parseFloat(value2));
      break;
    case "÷":
      result = divide(parseFloat(value1), parseFloat(value2));
      break;
  }
  display.value = `${value1} ${opp} ${value2} = ${result} `
})

  document.querySelector(".clear").addEventListener("click", () => {
    const display = document.querySelector(".js-display");
    display.value = ''
    value1 = ''
    value2 = ''
    opp = ''

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

